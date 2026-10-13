import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminGuard';
import { prisma } from '@/lib/db';
import { eventWhere } from '@/lib/eventFilter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RANGES = { '24h': 24 * 3600_000, '7d': 7 * 24 * 3600_000, '30d': 30 * 24 * 3600_000 } as const;

// Spreadsheet formulas start with = + - @ ; prefixing a quote keeps log text from ever running as one.
function cell(v: unknown): string {
  if (v === null || v === undefined) return '';
  let s = v instanceof Date ? v.toISOString() : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** CSV of the activity log for the chosen range, honouring the same filters as the live feed. */
export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const requested = req.nextUrl.searchParams.get('range');
  const ms = RANGES[(requested ?? '7d') as keyof typeof RANGES] ?? RANGES['7d'];
  const filters = eventWhere(req.nextUrl.searchParams);

  const rows = await prisma.downloadEvent.findMany({
    where: { ...filters, createdAt: { gte: new Date(Date.now() - ms) } },
    orderBy: { createdAt: 'desc' },
    take: 50_000,
  });

  const header = ['time_utc', 'event', 'status', 'visitor_id', 'ip', 'device', 'browser', 'os', 'source', 'medium', 'campaign', 'referrer', 'page', 'post_id', 'author', 'media_type', 'file_bytes', 'duration_ms', 'error_code'];
  const lines = rows.map((r) =>
    [r.createdAt, r.event, r.status, r.visitorId, r.ip, r.device, r.browser, r.os, r.source, r.medium, r.campaign, r.referrer, r.page, r.postId, r.author, r.mediaType, r.fileSize, r.processingMs, r.errorCode]
      .map(cell)
      .join(','),
  );

  return new NextResponse([header.join(','), ...lines].join('\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="threadsdl-activity-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
