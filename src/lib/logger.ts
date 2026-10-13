import { prisma } from './db';
import type { VisitorContext } from './visitor';

export type EventName =
  | 'page_view'
  | 'fetch_start'
  | 'fetch_success'
  | 'fetch_error'
  | 'download_click'
  | 'download_success'
  | 'download_error'
  | 'download_aborted'
  | 'rate_limited';

type Status = 'success' | 'error';

export interface LogEventInput {
  event: EventName;
  status: Status;
  mediaType?: 'video' | 'image' | 'gif';
  processingMs?: number;
  fileSize?: number;
  errorCode?: string;
  /** Route for page views, API path for API events. */
  page?: string;
  referrer?: string | null;
  postId?: string;
  author?: string;
  /** Traffic source details, set on the first page view of a visit. */
  entry?: boolean;
  source?: string | null;
  medium?: string | null;
  campaign?: string | null;
  visitor?: Partial<VisitorContext>;
}

// Fire-and-forget: analytics logging must never block or fail the user-facing request.
export function logEvent(input: LogEventInput): void {
  const v = input.visitor ?? {};
  prisma.downloadEvent
    .create({
      data: {
        event: input.event,
        status: input.status,
        provider: 'threads',
        mediaType: input.mediaType,
        processingMs: input.processingMs,
        fileSize: input.fileSize,
        errorCode: input.errorCode,
        page: input.page,
        referrer: input.referrer ?? undefined,
        postId: input.postId,
        author: input.author,
        entry: input.entry ?? false,
        source: input.source ?? undefined,
        medium: input.medium ?? undefined,
        campaign: input.campaign ?? undefined,
        ip: v.ip ?? undefined,
        ipHash: v.ipHash,
        userAgentHash: v.userAgentHash,
        visitorId: v.visitorId,
        device: v.device,
        browser: v.browser,
        os: v.os,
      },
    })
    .catch((err) => {
      console.error('[logEvent] failed to persist event', err instanceof Error ? err.message : err);
    });
}
