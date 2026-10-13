import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminGuard';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RANGES = { '24h': 24 * 3600_000, '7d': 7 * 24 * 3600_000, '30d': 30 * 24 * 3600_000 } as const;

interface IpRow {
  ip: string;
  events: number;
  visitors: Set<string>;
  pageViews: number;
  fetchOk: number;
  fetchFail: number;
  downloadOk: number;
  downloadFail: number;
  rateLimited: number;
  firstSeen: string;
  lastSeen: string;
  device: string | null;
  browser: string | null;
  os: string | null;
  source: string | null;
}

/** Everything seen from each IP address, busiest first: the place to spot abuse. */
export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const requested = req.nextUrl.searchParams.get('range');
  const ms = RANGES[(requested ?? '7d') as keyof typeof RANGES] ?? RANGES['7d'];

  const [rows, blockedRows] = await Promise.all([
    prisma.downloadEvent.findMany({
      where: { createdAt: { gte: new Date(Date.now() - ms) }, ip: { not: null } },
      orderBy: { createdAt: 'asc' },
      take: 200_000,
      select: { createdAt: true, event: true, visitorId: true, ip: true, device: true, browser: true, os: true, entry: true, source: true },
    }),
    prisma.blockedIp.findMany(),
  ]);
  const blocked = new Map(blockedRows.map((b) => [b.ip, b]));

  const byIp = new Map<string, IpRow>();
  for (const r of rows) {
    if (!r.ip) continue;
    let x = byIp.get(r.ip);
    if (!x) {
      x = {
        ip: r.ip,
        events: 0,
        visitors: new Set(),
        pageViews: 0,
        fetchOk: 0,
        fetchFail: 0,
        downloadOk: 0,
        downloadFail: 0,
        rateLimited: 0,
        firstSeen: r.createdAt.toISOString(),
        lastSeen: r.createdAt.toISOString(),
        device: r.device,
        browser: r.browser,
        os: r.os,
        source: null,
      };
      byIp.set(r.ip, x);
    }
    x.events++;
    x.lastSeen = r.createdAt.toISOString();
    if (r.visitorId) x.visitors.add(r.visitorId);
    x.device ??= r.device;
    x.browser ??= r.browser;
    x.os ??= r.os;
    if (r.entry && r.source && !x.source) x.source = r.source;
    switch (r.event) {
      case 'page_view':
        x.pageViews++;
        break;
      case 'fetch_success':
        x.fetchOk++;
        break;
      case 'fetch_error':
        x.fetchFail++;
        break;
      case 'download_success':
        x.downloadOk++;
        break;
      case 'download_error':
      case 'download_aborted':
        x.downloadFail++;
        break;
      case 'rate_limited':
        x.rateLimited++;
        break;
    }
  }

  const ips = [...byIp.values()]
    .map((x) => ({
      ...x,
      visitors: x.visitors.size,
      blocked: blocked.has(x.ip),
      blockReason: blocked.get(x.ip)?.reason ?? null,
    }))
    .sort((a, b) => b.events - a.events)
    .slice(0, 300);

  return NextResponse.json({
    success: true,
    data: {
      total: byIp.size,
      ips,
      // Blocked addresses stay listed even when they have no recent activity.
      blocked: blockedRows.map((b) => ({ ip: b.ip, reason: b.reason, createdAt: b.createdAt.toISOString() })),
    },
  });
}
