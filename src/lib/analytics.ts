'use client';

type AnalyticsEvent = 'page_view' | 'downloader_start' | 'downloader_success' | 'downloader_error' | 'download_click' | 'caption_copy' | 'thumbnail_download';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(name: AnalyticsEvent, params: Record<string, string | number | boolean> = {}): void {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }
}
