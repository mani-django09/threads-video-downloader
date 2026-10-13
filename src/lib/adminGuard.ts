import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, isAdminConfigured, verifyAdminToken } from './adminAuth';

export function requireAdmin(req: NextRequest): NextResponse | null {
  if (!isAdminConfigured()) {
    return NextResponse.json({ success: false, error: 'Admin panel is not configured.' }, { status: 503 });
  }
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!verifyAdminToken(token)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
