'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

const ENTRY_KEY = 'td_visit';

/**
 * Reports each page/route change.
 *  - Google Analytics: the gtag snippet sends the first page view itself, so
 *    only later in-app navigations are sent from here.
 *  - First-party beacon (/api/track/): feeds the admin panel. The first page of a
 *    visit also carries the referrer and any utm_* tags so the visit can be
 *    attributed to Google, Bing, social, a campaign or direct traffic. The server
 *    works out device/browser/IP itself.
 */
export function PageTracker() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return;

    if (!first.current) {
      trackEvent('page_view', {
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
      });
    }

    // A visit starts when this tab has not been counted yet. sessionStorage
    // stops a page reload from being counted as a second visit from the same source.
    let entry = false;
    try {
      if (first.current && !sessionStorage.getItem(ENTRY_KEY)) {
        sessionStorage.setItem(ENTRY_KEY, '1');
        entry = true;
      }
    } catch {
      entry = first.current; // storage blocked: treat the first page of a load as the entry
    }
    first.current = false;

    const params = new URLSearchParams(window.location.search);
    const payload = JSON.stringify({
      path: pathname,
      entry,
      referrer: entry ? document.referrer : '',
      utm: entry
        ? { source: params.get('utm_source'), medium: params.get('utm_medium'), campaign: params.get('utm_campaign') }
        : undefined,
    });

    try {
      if (!navigator.sendBeacon?.('/api/track/', new Blob([payload], { type: 'application/json' }))) {
        void fetch('/api/track/', { method: 'POST', body: payload, headers: { 'Content-Type': 'application/json' }, keepalive: true });
      }
    } catch {
      // Tracking must never affect the page.
    }
  }, [pathname]);

  return null;
}
