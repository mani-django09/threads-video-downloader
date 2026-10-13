import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminGuard';
import { prisma } from '@/lib/db';
import { eventWhere } from '@/lib/eventFilter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const take = Math.min(Math.max(Number(req.nextUrl.searchParams.get('limit') || 100), 1), 300);

  const events = await prisma.downloadEvent.findMany({
    where: eventWhere(req.nextUrl.searchParams),
    orderBy: { createdAt: 'desc' },
    take,
    select: {
      id: true,
      createdAt: true,
      event: true,
      status: true,
      mediaType: true,
      processingMs: true,
      fileSize: true,
      errorCode: true,
      page: true,
      referrer: true,
      visitorId: true,
      ipHash: true,
      ip: true,
      device: true,
      browser: true,
      os: true,
      postId: true,
      author: true,
      entry: true,
      source: true,
      medium: true,
      campaign: true,
    },
  });

  return NextResponse.json({
    success: true,
    data: events.map(({ ipHash, ...e }) => ({ ...e, visitorId: e.visitorId ?? (ipHash ? ipHash.slice(0, 12) : null) })),
  });
}
