export const SITE_NAME = 'Threads Downloader';
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://threadsdl.io').replace(
  /\/$/,
  '',
);
export const SITE_DESCRIPTION =
  'Download publicly accessible Threads videos online in high quality. Fast, simple and free.';

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
