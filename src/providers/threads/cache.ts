import type { ResolvedMedia } from '../types';
import { CACHE_MAX_ENTRIES, CACHE_TTL_MS } from './constants';

interface CacheEntry {
  value: ResolvedMedia;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

export function cacheGet(key: string): ResolvedMedia | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) {
    cache.delete(key);
    return null;
  }
  // refresh recency
  cache.delete(key);
  cache.set(key, entry);
  return entry.value;
}

export function cacheSet(key: string, value: ResolvedMedia): void {
  if (cache.size >= CACHE_MAX_ENTRIES) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey) cache.delete(oldestKey);
  }
  cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
}
