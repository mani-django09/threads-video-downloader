import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, ADMIN_SESSION_MS, createAdminToken, isAdminConfigured, verifyAdminPassword } from '@/lib/adminAuth';
import { checkRateLimit } from '@/lib/rateLimit';
import { getClientIp, hashValue } from '@/lib/hash';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ success: false, error: 'Admin panel is not configured.' }, { status: 503 });
  }

  const ip = getClientIp(req.headers);
  const rate = checkRateLimit(`admin-login:${hashValue(ip)}`, 15 * 60 * 1000, 10);
  if (!rate.allowed) {
    return NextResponse.json({ success: false, error: 'Too many attempts. Try again later.' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ success: false, error: 'Invalid password.' }, { status: 401 });
  }

  const token = createAdminToken();
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ADMIN_SESSION_MS / 1000,
  });
  return res;
}
