// Verified against live threads.net: Apple-platform UAs (iOS Safari, macOS
// Safari) reliably get redirected from /t/ and /share/ links to the
// canonical /@user/post/ID page with full OG tags. A Windows/Chrome desktop
// UA was observed getting served a different, non-redirecting shell page
// with no OG tags at all for the same shortlink -- so it's deliberately
// excluded here rather than rotated in.
export const USER_AGENTS = [
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
];

export function randomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)] as string;
}

export const FETCH_TIMEOUT_MS = 12_000;
export const CACHE_TTL_MS = 15 * 60 * 1000;
export const CACHE_MAX_ENTRIES = 500;
