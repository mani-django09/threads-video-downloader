import * as cheerio from 'cheerio';
import { isAllowedDownloadHost } from '@/lib/security';
import { safeFetch } from '@/lib/safeFetch';
import { extractPostId, normalizeThreadsUrl } from '@/lib/validation';
import {
  MediaKind,
  MediaQuality,
  PrivateOrRestrictedError,
  ResolvedMedia,
  UnsupportedPostError,
  UpstreamFetchError,
} from '../types';
import { FETCH_TIMEOUT_MS, USER_AGENTS, randomUserAgent } from './constants';
import { cacheGet, cacheSet } from './cache';

interface FetchedPage {
  html: string;
  finalUrl: string;
}

async function fetchPublicPostHtml(pageUrl: string, userAgent = randomUserAgent()): Promise<FetchedPage> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    // safeFetch re-checks the allowlist and private-IP rules on every redirect hop.
    const { response: res, finalUrl } = await safeFetch(pageUrl, 'lookup', {
      signal: controller.signal,
      headers: {
        'User-Agent': userAgent,
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (res.status === 404) {
      throw new UnsupportedPostError('Post not found');
    }
    if (res.status === 401 || res.status === 403) {
      throw new PrivateOrRestrictedError('Content is private or restricted');
    }
    if (!res.ok) {
      throw new UpstreamFetchError(`Upstream responded with ${res.status}`);
    }

    // Share links (/share/xxx) and shortlinks (/t/xxx) redirect server-side
    // to the canonical /@username/post/ID URL. finalUrl is that redirect-
    // followed location, so we can recover a stable post ID from it even when
    // the URL the user pasted never contained one.
    const html = await res.text();
    return { html, finalUrl };
  } catch (err) {
    if (err instanceof UnsupportedPostError || err instanceof PrivateOrRestrictedError || err instanceof UpstreamFetchError) {
      throw err;
    }
    if (err instanceof Error && err.name === 'AbortError') {
      throw new UpstreamFetchError('Upstream request timed out');
    }
    throw new UpstreamFetchError('Failed to reach Threads');
  } finally {
    clearTimeout(timeout);
  }
}

function collectCdnUrlsFromJson(html: string): string[] {
  const urls = new Set<string>();
  // Threads server-renders post data inside inline <script> JSON blobs.
  // We scan for absolute CDN media URLs rather than depending on any
  // particular internal schema, which keeps this resilient to markup changes.
  const regex = /https:\\?\/\\?\/[a-zA-Z0-9.-]*(?:fbcdn\.net|cdninstagram\.com)\\?\/[^"'\s\\]+\.(?:mp4|jpg|jpeg|webp|gif)[^"'\s\\]*/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    const cleaned = match[0].replace(/\\\//g, '/').replace(/\\u0026/g, '&');
    // `static.cdninstagram.com` (and any /rsrc.php/ path) serves the site's
    // own UI assets (icons, sprites) rather than post media -- matching the
    // generic host pattern alone pulls these in as false positives.
    try {
      const host = new URL(cleaned).hostname;
      if (host === 'static.cdninstagram.com' || cleaned.includes('/rsrc.php/')) continue;
    } catch {
      continue;
    }
    urls.add(cleaned);
  }
  return Array.from(urls);
}

function pickBest(urls: string[], predicate: (u: string) => boolean): string[] {
  return urls.filter(predicate);
}

/**
 * The regular post page ships only a thumbnail for video posts -- the video
 * itself is attached client-side. Threads' public embed page
 * (/@user/post/ID/embed/, the one meant for third-party sites) renders a plain
 * <video src> into its HTML, so that's where a public post's video is read from.
 */
async function fetchEmbedVideoUrls(postUrl: string): Promise<string[]> {
  try {
    const u = new URL(postUrl);
    const m = u.pathname.match(/^\/@([A-Za-z0-9_.]+)\/post\/([A-Za-z0-9_-]+)/);
    if (!m) return [];
    const { html } = await fetchPublicPostHtml(`${u.origin}/@${m[1]}/post/${m[2]}/embed/`, USER_AGENTS[0]);
    const $ = cheerio.load(html);
    const urls = new Set<string>();
    $('video[src], video source[src]').each((_, el) => {
      const src = $(el).attr('src');
      if (src) urls.add(src);
    });
    return Array.from(urls);
  } catch {
    // The embed is a best-effort enhancement; never fail the whole lookup on it.
    return [];
  }
}

/** Best-effort file size from a 1-byte range request; undefined if the CDN won't say. */
async function probeFileSize(url: string): Promise<number | undefined> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const { response } = await safeFetch(url, 'download', {
      signal: controller.signal,
      headers: { Range: 'bytes=0-0', 'User-Agent': USER_AGENTS[0] as string },
    });
    const range = response.headers.get('content-range')?.match(/\/(\d+)$/);
    const length = Number(response.headers.get('content-length'));
    await response.body?.cancel();
    if (range) return Number(range[1]);
    // A server that ignores Range answers 200 with the full length.
    if (response.status === 200 && Number.isFinite(length) && length > 1) return length;
    return undefined;
  } catch {
    return undefined;
  } finally {
    clearTimeout(timeout);
  }
}

/** Last-resort ID for share/shortlink URLs that, unexpectedly, don't redirect to a canonical /post/ path. */
function extractFallbackId(url: string): string | null {
  try {
    const segments = new URL(url).pathname.split('/').filter(Boolean);
    return segments[segments.length - 1] || null;
  } catch {
    return null;
  }
}

/**
 * Threads occasionally stalls or drops a single request. One retry on a
 * network/timeout failure hides that from the user; definite answers (private,
 * deleted, no media) are not retried.
 */
async function fetchPageWithRetry(pageUrl: string, userAgent?: string): Promise<FetchedPage> {
  try {
    return await fetchPublicPostHtml(pageUrl, userAgent);
  } catch (err) {
    if (err instanceof UpstreamFetchError) return fetchPublicPostHtml(pageUrl, userAgent);
    throw err;
  }
}

export async function resolveThreadsPost(rawUrl: string): Promise<ResolvedMedia> {
  const normalized = normalizeThreadsUrl(rawUrl);
  if (!normalized) {
    throw new UnsupportedPostError('Invalid Threads URL');
  }

  // Fast path: canonical URLs already carry their post ID, so a repeat
  // request can hit the cache without a network round-trip. Share links and
  // shortlinks don't -- their ID is only known after following the redirect.
  const earlyPostId = extractPostId(normalized);
  if (earlyPostId) {
    const cached = cacheGet(earlyPostId);
    if (cached) return cached;
  }

  // For canonical URLs the embed page can be requested right away, in parallel
  // with the main page. (Share links need their redirect resolved first.)
  const embedEarly = earlyPostId ? fetchEmbedVideoUrls(normalized) : null;

  let { html, finalUrl } = await fetchPageWithRetry(normalized);

  // Share/shortlinks are expected to redirect to a canonical /post/ URL. If
  // that didn't happen, we likely landed on a non-canonical shell page (seen
  // in practice with less-common client UAs) rather than genuine "no media" --
  // one retry with the known-reliable mobile Safari UA resolves this.
  if (!earlyPostId && !extractPostId(finalUrl)) {
    ({ html, finalUrl } = await fetchPageWithRetry(normalized, USER_AGENTS[0]));
  }

  const postId = extractPostId(finalUrl) || earlyPostId || extractFallbackId(finalUrl);
  if (!postId) {
    throw new UnsupportedPostError('Could not determine post ID');
  }

  if (!earlyPostId) {
    const cached = cacheGet(postId);
    if (cached) return cached;
  }

  const $ = cheerio.load(html);

  if (/log ?in to see|this content isn.t available|page not found/i.test($('title').text())) {
    throw new PrivateOrRestrictedError('Content is private or restricted');
  }

  const ogVideo = $('meta[property="og:video"]').attr('content') || $('meta[property="og:video:secure_url"]').attr('content');
  const ogImage = $('meta[property="og:image"]').attr('content');
  const ogTitle = $('meta[property="og:title"]').attr('content') || $('title').text();
  const ogDescription = $('meta[property="og:description"]').attr('content');

  const jsonCdnUrls = collectCdnUrlsFromJson(html);
  const videoCandidates = [ogVideo, ...pickBest(jsonCdnUrls, (u) => /\.mp4/i.test(u))].filter(
    (u): u is string => Boolean(u),
  );
  // Image candidates are deliberately restricted to the og:image tag rather
  // than the broad JSON/regex scan: that scan also picks up unrelated images
  // rendered on the same page (author avatars, related-post thumbnails),
  // which og:image reliably does not.
  const imageCandidates = [ogImage].filter((u): u is string => Boolean(u));
  const gifCandidates = pickBest(jsonCdnUrls, (u) => /\.gif/i.test(u));

  // Dedupe by scheme+host+pathname (ignoring query string): the same CDN
  // asset is frequently re-emitted in the page with different signed-URL
  // query params, which would otherwise look like distinct "qualities".
  const dedupe = (arr: string[]) => {
    const seenPaths = new Set<string>();
    const result: string[] = [];
    for (const u of arr) {
      try {
        const parsed = new URL(u);
        if (!isAllowedDownloadHost(parsed.hostname)) continue;
        const pathKey = `${parsed.hostname}${parsed.pathname}`;
        if (seenPaths.has(pathKey)) continue;
        seenPaths.add(pathKey);
        result.push(u);
      } catch {
        continue;
      }
    }
    return result;
  };

  let videos = dedupe(videoCandidates);
  if (videos.length === 0) {
    videos = dedupe(await (embedEarly ?? fetchEmbedVideoUrls(finalUrl)));
  }
  const images = dedupe(imageCandidates);
  const gifs = dedupe(gifCandidates);

  let mediaKind: MediaKind;
  let sourceList: string[];
  if (videos.length > 0) {
    mediaKind = 'video';
    sourceList = videos;
  } else if (gifs.length > 0) {
    mediaKind = 'gif';
    sourceList = gifs;
  } else if (images.length > 0) {
    mediaKind = 'image';
    sourceList = images;
  } else {
    throw new UnsupportedPostError('This Threads post does not contain downloadable public media');
  }

  const trimmedList = sourceList.slice(0, 3);
  // Only claim HD/SD when the post really exposes more than one rendition;
  // a single file is just the original.
  const labelFor = (i: number): string => {
    if (trimmedList.length === 1) return 'Original';
    if (mediaKind === 'video') return i === 0 ? 'HD' : 'SD';
    return `Original ${i + 1}`;
  };
  const sizes = mediaKind === 'video' ? await Promise.all(trimmedList.map(probeFileSize)) : [];
  const qualities: MediaQuality[] = trimmedList.map((url, i) => ({
    label: labelFor(i),
    url,
    type: mediaKind,
    fileSizeBytes: sizes[i],
  }));

  // finalUrl (post-redirect) carries the @username segment even when the
  // user pasted a share link or shortlink that never contained one.
  const usernameMatch = finalUrl.match(/\/@([a-zA-Z0-9_.]+)\//);

  const result: ResolvedMedia = {
    provider: 'threads',
    postId,
    sourceUrl: finalUrl,
    mediaKind,
    caption: ogDescription || undefined,
    thumbnail: images[0],
    author: usernameMatch ? { username: usernameMatch[1] as string } : undefined,
    qualities,
  };

  if (ogTitle) result.caption = result.caption || ogTitle;

  cacheSet(postId, result);
  return result;
}
