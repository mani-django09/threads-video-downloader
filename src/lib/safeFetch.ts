import { assertPublicHost, assertSafeUrl } from './security';

const MAX_REDIRECTS = 5;

export interface SafeFetchResult {
  response: Response;
  /** The URL that actually produced `response`, after following redirects. */
  finalUrl: string;
}

/**
 * fetch() that re-validates every redirect hop against the allowlist and the
 * private-address check. Plain `redirect: 'follow'` only lets us vet the first
 * URL, so an allowed host that redirected elsewhere would bypass the SSRF guard.
 */
export async function safeFetch(
  rawUrl: string,
  kind: 'lookup' | 'download',
  init: Omit<RequestInit, 'redirect'> = {},
): Promise<SafeFetchResult> {
  let current = rawUrl;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const url = assertSafeUrl(current, kind);
    await assertPublicHost(url.hostname);

    const response = await fetch(url.toString(), { ...init, redirect: 'manual' });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location) throw new Error('Redirect without location');
      await response.body?.cancel();
      current = new URL(location, url).toString();
      continue;
    }

    return { response, finalUrl: url.toString() };
  }

  throw new Error('Too many redirects');
}
