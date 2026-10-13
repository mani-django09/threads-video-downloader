import { randomBytes } from 'node:crypto';

/**
 * Short-lived opaque ids for download targets.
 *
 * The signed CDN URL of a video is over 1 KB. Putting it in the query string of
 * /api/download/ breaks behind servers with small header buffers (a shared nginx
 * here answers 414), and it also exposes the raw CDN address in the page's
 * links. The resolve step hands out a short id instead and the download route
 * looks the URL up again; the URL is still validated before it is fetched.
 *
 * The entry also carries which public post the file belongs to, so the download
 * outcome (completed / failed / cancelled) can be attributed in the admin panel.
 *
 * Kept on globalThis so every route handler in the process sees the same map
 * (route bundles do not reliably share module-level state). It is per process
 * and in memory, so an id stops working after a restart: the user simply
 * pastes the link again.
 */
const TTL_MS = 30 * 60 * 1000;
const MAX_ENTRIES = 5000;

export interface DownloadTarget {
  url: string;
  postId?: string;
  author?: string;
  mediaType?: 'video' | 'image' | 'gif';
}

interface Entry extends DownloadTarget {
  expiresAt: number;
}

const g = globalThis as typeof globalThis & { __downloadTokens?: Map<string, Entry> };
const store: Map<string, Entry> = (g.__downloadTokens ??= new Map());

function prune(now: number): void {
  for (const [id, entry] of store) {
    if (entry.expiresAt <= now) store.delete(id);
  }
  // Still too full (a burst of unique requests): drop the oldest first.
  while (store.size >= MAX_ENTRIES) {
    const oldest = store.keys().next().value;
    if (oldest === undefined) break;
    store.delete(oldest);
  }
}

export function issueDownloadToken(target: DownloadTarget): string {
  const now = Date.now();
  if (store.size >= MAX_ENTRIES * 0.9) prune(now);
  const id = randomBytes(12).toString('base64url');
  store.set(id, { ...target, expiresAt: now + TTL_MS });
  return id;
}

export function lookupDownloadToken(id: string): DownloadTarget | null {
  const entry = store.get(id);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    store.delete(id);
    return null;
  }
  const { expiresAt: _expiresAt, ...target } = entry;
  void _expiresAt;
  return target;
}
