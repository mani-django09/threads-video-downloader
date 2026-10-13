import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';
import { getVisitor, referrerHost } from '@/lib/visitor';
import { logEvent } from '@/lib/logger';
import { classifySource } from '@/lib/source';
import { SITE_URL } from '@/lib/site';

export const runtime = 'nodejs';

// A route, nothing else: letters, digits, dashes, underscores, dots and slashes.
const PATH_RE = /^\/[A-Za-z0-9\-_/.]{0,150}$/;

interface TrackBody {
  path?: unknown;
  referrer?: unknown;
  /** True on the first page of a visit, the only page whose referrer says where the visitor came from. */
  entry?: unknown;
  utm?: { source?: unknown; medium?: unknown; campaign?: unknown };
}

/**
 * First-party page view beacon, sent by the browser on each page/route change.
 * Bots are dropped, only the route, the referring host and any utm_* tags are
 * stored, and the reply is always empty.
 */
export async function POST(req: NextRequest) {
  const visitor = getVisitor(req.headers);
  if (visitor.device === 'bot') return new NextResponse(null, { status: 204 });

  const rate = checkRateLimit(`track:${visitor.ipHash}`, 60_000, 120);
  if (!rate.allowed) return new NextResponse(null, { status: 204 });

  let body: TrackBody = {};
  try {
    body = await req.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const path = typeof body.path === 'string' ? body.path : '';
  // Admin and API routes are not site traffic.
  if (!PATH_RE.test(path) || path.startsWith('/admin') || path.startsWith('/api')) {
    return new NextResponse(null, { status: 204 });
  }

  const ownHost = new URL(SITE_URL).hostname;
  const host = referrerHost(typeof body.referrer === 'string' ? body.referrer : null, ownHost);
  const entry = body.entry === true;
  const traffic = entry ? classifySource(host, body.utm) : null;

  logEvent({
    event: 'page_view',
    status: 'success',
    page: path,
    referrer: host,
    entry,
    source: traffic?.source,
    medium: traffic?.medium,
    campaign: traffic?.campaign,
    visitor,
  });

  return new NextResponse(null, { status: 204 });
}
