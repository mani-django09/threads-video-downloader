import type { MetadataRoute } from 'next';
import { SITE_NAME } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: 'ThreadsDL',
    description: 'Download publicly accessible Threads videos online in high quality.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0a0a0a',
    icons: [{ src: '/icon', sizes: '64x64', type: 'image/png' }],
  };
}
