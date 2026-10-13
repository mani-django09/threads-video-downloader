import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminGuard';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RANGES = { '24h': 24 * 3600_000, '7d': 7 * 24 * 3600_000, '30d': 30 * 24 * 3600_000 } as const;
type RangeKey = keyof typeof RANGES;

const RETENTION_DAYS = 90;
const MAX_ROWS = 200_000;

// Old rows are removed so the log cannot grow without bound (and matches the privacy policy).
const g = globalThis as typeof globalThis & { __lastPrune?: number };
async function pruneOldEvents() {
  const now = Date.now();
  if (g.__lastPrune && now - g.__lastPrune < 3600_000) return;
  g.__lastPrune = now;
  await prisma.downloadEvent
    .deleteMany({ where: { createdAt: { lt: new Date(now - RETENTION_DAYS * 86400_000) } } })
    .catch(() => undefined);
}

function top<T extends string | null>(values: T[], limit = 8, nullLabel = 'Unknown') {
  const counts = new Map<string, number>();
  for (const v of values) {
    const key = v ?? nullLabel;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

const rate = (num: number, den: number) => (den > 0 ? Number(((num / den) * 100).toFixed(1)) : null);
const avg = (xs: number[]) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : 0);

interface SourceAgg {
  source: string;
  medium: string;
  sessions: number;
  visitors: Set<string>;
  linksOk: number;
  downloadsOk: number;
  convertedVisitors: Set<string>;
}

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  void pruneOldEvents();

  const requested = req.nextUrl.searchParams.get('range') as RangeKey | null;
  const range: RangeKey = requested && requested in RANGES ? requested : '7d';
  const now = Date.now();
  const since = new Date(now - RANGES[range]);

  const rows = await prisma.downloadEvent.findMany({
    where: { createdAt: { gte: since } },
    select: {
      createdAt: true,
      event: true,
      visitorId: true,
      ipHash: true,
      ip: true,
      page: true,
      referrer: true,
      device: true,
      browser: true,
      os: true,
      errorCode: true,
      mediaType: true,
      processingMs: true,
      fileSize: true,
      entry: true,
      source: true,
      medium: true,
      campaign: true,
    },
    orderBy: { createdAt: 'asc' },
    take: MAX_ROWS,
  });

  const vid = (r: (typeof rows)[number]) => r.visitorId ?? (r.ipHash ? r.ipHash.slice(0, 12) : null);

  // Which source brought each visitor? The first visit that carried one wins.
  const visitorSource = new Map<string, { source: string; medium: string }>();
  for (const r of rows) {
    const id = vid(r);
    if (id && r.entry && r.source && !visitorSource.has(id)) {
      visitorSource.set(id, { source: r.source, medium: r.medium ?? 'direct' });
    }
  }

  // Time buckets: hourly for the last 24h, daily otherwise.
  const hourly = range === '24h';
  const bucketMs = hourly ? 3600_000 : 86400_000;
  const bucketCount = hourly ? 24 : Math.round(RANGES[range] / 86400_000);
  const end = Math.ceil(now / bucketMs) * bucketMs;
  const buckets = Array.from({ length: bucketCount }, (_, i) => {
    const start = end - (bucketCount - i) * bucketMs;
    return { start, pageViews: 0, fetchOk: 0, fetchFail: 0, dlOk: 0, dlFail: 0, visitors: new Set<string>() };
  });

  const allVisitors = new Set<string>();
  const allIps = new Set<string>();
  const stage = {
    submitted: new Set<string>(),
    previewed: new Set<string>(),
    clicked: new Set<string>(),
    completed: new Set<string>(),
  };
  const c = { pageViews: 0, fetchOk: 0, fetchFail: 0, clicks: 0, dlOk: 0, dlFail: 0, dlAborted: 0, rateLimited: 0 };
  const fetchMs: number[] = [];
  const dlMs: number[] = [];
  let bytesServed = 0;
  const online = new Set<string>();
  const fiveMinAgo = now - 5 * 60_000;
  const sources = new Map<string, SourceAgg>();

  const sourceFor = (id: string | null) => {
    const s = (id && visitorSource.get(id)) || { source: 'Unknown', medium: 'not recorded' };
    const key = `${s.source}|${s.medium}`;
    let agg = sources.get(key);
    if (!agg) {
      agg = { source: s.source, medium: s.medium, sessions: 0, visitors: new Set(), linksOk: 0, downloadsOk: 0, convertedVisitors: new Set() };
      sources.set(key, agg);
    }
    return agg;
  };

  for (const r of rows) {
    const id = vid(r);
    if (id) allVisitors.add(id);
    if (r.ip) allIps.add(r.ip);
    const t = r.createdAt.getTime();
    const bucket = buckets[Math.min(bucketCount - 1, Math.max(0, Math.floor((t - (end - bucketCount * bucketMs)) / bucketMs)))];
    if (bucket && id) bucket.visitors.add(id);
    if (id && t >= fiveMinAgo) online.add(id);
    if (id) sourceFor(id).visitors.add(id);

    switch (r.event) {
      case 'page_view':
        c.pageViews++;
        if (bucket) bucket.pageViews++;
        if (r.entry) sourceFor(id).sessions++;
        break;
      case 'fetch_start':
        if (id) stage.submitted.add(id);
        break;
      case 'fetch_success':
        c.fetchOk++;
        if (bucket) bucket.fetchOk++;
        if (id) stage.previewed.add(id);
        if (r.processingMs) fetchMs.push(r.processingMs);
        sourceFor(id).linksOk++;
        break;
      case 'fetch_error':
        c.fetchFail++;
        if (bucket) bucket.fetchFail++;
        break;
      case 'download_click':
        c.clicks++;
        if (id) stage.clicked.add(id);
        break;
      case 'download_success': {
        c.dlOk++;
        if (bucket) bucket.dlOk++;
        if (id) stage.completed.add(id);
        if (r.processingMs) dlMs.push(r.processingMs);
        bytesServed += r.fileSize ?? 0;
        const agg = sourceFor(id);
        agg.downloadsOk++;
        if (id) agg.convertedVisitors.add(id);
        break;
      }
      case 'download_error':
        c.dlFail++;
        if (bucket) bucket.dlFail++;
        break;
      case 'download_aborted':
        c.dlAborted++;
        if (bucket) bucket.dlFail++;
        break;
      case 'rate_limited':
        c.rateLimited++;
        break;
    }
  }

  const finished = c.dlOk + c.dlFail + c.dlAborted;
  const entries = rows.filter((r) => r.event === 'page_view' && r.entry);

  return NextResponse.json({
    success: true,
    data: {
      range,
      since: since.toISOString(),
      truncated: rows.length >= MAX_ROWS,
      retentionDays: RETENTION_DAYS,
      kpis: {
        visitors: allVisitors.size,
        uniqueIps: allIps.size,
        onlineNow: online.size,
        pageViews: c.pageViews,
        sessions: entries.length,
        fetchOk: c.fetchOk,
        fetchFail: c.fetchFail,
        fetchSuccessRate: rate(c.fetchOk, c.fetchOk + c.fetchFail),
        downloadClicks: c.clicks,
        downloadOk: c.dlOk,
        downloadFail: c.dlFail,
        downloadAborted: c.dlAborted,
        downloadSuccessRate: rate(c.dlOk, finished),
        rateLimited: c.rateLimited,
        avgFetchMs: avg(fetchMs),
        avgDownloadMs: avg(dlMs),
        bytesServed,
      },
      funnel: [
        { label: 'Visitors', count: allVisitors.size },
        { label: 'Submitted a link', count: stage.submitted.size },
        { label: 'Preview ready', count: stage.previewed.size },
        { label: 'Started a download', count: stage.clicked.size },
        { label: 'Download completed', count: stage.completed.size },
      ],
      series: buckets.map((b) => ({
        start: new Date(b.start).toISOString(),
        pageViews: b.pageViews,
        visitors: b.visitors.size,
        fetchOk: b.fetchOk,
        fetchFail: b.fetchFail,
        dlOk: b.dlOk,
        dlFail: b.dlFail,
      })),
      seriesUnit: hourly ? 'hour' : 'day',
      // Each row: where visitors came from, and how many of them went on to download.
      sources: [...sources.values()]
        .map((s) => ({
          source: s.source,
          medium: s.medium,
          sessions: s.sessions,
          visitors: s.visitors.size,
          linksOk: s.linksOk,
          downloadsOk: s.downloadsOk,
          convertedVisitors: s.convertedVisitors.size,
          conversionRate: rate(s.convertedVisitors.size, s.visitors.size),
        }))
        .sort((a, b) => b.visitors - a.visitors || b.sessions - a.sessions)
        .slice(0, 25),
      breakdowns: {
        mediums: top(entries.map((r) => r.medium), 6, 'not recorded'),
        campaigns: top(entries.filter((r) => r.campaign).map((r) => r.campaign), 8),
        landingPages: top(entries.map((r) => r.page), 8, '(unknown)'),
        pages: top(rows.filter((r) => r.event === 'page_view').map((r) => r.page), 8, '(unknown)'),
        devices: top(rows.filter((r) => r.event === 'page_view').map((r) => r.device), 6),
        browsers: top(rows.filter((r) => r.event === 'page_view').map((r) => r.browser), 8),
        os: top(rows.filter((r) => r.event === 'page_view').map((r) => r.os), 8),
        media: top(rows.filter((r) => r.event === 'fetch_success').map((r) => r.mediaType), 4),
        fetchErrors: top(rows.filter((r) => r.event === 'fetch_error').map((r) => r.errorCode), 8),
        downloadErrors: top(
          rows.filter((r) => r.event === 'download_error' || r.event === 'download_aborted').map((r) => r.errorCode),
          8,
        ),
      },
    },
  });
}
