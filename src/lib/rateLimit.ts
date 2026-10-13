/**
 * In-memory sliding-window rate limiter. Fast, zero-dependency, sufficient
 * for a single Node process. NOTE: if this app is ever run as a multi-process
 * cluster (PM2 cluster mode, multiple containers), each process holds its own
 * counters, so effective per-IP limits become N times looser. For strict
 * cross-instance limits, back this with Redis instead.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Periodic cleanup so the map doesn't grow unbounded.
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}, 5 * 60 * 1000).unref?.();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(key: string, windowMs: number, maxRequests: number): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: maxRequests - 1, resetAt };
  }

  if (existing.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { allowed: true, remaining: maxRequests - existing.count, resetAt: existing.resetAt };
}

// Sliding 1-minute abuse window -> temporary ban tracking, separate from the
// per-route limiters above (mirrors defense-in-depth: a burst across *any*
// route still trips this).
const banList = new Map<string, number>(); // key -> banned-until timestamp
const abuseWindow = new Map<string, number[]>(); // key -> recent request timestamps

const ABUSE_WINDOW_MS = 60 * 1000;
const ABUSE_MAX_REQUESTS = 60;
const ABUSE_BAN_MS = 30 * 60 * 1000;

export function checkAbuse(key: string): { banned: boolean; retryAfterMs?: number } {
  const now = Date.now();

  const bannedUntil = banList.get(key);
  if (bannedUntil && bannedUntil > now) {
    return { banned: true, retryAfterMs: bannedUntil - now };
  }
  if (bannedUntil && bannedUntil <= now) {
    banList.delete(key);
  }

  const timestamps = (abuseWindow.get(key) ?? []).filter((t) => now - t < ABUSE_WINDOW_MS);
  timestamps.push(now);
  abuseWindow.set(key, timestamps);

  if (timestamps.length > ABUSE_MAX_REQUESTS) {
    banList.set(key, now + ABUSE_BAN_MS);
    abuseWindow.delete(key);
    return { banned: true, retryAfterMs: ABUSE_BAN_MS };
  }

  return { banned: false };
}
