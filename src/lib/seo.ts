import type { Metadata } from 'next';
import { absoluteUrl } from './site';

interface PageMetadataInput {
  /** Full <title>. Kept under ~60 characters so search results don't truncate it. */
  title: string;
  description: string;
  /** Path with leading and trailing slash, e.g. "/faq/". */
  path: string;
  /** Publication date (YYYY-MM-DD). Marks the page as an article for social previews. */
  publishedTime?: string;
}

/**
 * Per-page metadata in one place. A page-level `openGraph` object replaces the
 * parent's instead of merging, which silently drops og:image -- so the image is
 * always set here rather than relying on inheritance.
 */
export function pageMetadata({ title, description, path, publishedTime }: PageMetadataInput): Metadata {
  const image = { url: absoluteUrl('/opengraph-image'), width: 1200, height: 630, alt: 'Threads Downloader' };
  const shared = { url: absoluteUrl(path), title, description, images: [image] };
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: publishedTime ? { ...shared, type: 'article', publishedTime } : { ...shared, type: 'website' },
    twitter: { card: 'summary_large_image', title, description, images: [image.url] },
  };
}
