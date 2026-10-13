export interface ClientInfo {
  device: 'mobile' | 'tablet' | 'desktop' | 'bot';
  browser: string;
  os: string;
}

const BOT_RE = /bot|crawl|spider|slurp|facebookexternalhit|preview|monitor|headless|python-requests|curl\/|wget|axios|node-fetch|go-http|java\//i;

/**
 * Coarse browser/OS/device classification from a user agent. Deliberately small:
 * the raw user agent is never stored, only these three labels.
 */
export function parseUserAgent(ua: string | null | undefined): ClientInfo {
  const s = ua || '';
  if (!s || BOT_RE.test(s)) return { device: 'bot', browser: 'Bot', os: 'Unknown' };

  let os = 'Other';
  if (/iPhone|iPad|iPod/i.test(s)) os = 'iOS';
  else if (/Android/i.test(s)) os = 'Android';
  else if (/Windows/i.test(s)) os = 'Windows';
  else if (/Mac OS X|Macintosh/i.test(s)) os = 'macOS';
  else if (/CrOS/i.test(s)) os = 'ChromeOS';
  else if (/Linux/i.test(s)) os = 'Linux';

  let browser = 'Other';
  if (/Instagram/i.test(s)) browser = 'Instagram app';
  else if (/FBAN|FBAV|FB_IAB/i.test(s)) browser = 'Facebook app';
  else if (/Threads/i.test(s)) browser = 'Threads app';
  else if (/SamsungBrowser/i.test(s)) browser = 'Samsung Internet';
  else if (/Edg\//i.test(s)) browser = 'Edge';
  else if (/OPR\/|Opera/i.test(s)) browser = 'Opera';
  else if (/Firefox|FxiOS/i.test(s)) browser = 'Firefox';
  else if (/CriOS|Chrome\//i.test(s)) browser = 'Chrome';
  else if (/Safari\//i.test(s)) browser = 'Safari';

  let device: ClientInfo['device'] = 'desktop';
  if (/iPad|Tablet/i.test(s) || (/Android/i.test(s) && !/Mobile/i.test(s))) device = 'tablet';
  else if (/Mobi|iPhone|iPod|Android/i.test(s)) device = 'mobile';

  return { device, browser, os };
}
