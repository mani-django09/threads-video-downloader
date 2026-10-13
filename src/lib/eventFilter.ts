import type { Prisma } from '@prisma/client';

const GROUPS: Record<string, Prisma.DownloadEventWhereInput> = {
  all: {},
  pages: { event: 'page_view' },
  fetches: { event: { in: ['fetch_start', 'fetch_success', 'fetch_error'] } },
  downloads: { event: { in: ['download_click', 'download_success', 'download_error', 'download_aborted'] } },
  errors: { status: 'error' },
};

// Printable characters only: the search box feeds a database query.
const SAFE_Q = /[^A-Za-z0-9@_.:\-]/g;

/** Shared by the live feed and the CSV export so both honour the same filters. */
export function eventWhere(searchParams: URLSearchParams): Prisma.DownloadEventWhereInput {
  const group = GROUPS[searchParams.get('group') || 'all'] ?? GROUPS.all!;
  const visitor = (searchParams.get('visitor') || '').replace(SAFE_Q, '').slice(0, 45);
  const q = (searchParams.get('q') || '').replace(SAFE_Q, '').replace(/^@/, '').slice(0, 60);
  const and: Prisma.DownloadEventWhereInput[] = [];

  if (visitor) and.push({ OR: [{ visitorId: visitor }, { ip: visitor }] });
  if (q) {
    // One box that understands IPs, visitor ids, post ids, @usernames, sources and error codes.
    and.push({
      OR: [
        { ip: { startsWith: q } },
        { visitorId: { startsWith: q } },
        { postId: { startsWith: q } },
        { author: { contains: q } },
        { source: { contains: q } },
        { referrer: { contains: q } },
        { errorCode: { contains: q.toUpperCase() } },
        { page: { contains: q } },
      ],
    });
  }
  return { ...group, ...(and.length ? { AND: and } : {}) };
}
