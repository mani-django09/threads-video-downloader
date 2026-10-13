import type { Metadata } from 'next';
import { absoluteUrl } from './site';

interface PageMetadataInput {
  /** Full <title>. Kept under ~60 characters so search results don't truncate it. */
  title: string;
  description: string;
  /** Path with leading and trailing slash, e.g. "/faq/". */
  path: string;
}

/**
 * Per-page metadata in one place. A page-level `openGraph` object replaces the
 * parent's instead of merging, which silently drops og:image -- so the image is
 * always set here rather than relying on inheritance.
 */
export function pageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  const image = { url: absoluteUrl('/opengraph-image'), width: 1200, height: 630, alt: 'Threads Downloader' };
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: { type: 'website', url: absoluteUrl(path), title, description, images: [image] },
    twitter: { card: 'summary_large_image', title, description, images: [image.url] },
  };
}
