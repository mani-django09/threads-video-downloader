import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE_NAME = 'td_admin';
const SESSION_MS = 12 * 60 * 60 * 1000; // 12 hours

function getSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  return secret && secret.length >= 16 ? secret : null;
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD) && Boolean(getSecret());
}

export function verifyAdminPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || '';
  if (!expected) return false;
  // Compare fixed-length digests: raw buffers of different lengths make
  // timingSafeEqual throw (a 500 for any over-long password guess).
  const a = createHash('sha256').update(candidate).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
}

function sign(payload: string): string {
  const secret = getSecret();
  if (!secret) throw new Error('Admin session secret not configured');
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function createAdminToken(): string {
  const payload = JSON.stringify({ exp: Date.now() + SESSION_MS });
  const encoded = Buffer.from(payload).toString('base64url');
  const sig = sign(encoded);
  return `${encoded}.${sig}`;
}

export function verifyAdminToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [encoded, sig] = token.split('.');
  if (!encoded || !sig) return false;
  try {
    const expectedSig = sign(encoded);
    const a = Buffer.from(sig);
    const b = Buffer.from(expectedSig);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    return typeof payload.exp === 'number' && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
export const ADMIN_SESSION_MS = SESSION_MS;
