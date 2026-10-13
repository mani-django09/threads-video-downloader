import { NextRequest, NextResponse } from 'next/server';
import { assertPublicHost, assertSafeUrl } from '@/lib/security';
import { safeFetch } from '@/lib/safeFetch';
import { checkRateLimit } from '@/lib/rateLimit';
import { getVisitor } from '@/lib/visitor';
import { logEvent, type LogEventInput } from '@/lib/logger';
import { lookupDownloadToken, type DownloadTarget } from '@/lib/downloadTokens';
import { isBlocked } from '@/lib/blocklist';

export const runtime = 'nodejs';

const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
const MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX_REQUESTS || 20);
const MAX_PROXY_BYTES = 200 * 1024 * 1024; // 200MB safety cap

function safeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120) || 'threads-media';
}

function errorJson(code: string, message: string, status: number) {
  return NextResponse.json({ success: false, error: { code, message } }, { status });
}

export async function GET(req: NextRequest) {
  const visitor = getVisitor(req.headers);
  const startedAt = Date.now();

  // Every outcome below is recorded so the admin panel can show which downloads
  // completed, failed or were cancelled, and for which public post.
  const base: Pick<LogEventInput, 'page' | 'visitor'> & Partial<DownloadTarget> = { page: '/api/download', visitor };
  const fail = (errorCode: string, message: string, status: number, target?: DownloadTarget) => {
    logEvent({
      event: 'download_error',
      status: 'error',
      errorCode,
      processingMs: Date.now() - startedAt,
      postId: target?.postId,
      author: target?.author,
      mediaType: target?.mediaType,
      ...base,
    });
    return errorJson(errorCode, message, status);
  };

  if (await isBlocked(visitor.ip)) {
    logEvent({ event: 'rate_limited', status: 'error', errorCode: 'BLOCKED', ...base });
    return errorJson('BLOCKED', 'Access from your network has been restricted.', 403);
  }

  const rate = checkRateLimit(`download:${visitor.ipHash}`, WINDOW_MS, MAX_REQUESTS);
  if (!rate.allowed) {
    logEvent({ event: 'rate_limited', status: 'error', errorCode: 'RATE_LIMITED', ...base });
    return errorJson('RATE_LIMITED', 'Too many requests. Please try again later.', 429);
  }

  const tokenId = req.nextUrl.searchParams.get('id');
  const filenameParam = req.nextUrl.searchParams.get('filename') || 'threads-media';
  const proxy = req.nextUrl.searchParams.get('proxy') === '1';

  // A short id from /api/resolve/ is the normal route; a raw `url` is still
  // accepted. Either way the target goes through the same host validation below.
  let target: DownloadTarget | null = null;
  if (tokenId) {
    target = lookupDownloadToken(tokenId);
    if (!target) {
      return fail('LINK_EXPIRED', 'This download link has expired. Please paste the link again.', 410);
    }
  } else {
    const rawUrl = req.nextUrl.searchParams.get('url');
    if (rawUrl) target = { url: rawUrl };
  }

  if (!target) {
    return fail('INVALID_URL', 'Missing download target.', 400);
  }

  let parsed: URL;
  try {
    parsed = assertSafeUrl(target.url, 'download');
    await assertPublicHost(parsed.hostname);
  } catch {
    return fail('INVALID_TARGET', 'This download target is not allowed.', 400, target);
  }

  const filename = safeFilename(filenameParam);
  const clickEvent: LogEventInput = {
    event: 'download_click',
    status: 'success',
    postId: target.postId,
    author: target.author,
    mediaType: target.mediaType,
    ...base,
  };

  if (!proxy) {
    // A plain redirect hands the transfer to the CDN, so no outcome can be known.
    logEvent(clickEvent);
    return NextResponse.redirect(parsed.toString(), 302);
  }

  try {
    const { response: upstream } = await safeFetch(parsed.toString(), 'download', {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ThreadsDownloader/1.0)' },
    });

    if (!upstream.ok || !upstream.body) {
      return fail('UPSTREAM_ERROR', 'Something went wrong. Please try again.', 502, target);
    }

    const contentType = (upstream.headers.get('content-type') || '').toLowerCase();
    if (!contentType.startsWith('video/') && !contentType.startsWith('image/')) {
      await upstream.body.cancel();
      return fail('UNSUPPORTED_TYPE', 'This file type is not supported.', 415, target);
    }

    const contentLength = Number(upstream.headers.get('content-length') || 0);
    if (contentLength > MAX_PROXY_BYTES) {
      await upstream.body.cancel();
      return fail('FILE_TOO_LARGE', 'File exceeds the maximum allowed size.', 413, target);
    }

    const ext = contentType.includes('mp4') ? 'mp4' : contentType.includes('gif') ? 'gif' : contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : contentType.startsWith('video/') ? 'mp4' : 'jpg';

    logEvent(clickEvent);

    // Stream the file through while counting bytes. The outcome is decided by what
    // happens to the stream: fully read = completed, the reader went away before
    // the end = cancelled, upstream broke or the size cap tripped = failed.
    // (content-length can be absent or wrong, so the cap is also enforced here.)
    const reader = upstream.body.getReader();
    let sent = 0;
    let settled = false;
    const settle = (event: 'download_success' | 'download_error' | 'download_aborted', errorCode?: string) => {
      if (settled) return;
      settled = true;
      logEvent({
        event,
        status: event === 'download_success' ? 'success' : 'error',
        errorCode,
        fileSize: sent,
        processingMs: Date.now() - startedAt,
        postId: target?.postId,
        author: target?.author,
        mediaType: target?.mediaType,
        ...base,
      });
    };

    const body = new ReadableStream<Uint8Array>({
      async pull(controller) {
        try {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            settle('download_success');
            return;
          }
          sent += value.byteLength;
          if (sent > MAX_PROXY_BYTES) {
            controller.error(new Error('Size limit exceeded'));
            await reader.cancel().catch(() => undefined);
            settle('download_error', 'FILE_TOO_LARGE');
            return;
          }
          controller.enqueue(value);
        } catch (err) {
          controller.error(err);
          settle('download_error', 'STREAM_ERROR');
        }
      },
      async cancel(reason) {
        settle('download_aborted', 'CLIENT_CANCELLED');
        await reader.cancel(reason).catch(() => undefined);
      },
    });

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // Advertise the length when the CDN gave one so browsers show real progress.
        ...(contentLength > 0 ? { 'Content-Length': String(contentLength) } : {}),
        'Content-Disposition': `attachment; filename="${filename}.${ext}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return fail('SERVER_ERROR', 'Something went wrong. Please try again.', 500, target);
  }
}
