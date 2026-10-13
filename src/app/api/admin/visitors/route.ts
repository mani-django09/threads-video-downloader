import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminGuard';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RANGES = { '24h': 24 * 3600_000, '7d': 7 * 24 * 3600_000, '30d': 30 * 24 * 3600_000 } as const;

interface VisitorRow {
  id: string;
  ip: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
  firstSeen: string;
  lastSeen: string;
  lastPage: string | null;
  landingPage: string | null;
  source: string | null;
  medium: string | null;
  campaign: string | null;
  pageViews: number;
  fetchOk: number;
  fetchFail: number;
  downloadOk: number;
  downloadFail: number;
  blocked: boolean;
}

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const requested = req.nextUrl.searchParams.get('range');
  const ms = RANGES[(requested ?? '7d') as keyof typeof RANGES] ?? RANGES['7d'];

  const [rows, blockedRows] = await Promise.all([
    prisma.downloadEvent.findMany({
      where: { createdAt: { gte: new Date(Date.now() - ms) } },
      orderBy: { createdAt: 'asc' },
      take: 200_000,
      select: {
        createdAt: true,
        event: true,
        visitorId: true,
        ipHash: true,
        ip: true,
        page: true,
        device: true,
        browser: true,
        os: true,
        entry: true,
        source: true,
        medium: true,
        campaign: true,
      },
    }),
    prisma.blockedIp.findMany({ select: { ip: true } }),
  ]);
  const blocked = new Set(blockedRows.map((b) => b.ip));

  const byVisitor = new Map<string, VisitorRow>();
  for (const r of rows) {
    const id = r.visitorId ?? (r.ipHash ? r.ipHash.slice(0, 12) : null);
    if (!id) continue;
    let v = byVisitor.get(id);
    if (!v) {
      v = {
        id,
        ip: r.ip,
        device: r.device,
        browser: r.browser,
        os: r.os,
        firstSeen: r.createdAt.toISOString(),
        lastSeen: r.createdAt.toISOString(),
        lastPage: null,
        landingPage: null,
        source: null,
        medium: null,
        campaign: null,
        pageViews: 0,
        fetchOk: 0,
        fetchFail: 0,
        downloadOk: 0,
        downloadFail: 0,
        blocked: false,
      };
      byVisitor.set(id, v);
    }
    v.lastSeen = r.createdAt.toISOString();
    v.ip ??= r.ip;
    v.device ??= r.device;
    v.browser ??= r.browser;
    v.os ??= r.os;
    switch (r.event) {
      case 'page_view':
        v.pageViews++;
        v.lastPage = r.page;
        if (r.entry && !v.source) {
          v.source = r.source;
          v.medium = r.medium;
          v.campaign = r.campaign;
          v.landingPage = r.page;
        }
        break;
      case 'fetch_success':
        v.fetchOk++;
        break;
      case 'fetch_error':
        v.fetchFail++;
        break;
      case 'download_success':
        v.downloadOk++;
        break;
      case 'download_error':
      case 'download_aborted':
        v.downloadFail++;
        break;
    }
  }
  for (const v of byVisitor.values()) v.blocked = !!v.ip && blocked.has(v.ip);

  const visitors = [...byVisitor.values()].sort((a, b) => b.lastSeen.localeCompare(a.lastSeen)).slice(0, 300);
  return NextResponse.json({ success: true, data: { total: byVisitor.size, visitors } });
}
