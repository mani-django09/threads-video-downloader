export interface MediaQualityDto {
  label: string;
  url: string;
  type: 'video' | 'image' | 'gif';
  width?: number;
  height?: number;
  fileSizeBytes?: number;
  /** Short handle for /api/download/, used instead of the long CDN URL. */
  downloadId?: string;
}

export interface ResolvedMediaDto {
  postId: string;
  mediaKind: 'video' | 'image' | 'gif';
  caption?: string;
  thumbnail?: string;
  /** Short handle for saving the cover image through /api/download/. */
  thumbnailDownloadId?: string;
  author?: { username: string; displayName?: string };
  durationSeconds?: number;
  qualities: MediaQualityDto[];
}

export interface ApiError {
  code: string;
  message: string;
}

export type ResolveResult = { success: true; data: ResolvedMediaDto } | { success: false; error: ApiError };

export async function resolveThreadsMedia(url: string, signal?: AbortSignal): Promise<ResolveResult> {
  try {
    const res = await fetch('/api/resolve/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
      signal,
    });
    const body = (await res.json()) as ResolveResult;
    return body;
  } catch {
    return { success: false, error: { code: 'NETWORK_ERROR', message: 'Something went wrong. Please try again.' } };
  }
}

export function buildDownloadUrl(quality: Pick<MediaQualityDto, 'url' | 'downloadId'>, filename: string, proxy = false): string {
  // Prefer the short id: a signed video URL is over 1 KB, which some servers
  // refuse in a request line. The raw URL stays as a fallback.
  const params = new URLSearchParams(quality.downloadId ? { id: quality.downloadId, filename } : { url: quality.url, filename });
  if (proxy) params.set('proxy', '1');
  return `/api/download/?${params.toString()}`;
}
