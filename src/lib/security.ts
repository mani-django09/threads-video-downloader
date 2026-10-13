import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

/**
 * Hosts we are willing to fetch HTML/JSON from when resolving a post.
 * Deliberately an exact-suffix allowlist (not a substring test) to prevent
 * bypasses like "threads.net.evil.com" or "evil.com?threads.net".
 */
const ALLOWED_LOOKUP_HOSTS = [/^([a-z0-9-]+\.)*threads\.net$/i, /^([a-z0-9-]+\.)*threads\.com$/i];

/**
 * Hosts we are willing to redirect/proxy a download to. Threads media is
 * served from Meta's CDN domains (fbcdn.net / cdninstagram.com), never from
 * arbitrary third-party hosts.
 */
const ALLOWED_DOWNLOAD_HOSTS = [
  /(^|\.)fbcdn\.net$/i,
  /(^|\.)cdninstagram\.com$/i,
  /(^|\.)threads\.net$/i,
];

const PRIVATE_IP_RANGES: Array<[string, number]> = [
  ['10.0.0.0', 8],
  ['172.16.0.0', 12],
  ['192.168.0.0', 16],
  ['127.0.0.0', 8],
  ['169.254.0.0', 16],
  ['0.0.0.0', 8],
];

function ipToLong(ip: string): number {
  return ip
    .split('.')
    .reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

function isPrivateIPv4(ip: string): boolean {
  if (isIP(ip) !== 4) return false;
  const ipLong = ipToLong(ip);
  return PRIVATE_IP_RANGES.some(([base, bits]) => {
    const baseLong = ipToLong(base);
    const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
    return (ipLong & mask) === (baseLong & mask);
  });
}

function isPrivateIPv6(ip: string): boolean {
  const lower = ip.toLowerCase();
  return lower === '::1' || lower.startsWith('fc') || lower.startsWith('fd') || lower.startsWith('fe80');
}

export function isAllowedLookupHost(hostname: string): boolean {
  return ALLOWED_LOOKUP_HOSTS.some((re) => re.test(hostname));
}

export function isAllowedDownloadHost(hostname: string): boolean {
  return ALLOWED_DOWNLOAD_HOSTS.some((re) => re.test(hostname));
}

/**
 * SSRF guard: resolves the hostname and rejects private/loopback/link-local
 * targets even when the hostname itself passed the allowlist (defends
 * against DNS rebinding). Call this immediately before making the outbound
 * request, not just at validation time.
 */
export async function assertPublicHost(hostname: string): Promise<void> {
  if (isIP(hostname)) {
    if (isIP(hostname) === 4 && isPrivateIPv4(hostname)) throw new Error('Blocked private address');
    if (isIP(hostname) === 6 && isPrivateIPv6(hostname)) throw new Error('Blocked private address');
    return;
  }
  const records = await lookup(hostname, { all: true });
  for (const rec of records) {
    if (rec.family === 4 && isPrivateIPv4(rec.address)) {
      throw new Error('Blocked private address');
    }
    if (rec.family === 6 && isPrivateIPv6(rec.address)) {
      throw new Error('Blocked private address');
    }
  }
}

export function assertSafeUrl(rawUrl: string, kind: 'lookup' | 'download'): URL {
  const url = new URL(rawUrl);
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error('Unsupported protocol');
  }
  const allowed = kind === 'lookup' ? isAllowedLookupHost(url.hostname) : isAllowedDownloadHost(url.hostname);
  if (!allowed) {
    throw new Error('Host not allowed');
  }
  return url;
}
