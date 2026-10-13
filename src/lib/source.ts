/**
 * Turns "where did this visit come from" into a label the admin can read:
 * a search engine, a social network, a campaign, a plain referral, or direct.
 */
export interface TrafficSource {
  source: string;
  medium: 'organic search' | 'social' | 'referral' | 'email' | 'campaign' | 'direct';
}

const SEARCH: Array<[RegExp, string]> = [
  [/(^|\.)google\./, 'Google'],
  [/googlequicksearchbox/, 'Google'],
  [/(^|\.)bing\.com$/, 'Bing'],
  [/(^|\.)yahoo\./, 'Yahoo'],
  [/(^|\.)duckduckgo\.com$/, 'DuckDuckGo'],
  [/(^|\.)baidu\.com$/, 'Baidu'],
  [/(^|\.)yandex\./, 'Yandex'],
  [/(^|\.)ecosia\.org$/, 'Ecosia'],
  [/(^|\.)search\.brave\.com$/, 'Brave Search'],
  [/(^|\.)naver\.com$/, 'Naver'],
  [/(^|\.)startpage\.com$/, 'Startpage'],
  [/(^|\.)qwant\.com$/, 'Qwant'],
];

const SOCIAL: Array<[RegExp, string]> = [
  [/(^|\.)(facebook\.com|fb\.com|fb\.me)$/, 'Facebook'],
  [/(^|\.)instagram\.com$/, 'Instagram'],
  [/(^|\.)threads\.(net|com)$/, 'Threads'],
  [/(^|\.)(twitter\.com|x\.com|t\.co)$/, 'X (Twitter)'],
  [/(^|\.)reddit\.com$/, 'Reddit'],
  [/(^|\.)(youtube\.com|youtu\.be)$/, 'YouTube'],
  [/(^|\.)pinterest\./, 'Pinterest'],
  [/(^|\.)(linkedin\.com|lnkd\.in)$/, 'LinkedIn'],
  [/(^|\.)(whatsapp\.com|wa\.me)$/, 'WhatsApp'],
  [/(^|\.)(t\.me|telegram\.org)$/, 'Telegram'],
  [/(^|\.)tiktok\.com$/, 'TikTok'],
  [/(^|\.)(quora\.com)$/, 'Quora'],
];

const EMAIL = /(^|\.)(mail\.google\.com|outlook\.live\.com|outlook\.office\.com|mail\.yahoo\.com|com\.google\.android\.gm)$/;

const UTM_SAFE = /^[A-Za-z0-9 _\-.+]{1,60}$/;
const clean = (v: unknown): string | null => (typeof v === 'string' && UTM_SAFE.test(v.trim()) ? v.trim().slice(0, 60) : null);

export interface UtmParams {
  source?: unknown;
  medium?: unknown;
  campaign?: unknown;
}

/** `host` is the referring host (no path), or null when there was none. */
export function classifySource(host: string | null, utm?: UtmParams): TrafficSource & { campaign: string | null } {
  const utmSource = clean(utm?.source);
  const campaign = clean(utm?.campaign);
  if (utmSource) {
    const m = (clean(utm?.medium) ?? '').toLowerCase();
    const medium: TrafficSource['medium'] = /mail/.test(m) ? 'email' : /social/.test(m) ? 'social' : /organic|seo|search/.test(m) ? 'organic search' : 'campaign';
    return { source: utmSource, medium, campaign };
  }

  if (!host) return { source: 'Direct', medium: 'direct', campaign };
  const h = host.toLowerCase();
  if (EMAIL.test(h)) return { source: 'Email', medium: 'email', campaign };
  for (const [re, label] of SEARCH) if (re.test(h)) return { source: label, medium: 'organic search', campaign };
  for (const [re, label] of SOCIAL) if (re.test(h)) return { source: label, medium: 'social', campaign };
  return { source: h.replace(/^www\./, ''), medium: 'referral', campaign };
}
