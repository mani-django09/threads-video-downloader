import { isLikelyThreadsUrl } from '@/lib/validation';
import type { DownloaderProvider } from '../types';
import { resolveThreadsPost } from './resolve';

export const threadsProvider: DownloaderProvider = {
  id: 'threads',
  matches: isLikelyThreadsUrl,
  resolve: resolveThreadsPost,
};
