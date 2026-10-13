/**
 * Common contract every platform downloader module must implement. Adding a
 * new platform (Pinterest, X/Twitter, Facebook, Instagram, ...) means adding
 * a new folder under src/providers/<platform>/ that exports an object
 * satisfying this interface -- the API route and frontend never change.
 */

export type MediaKind = 'video' | 'image' | 'gif';

export interface MediaQuality {
  label: string; // "HD", "SD", "Original"
  url: string; // CDN URL, must pass an allowed-download-host check before use
  type: MediaKind;
  width?: number;
  height?: number;
  fileSizeBytes?: number;
}

export interface ResolvedMedia {
  provider: string;
  postId: string;
  sourceUrl: string;
  mediaKind: MediaKind;
  caption?: string;
  thumbnail?: string;
  author?: {
    username: string;
    displayName?: string;
  };
  durationSeconds?: number;
  qualities: MediaQuality[];
}

export class UnsupportedPostError extends Error {}
export class PrivateOrRestrictedError extends Error {}
export class UpstreamFetchError extends Error {}

export interface DownloaderProvider {
  id: string;
  matches(url: string): boolean;
  resolve(url: string): Promise<ResolvedMedia>;
}
