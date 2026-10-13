import { z } from 'zod';

const THREADS_HOSTS = /^(www\.)?(threads\.net|threads\.com)$/i;

// Threads exposes several public URL shapes for the same underlying post:
//   - canonical:   /@username/post/ABC123          (copied from web/desktop)
//   - share sheet: /share/G5xxxxxxx                 (copied from the mobile app)
//   - shortlink:   /t/ABC123
// Share links and shortlinks don't carry the post ID in a recognizable form
// up front -- they redirect server-side to the canonical URL, which is
// resolved by following redirects in resolveThreadsPost rather than by regex.
const THREADS_PATH_RE =
  /^\/(?:@[a-zA-Z0-9_.]{1,64}\/post\/[a-zA-Z0-9_-]{1,64}|share\/[a-zA-Z0-9_-]{1,128}|t\/[a-zA-Z0-9_-]{1,64})\/?$/i;

export const resolveRequestSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, 'URL is required')
    .max(500, 'URL is too long'),
});

export function isLikelyThreadsUrl(input: string): boolean {
  if (!input || input.length > 500) return false;
  try {
    const u = new URL(input.trim());
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return false;
    if (!THREADS_HOSTS.test(u.hostname)) return false;
    return THREADS_PATH_RE.test(u.pathname);
  } catch {
    return false;
  }
}

export function normalizeThreadsUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!isLikelyThreadsUrl(trimmed)) return null;
  try {
    const u = new URL(trimmed);
    u.hash = '';
    // Canonicalize host to threads.net. Query strings are preserved: share
    // links occasionally need their tracking token to resolve correctly.
    if (u.hostname.toLowerCase().endsWith('threads.com')) {
      u.hostname = u.hostname.toLowerCase().replace('threads.com', 'threads.net');
    }
    return u.toString();
  } catch {
    return null;
  }
}

export function extractPostId(url: string): string | null {
  const match = url.match(/\/post\/([a-zA-Z0-9_-]{1,64})/);
  return match?.[1] ?? null;
}
