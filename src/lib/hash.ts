import { createHash } from 'node:crypto';

const SALT = process.env.ADMIN_SESSION_SECRET || 'threads-downloader-dev-salt';

/** One-way salted hash so we never persist raw IPs/user agents. */
export function hashValue(value: string): string {
  return createHash('sha256').update(`${SALT}:${value}`).digest('hex').slice(0, 32);
}

export function getClientIp(headers: Headers): string {
  // nginx sets X-Real-IP to the actual peer address. X-Forwarded-For's first
  // entry is client-controlled (nginx appends to whatever the client sent), so
  // trusting it would let anyone dodge the rate limits by rotating that header.
  const real = headers.get('x-real-ip');
  if (real) return real.trim();
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',').pop()?.trim() || 'unknown';
  return 'unknown';
}
