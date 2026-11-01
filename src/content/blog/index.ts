import type { ComponentType } from 'react';
import { BackUpPosts } from './BackUpPosts';
import { BlurryVideo } from './BlurryVideo';
import { RepostRules } from './RepostRules';
import { WhatsAppQuality } from './WhatsAppQuality';

export interface BlogPost {
  slug: string;
  /** Shown as the H1 and on the blog index. */
  title: string;
  /** <title> tag. Kept under ~60 characters so search results don't truncate it. */
  seoTitle: string;
  description: string;
  /** Publication date as YYYY-MM-DD. */
  date: string;
  readingMinutes: number;
  /** Describes the cover image, which lives at /images/blog/<slug>.jpg. */
  imageAlt: string;
  Body: ComponentType;
}

/** Newest first. The blog index and sitemap both read this list. */
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'why-threads-videos-look-blurry',
    title: 'Why your saved Threads video looks blurry on a bigger screen',
    seoTitle: 'Why Your Saved Threads Video Looks Blurry',
    description:
      'A clip that looked fine in the app can turn soft on a laptop or TV. How to check what you really have, why it happens, and which fixes work.',
    date: '2026-11-01',
    readingMinutes: 4,
    imageAlt: 'The same video of a woman talking to camera, sharp on a phone and blocky on a laptop showing a resolution of 1280 by 720',
    Body: BlurryVideo,
  },
  {
    slug: 'back-up-your-threads-posts',
    title: 'How to back up your own Threads posts before you need to',
    seoTitle: 'How to Back Up Your Threads Posts and Videos',
    description:
      'Two ways to keep a copy of your Threads posts: the export Meta offers, and saving your best clips one by one. When to use each, and what the export leaves out.',
    date: '2026-11-01',
    readingMinutes: 4,
    imageAlt: 'A phone showing an email titled Your Threads Data while a laptop finishes backing up videos to an external drive',
    Body: BackUpPosts,
  },
  {
    slug: 'send-threads-video-on-whatsapp-without-losing-quality',
    title: 'How to send a Threads video on WhatsApp without losing quality',
    seoTitle: 'Send a Threads Video on WhatsApp in Full Quality',
    description:
      'WhatsApp shrinks videos sent the normal way, and HD mode only shrinks them less. Sending the clip as a document keeps it intact. Here is how, on iPhone and Android.',
    date: '2026-11-01',
    readingMinutes: 3,
    imageAlt: 'A phone chat showing the file threads-video.mp4 sent as a document, with the Document option selected in the attachment menu',
    Body: WhatsAppQuality,
  },
  {
    slug: 'can-you-repost-a-threads-video',
    title: 'Can you repost someone else’s Threads video?',
    seoTitle: 'Can You Repost Someone Else’s Threads Video?',
    description:
      'Public does not mean free to reuse. What you can do with a saved clip, when you need permission, and a short message you can send to get it.',
    date: '2026-11-01',
    readingMinutes: 4,
    imageAlt: 'Two phones, one with a video post and repost icon, the other with a message asking to repost and a reply saying yes, just credit me',
    Body: RepostRules,
  },
];

export function coverImage(post: BlogPost): string {
  return `/images/blog/${post.slug}.jpg`;
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function formatPostDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
