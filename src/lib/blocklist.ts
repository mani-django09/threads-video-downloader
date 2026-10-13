import { prisma } from './db';

/**
 * IPs blocked from the lookup and download endpoints (never from the public
 * pages or the admin panel). The list lives in the database and is cached in
 * memory for a few seconds so the hot path stays a Set lookup.
 */
const REFRESH_MS = 15_000;

const g = globalThis as typeof globalThis & { __blocked?: { ips: Set<string>; loadedAt: number; loading?: Promise<void> } };
const state = (g.__blocked ??= { ips: new Set<string>(), loadedAt: 0 });

async function refresh(): Promise<void> {
  try {
    const rows = await prisma.blockedIp.findMany({ select: { ip: true } });
    state.ips = new Set(rows.map((r) => r.ip));
  } catch {
    // Keep the previous list rather than failing requests if the DB hiccups.
  } finally {
    state.loadedAt = Date.now();
    state.loading = undefined;
  }
}

export async function isBlocked(ip: string | null): Promise<boolean> {
  if (!ip) return false;
  if (Date.now() - state.loadedAt > REFRESH_MS) {
    state.loading ??= refresh();
    // First load waits so a blocked IP cannot slip through right after a restart;
    // later refreshes happen in the background.
    if (state.loadedAt === 0) await state.loading;
  }
  return state.ips.has(ip);
}

/** Called after the admin changes the list so it takes effect immediately. */
export function invalidateBlocklist(): void {
  state.loadedAt = 0;
}
