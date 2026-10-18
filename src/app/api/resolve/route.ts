import { NextRequest, NextResponse } from 'next/server';
import { findProvider } from '@/providers';
import { PrivateOrRestrictedError, UnsupportedPostError, UpstreamFetchError } from '@/providers/types';
import { resolveRequestSchema } from '@/lib/validation';
import { checkAbuse, checkRateLimit } from '@/lib/rateLimit';
import { getVisitor } from '@/lib/visitor';
import { logEvent } from '@/lib/logger';
import { issueDownloadToken } from '@/lib/downloadTokens';
import { isBlocked } from '@/lib/blocklist';
import { isAllowedDownloadHost } from '@/lib/security';

export const runtime = 'nodejs';

const WINDOW_MS = Number(process.env.FETCH_RATE_LIMIT_WINDOW_MS || 3_600_000);
const MAX_REQUESTS = Number(process.env.FETCH_RATE_LIMIT_MAX_REQUESTS || 25);

const INVALID_URL = {
  success: false,
  error: { code: 'INVALID_URL', message: 'Please enter a valid Threads post URL.' },
} as const;

/** A download handle for the cover image, only when it is hosted on an allowed CDN. */
function thumbnailToken(thumbnail: string | undefined, postId: string, author: string | undefined): string | undefined {
  if (!thumbnail) return undefined;
  try {
    if (!isAllowedDownloadHost(new URL(thumbnail).hostname)) return undefined;
  } catch {
    return undefined;
  }
  return issueDownloadToken({ url: thumbnail, postId, author, mediaType: 'image' });
}

export async function POST(req: NextRequest) {
  const visitor = getVisitor(req.headers);

  // A link that is not a Threads post still counts as a failed attempt in the admin panel.
  const invalid = () => {
    logEvent({ event: 'fetch_error', status: 'error', errorCode: 'INVALID_URL', page: '/api/resolve', visitor });
    return NextResponse.json(INVALID_URL, { status: 400 });
  };

  if (await isBlocked(visitor.ip)) {
    logEvent({ event: 'rate_limited', status: 'error', errorCode: 'BLOCKED', page: '/api/resolve', visitor });
    return NextResponse.json(
      { success: false, error: { code: 'BLOCKED', message: 'Access from your network has been restricted.' } },
      { status: 403 },
    );
  }

  const abuse = checkAbuse(`resolve:${visitor.ipHash}`);
  if (abuse.banned) {
    logEvent({ event: 'rate_limited', status: 'error', errorCode: 'ABUSE_BAN', page: '/api/resolve', visitor });
    return NextResponse.json(
      { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' } },
      { status: 429 },
    );
  }

  const rate = checkRateLimit(`resolve:${visitor.ipHash}`, WINDOW_MS, MAX_REQUESTS);
  if (!rate.allowed) {
    logEvent({ event: 'rate_limited', status: 'error', errorCode: 'RATE_LIMITED', page: '/api/resolve', visitor });
    return NextResponse.json(
      { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' } },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rate.resetAt - Date.now()) / 1000)) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return invalid();
  }

  const parsed = resolveRequestSchema.safeParse(body);
  if (!parsed.success) {
    return invalid();
  }

  const provider = findProvider(parsed.data.url);
  if (!provider) {
    return invalid();
  }

  const startedAt = Date.now();
  logEvent({ event: 'fetch_start', status: 'success', page: '/api/resolve', visitor });

  try {
    const media = await provider.resolve(parsed.data.url);
    logEvent({
      event: 'fetch_success',
      status: 'success',
      mediaType: media.mediaKind,
      processingMs: Date.now() - startedAt,
      fileSize: media.qualities[0]?.fileSizeBytes,
      postId: media.postId,
      author: media.author?.username,
      page: '/api/resolve',
      visitor,
    });

    return NextResponse.json({
      success: true,
      data: {
        postId: media.postId,
        mediaKind: media.mediaKind,
        caption: media.caption,
        thumbnail: media.thumbnail,
        thumbnailDownloadId: thumbnailToken(media.thumbnail, media.postId, media.author?.username),
        author: media.author,
        durationSeconds: media.durationSeconds,
        // downloadId is the short handle the download endpoint accepts in place
        // of the (very long) signed CDN URL. It also remembers which post the
        // file belongs to so the download outcome can be attributed.
        qualities: media.qualities.map((q) => ({
          ...q,
          downloadId: issueDownloadToken({
            url: q.url,
            postId: media.postId,
            author: media.author?.username,
            mediaType: media.mediaKind,
          }),
        })),
      },
    });
  } catch (err) {
    let code = 'SERVER_ERROR';
    let message = 'Something went wrong. Please try again.';
    let status = 500;

    if (err instanceof UnsupportedPostError) {
      code = 'UNSUPPORTED_POST';
      message = 'This Threads post does not contain downloadable public media.';
      status = 422;
    } else if (err instanceof PrivateOrRestrictedError) {
      code = 'PRIVATE_CONTENT';
      message = 'This content is private or restricted and cannot be processed.';
      status = 403;
    } else if (err instanceof UpstreamFetchError) {
      code = 'UPSTREAM_ERROR';
      message = 'Something went wrong. Please try again.';
      status = 502;
    }

    logEvent({
      event: 'fetch_error',
      status: 'error',
      errorCode: code,
      processingMs: Date.now() - startedAt,
      page: '/api/resolve',
      visitor,
    });

    return NextResponse.json({ success: false, error: { code, message } }, { status });
  }
}
