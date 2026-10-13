import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

const ROUTES = [
  { path: '/', priority: 1, changeFrequency: 'daily' as const },
  { path: '/threads-video-downloader/', priority: 0.9, changeFrequency: 'daily' as const },
  { path: '/threads-video-download/', priority: 0.7, changeFrequency: 'weekly' as const },
  { path: '/threads-image-downloader/', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/threads-gif-downloader/', priority: 0.7, changeFrequency: 'weekly' as const },
  { path: '/how-to-download-threads-videos/', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/threads-video-downloader-android/', priority: 0.6, changeFrequency: 'monthly' as const },
  { path: '/threads-video-downloader-iphone/', priority: 0.6, changeFrequency: 'monthly' as const },
  { path: '/faq/', priority: 0.5, changeFrequency: 'monthly' as const },
  { path: '/about/', priority: 0.5, changeFrequency: 'monthly' as const },
  { path: '/privacy-policy/', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/terms-of-service/', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/dmca/', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/disclaimer/', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/contact/', priority: 0.3, changeFrequency: 'yearly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
