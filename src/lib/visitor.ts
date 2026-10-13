import { getClientIp, hashValue } from './hash';
import { parseUserAgent, type ClientInfo } from './ua';

export interface VisitorContext extends ClientInfo {
  /** Raw client IP, only kept for security/abuse handling and the admin panel. */
  ip: string | null;
  ipHash: string;
  userAgentHash: string;
  /** One stable, anonymous id per browser+network. Not reversible to an IP. */
  visitorId: string;
}

// IPv4 / IPv6 characters only, so a forged header can never put arbitrary text in the log.
const IP_RE = /^[0-9a-fA-F:.]{3,45}$/;

export function getVisitor(headers: Headers): VisitorContext {
  const ip = getClientIp(headers);
  const ua = headers.get('user-agent') || 'unknown';
  return {
    ...parseUserAgent(ua),
    ip: IP_RE.test(ip) ? ip : null,
    ipHash: hashValue(ip),
    userAgentHash: hashValue(ua),
    visitorId: hashValue(`${ip}|${ua}`).slice(0, 12),
  };
}

/** Only the host of a referrer is kept; paths and query strings can hold personal data. */
export function referrerHost(raw: string | null | undefined, ownHost: string): string | null {
  if (!raw) return null;
  try {
    const host = new URL(raw).hostname.replace(/^www\./, '');
    return host && host !== ownHost.replace(/^www\./, '') ? host.slice(0, 80) : null;
  } catch {
    return null;
  }
}
