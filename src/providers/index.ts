import type { DownloaderProvider } from './types';
import { threadsProvider } from './threads';

// New platforms register here: import their module and add it to this list.
// The API routes and frontend pick the right provider via matches(url) and
// never need platform-specific branching.
const providers: DownloaderProvider[] = [threadsProvider];

export function findProvider(url: string): DownloaderProvider | null {
  return providers.find((p) => p.matches(url)) ?? null;
}

export * from './types';
