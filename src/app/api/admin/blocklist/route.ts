import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminGuard';
import { prisma } from '@/lib/db';
import { getClientIp } from '@/lib/hash';
import { invalidateBlocklist } from '@/lib/blocklist';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const IP_RE = /^[0-9a-fA-F:.]{3,45}$/;
// Addresses that must never be blocked: loopback and private ranges would lock out the proxy itself.
const PRIVATE_RE = /^(127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|::1$|fc|fd|fe80)/i;

/** Block an IP from the lookup/download endpoints. The public pages and this panel stay reachable. */
export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const body = (await req.json().catch(() => null)) as { ip?: unknown; reason?: unknown } | null;
  const ip = typeof body?.ip === 'string' ? body.ip.trim() : '';
  const reason = typeof body?.reason === 'string' ? body.reason.trim().slice(0, 120) : null;

  if (!IP_RE.test(ip)) return NextResponse.json({ success: false, error: 'That is not a valid IP address.' }, { status: 400 });
  if (PRIVATE_RE.test(ip)) return NextResponse.json({ success: false, error: 'Private and loopback addresses cannot be blocked.' }, { status: 400 });
  if (ip === getClientIp(req.headers)) {
    return NextResponse.json({ success: false, error: 'That is your own current IP address, so blocking it is refused.' }, { status: 400 });
  }

  await prisma.blockedIp.upsert({ where: { ip }, create: { ip, reason }, update: { reason } });
  invalidateBlocklist();
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const ip = (req.nextUrl.searchParams.get('ip') || '').trim();
  if (!IP_RE.test(ip)) return NextResponse.json({ success: false, error: 'That is not a valid IP address.' }, { status: 400 });

  await prisma.blockedIp.deleteMany({ where: { ip } });
  invalidateBlocklist();
  return NextResponse.json({ success: true });
}
