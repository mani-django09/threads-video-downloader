'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatBytes } from '@/lib/format';

type Range = '24h' | '7d' | '30d';
type Tab = 'overview' | 'sources' | 'activity' | 'visitors' | 'ips';
type Group = 'all' | 'pages' | 'fetches' | 'downloads' | 'errors';

interface Kpis {
  visitors: number;
  uniqueIps: number;
  onlineNow: number;
  pageViews: number;
  sessions: number;
  fetchOk: number;
  fetchFail: number;
  fetchSuccessRate: number | null;
  downloadClicks: number;
  downloadOk: number;
  downloadFail: number;
  downloadAborted: number;
  downloadSuccessRate: number | null;
  rateLimited: number;
  avgFetchMs: number;
  avgDownloadMs: number;
  bytesServed: number;
}
interface Point {
  start: string;
  pageViews: number;
  visitors: number;
  fetchOk: number;
  fetchFail: number;
  dlOk: number;
  dlFail: number;
}
interface Counted {
  label: string;
  count: number;
}
interface SourceRow {
  source: string;
  medium: string;
  sessions: number;
  visitors: number;
  linksOk: number;
  downloadsOk: number;
  convertedVisitors: number;
  conversionRate: number | null;
}
interface Summary {
  range: Range;
  truncated: boolean;
  retentionDays: number;
  kpis: Kpis;
  funnel: Counted[];
  series: Point[];
  seriesUnit: 'hour' | 'day';
  sources: SourceRow[];
  breakdowns: {
    mediums: Counted[];
    campaigns: Counted[];
    landingPages: Counted[];
    pages: Counted[];
    devices: Counted[];
    browsers: Counted[];
    os: Counted[];
    media: Counted[];
    fetchErrors: Counted[];
    downloadErrors: Counted[];
  };
}
interface EventRow {
  id: string;
  createdAt: string;
  event: string;
  status: string;
  mediaType: string | null;
  processingMs: number | null;
  fileSize: number | null;
  errorCode: string | null;
  page: string | null;
  referrer: string | null;
  visitorId: string | null;
  ip: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
  postId: string | null;
  author: string | null;
  entry: boolean;
  source: string | null;
  medium: string | null;
  campaign: string | null;
}
interface VisitorRow {
  id: string;
  ip: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
  firstSeen: string;
  lastSeen: string;
  lastPage: string | null;
  landingPage: string | null;
  source: string | null;
  medium: string | null;
  campaign: string | null;
  pageViews: number;
  fetchOk: number;
  fetchFail: number;
  downloadOk: number;
  downloadFail: number;
  blocked: boolean;
}
interface IpRow {
  ip: string;
  events: number;
  visitors: number;
  pageViews: number;
  fetchOk: number;
  fetchFail: number;
  downloadOk: number;
  downloadFail: number;
  rateLimited: number;
  firstSeen: string;
  lastSeen: string;
  device: string | null;
  browser: string | null;
  os: string | null;
  source: string | null;
  blocked: boolean;
  blockReason: string | null;
}
interface BlockedRow {
  ip: string;
  reason: string | null;
  createdAt: string;
}

const EVENT_META: Record<string, { label: string; tone: string }> = {
  page_view: { label: 'Viewed a page', tone: 'bg-sky-50 text-sky-700 ring-sky-200' },
  fetch_start: { label: 'Pasted a link', tone: 'bg-slate-100 text-slate-600 ring-slate-200' },
  fetch_success: { label: 'Preview ready', tone: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  fetch_error: { label: 'Link failed', tone: 'bg-rose-50 text-rose-700 ring-rose-200' },
  download_click: { label: 'Download started', tone: 'bg-violet-50 text-violet-700 ring-violet-200' },
  download_success: { label: 'Download completed', tone: 'bg-emerald-100 text-emerald-800 ring-emerald-300' },
  download_error: { label: 'Download failed', tone: 'bg-rose-100 text-rose-800 ring-rose-300' },
  download_aborted: { label: 'Download cancelled', tone: 'bg-amber-50 text-amber-700 ring-amber-200' },
  rate_limited: { label: 'Rate limited / blocked', tone: 'bg-orange-50 text-orange-700 ring-orange-200' },
};

const MEDIUM_TONE: Record<string, string> = {
  'organic search': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  social: 'bg-sky-50 text-sky-700 ring-sky-200',
  referral: 'bg-violet-50 text-violet-700 ring-violet-200',
  email: 'bg-amber-50 text-amber-700 ring-amber-200',
  campaign: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200',
  direct: 'bg-slate-100 text-slate-600 ring-slate-200',
};

const ERROR_TEXT: Record<string, string> = {
  UPSTREAM_ERROR: 'Threads did not respond',
  UNSUPPORTED_POST: 'No downloadable media in post',
  PRIVATE_CONTENT: 'Private or restricted post',
  INVALID_URL: 'Not a valid Threads link',
  INVALID_TARGET: 'Download target not allowed',
  LINK_EXPIRED: 'Download link expired',
  CLIENT_CANCELLED: 'Visitor cancelled the download',
  STREAM_ERROR: 'Connection dropped mid-download',
  FILE_TOO_LARGE: 'File over the size limit',
  UNSUPPORTED_TYPE: 'Unsupported file type',
  RATE_LIMITED: 'Too many requests',
  ABUSE_BAN: 'Temporarily blocked (abuse)',
  BLOCKED: 'Blocked by admin',
  SERVER_ERROR: 'Server error',
};

const num = (n: number) => n.toLocaleString();
const pct = (n: number | null) => (n === null ? '–' : `${n}%`);
const ms = (n: number) => (n ? (n >= 1000 ? `${(n / 1000).toFixed(1)}s` : `${n}ms`) : '–');
const when = (iso: string) => new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
const ago = (iso: string) => {
  const s = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};
const errorText = (code: string | null) => (code ? ERROR_TEXT[code] ?? code : '');
const deviceLine = (r: { device: string | null; browser: string | null; os: string | null }) => [r.device, r.browser, r.os].filter(Boolean).join(' · ');

function Kpi({ label, value, sub, tone = 'text-ink' }: { label: string; value: string; sub?: string; tone?: string }) {
  return (
    <div className="card p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-3">{label}</p>
      <p className={`mt-1.5 text-2xl font-extrabold tracking-tight ${tone}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-ink-3">{sub}</p>}
    </div>
  );
}

function Pill({ children, tone }: { children: React.ReactNode; tone: string }) {
  return <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ${tone}`}>{children}</span>;
}

function SourcePill({ source, medium }: { source: string | null; medium: string | null }) {
  if (!source) return <span className="text-ink-3">–</span>;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="font-semibold text-ink">{source}</span>
      {medium && <Pill tone={MEDIUM_TONE[medium] ?? 'bg-slate-100 text-slate-600 ring-slate-200'}>{medium}</Pill>}
    </span>
  );
}

function Bars({ title, items, tone = 'bg-accent' }: { title: string; items: Counted[]; tone?: string }) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <div className="card p-5">
      <h3 className="text-sm font-bold text-ink">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-ink-3">No data yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((i) => (
            <li key={i.label}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="truncate font-medium text-ink-2">{errorText(i.label) || i.label}</span>
                <span className="font-bold tabular-nums text-ink">{num(i.count)}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-brand-soft">
                <div className={`h-full rounded-full ${tone}`} style={{ width: `${(i.count / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Chart({ title, series, unit, kind }: { title: string; series: Point[]; unit: 'hour' | 'day'; kind: 'traffic' | 'outcomes' }) {
  const totals = series.map((p) => (kind === 'traffic' ? p.pageViews : p.fetchOk + p.fetchFail + p.dlOk + p.dlFail));
  const max = Math.max(1, ...totals);
  const label = (iso: string) => {
    const d = new Date(iso);
    return unit === 'hour' ? d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-ink">{title}</h3>
        <div className="flex items-center gap-3 text-[11px] font-semibold text-ink-3">
          {kind === 'traffic' ? (
            <>
              <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-accent" /> Page views</span>
              <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-sky-300" /> Visitors</span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-emerald-500" /> OK</span>
              <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-rose-500" /> Failed</span>
            </>
          )}
        </div>
      </div>
      <div className="mt-5 flex h-40 items-end gap-[3px]">
        {series.map((p) => {
          const ok = p.fetchOk + p.dlOk;
          const fail = p.fetchFail + p.dlFail;
          const tip = kind === 'traffic' ? `${label(p.start)}: ${p.pageViews} views, ${p.visitors} visitors` : `${label(p.start)}: ${ok} ok, ${fail} failed`;
          return (
            <div key={p.start} title={tip} className="group relative flex h-full flex-1 flex-col justify-end">
              {kind === 'traffic' ? (
                <>
                  <div className="w-full rounded-t bg-accent/80 transition group-hover:bg-accent" style={{ height: `${(p.pageViews / max) * 100}%`, minHeight: p.pageViews ? 2 : 0 }} />
                  <div className="absolute bottom-0 w-full rounded-t bg-sky-300/90" style={{ height: `${(p.visitors / max) * 100}%`, minHeight: p.visitors ? 2 : 0 }} />
                </>
              ) : (
                <>
                  <div className="w-full bg-rose-500" style={{ height: `${(fail / max) * 100}%`, minHeight: fail ? 2 : 0 }} />
                  <div className="w-full rounded-b bg-emerald-500" style={{ height: `${(ok / max) * 100}%`, minHeight: ok ? 2 : 0 }} />
                </>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[10px] font-semibold text-ink-3">
        <span>{series[0] ? label(series[0].start) : ''}</span>
        <span>{series.length ? label(series[series.length - 1]!.start) : ''}</span>
      </div>
    </div>
  );
}

function EventDetail({ e }: { e: EventRow }) {
  const bits: string[] = [];
  if (e.event === 'page_view') {
    bits.push(e.page ?? '/');
    if (e.entry) bits.push('visit started');
    if (e.campaign) bits.push(`campaign ${e.campaign}`);
    else if (e.referrer) bits.push(`from ${e.referrer}`);
  } else {
    if (e.author) bits.push(`@${e.author}`);
    if (e.postId) bits.push(e.postId);
    if (e.mediaType) bits.push(e.mediaType);
    if (e.fileSize) bits.push(formatBytes(e.fileSize) ?? '');
    if (e.processingMs) bits.push(ms(e.processingMs));
    if (e.errorCode) bits.push(errorText(e.errorCode));
  }
  return <span className="text-ink-2">{bits.filter(Boolean).join(' · ') || '–'}</span>;
}

export function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [range, setRange] = useState<Range>('7d');
  const [group, setGroup] = useState<Group>('all');
  const [filter, setFilter] = useState(''); // visitor id or IP picked by clicking
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState(''); // debounced search text
  const [summary, setSummary] = useState<Summary | null>(null);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [visitors, setVisitors] = useState<VisitorRow[]>([]);
  const [visitorTotal, setVisitorTotal] = useState(0);
  const [ips, setIps] = useState<IpRow[]>([]);
  const [ipTotal, setIpTotal] = useState(0);
  const [blocked, setBlocked] = useState<BlockedRow[]>([]);
  const [loadedAt, setLoadedAt] = useState<Date | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setQuery(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  const eventParams = useCallback(() => {
    const p = new URLSearchParams({ group });
    if (filter) p.set('visitor', filter);
    if (query) p.set('q', query);
    return p;
  }, [group, filter, query]);

  const load = useCallback(async () => {
    try {
      const calls: Promise<Response>[] = [fetch(`/api/admin/summary/?range=${range}`)];
      if (tab === 'activity') calls.push(fetch(`/api/admin/events/?${eventParams().toString()}&limit=150`));
      if (tab === 'visitors') calls.push(fetch(`/api/admin/visitors/?range=${range}`));
      if (tab === 'ips') calls.push(fetch(`/api/admin/ips/?range=${range}`));
      const responses = await Promise.all(calls);
      if (responses.some((r) => r.status === 401)) {
        router.push('/admin/login');
        return;
      }
      const [s, second] = await Promise.all(responses.map((r) => r.json()));
      if (s.success) setSummary(s.data);
      if (tab === 'activity' && second?.success) setEvents(second.data);
      if (tab === 'visitors' && second?.success) {
        setVisitors(second.data.visitors);
        setVisitorTotal(second.data.total);
      }
      if (tab === 'ips' && second?.success) {
        setIps(second.data.ips);
        setIpTotal(second.data.total);
        setBlocked(second.data.blocked);
      }
      setLoadedAt(new Date());
      setError('');
    } catch {
      setError('Could not refresh. Retrying…');
    }
  }, [range, tab, eventParams, router]);

  useEffect(() => {
    void load();
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') void load();
    }, 15000);
    return () => clearInterval(interval);
  }, [load]);

  async function handleLogout() {
    await fetch('/api/admin/logout/', { method: 'POST' });
    router.push('/admin/login');
  }

  function drillInto(value: string) {
    setFilter(value);
    setGroup('all');
    setSearch('');
    setTab('activity');
  }

  async function blockIp(ip: string) {
    const reason = window.prompt(`Block ${ip} from looking up and downloading?\n\nOptional reason (only you see this):`, '');
    if (reason === null) return;
    const res = await fetch('/api/admin/blocklist/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ip, reason }) });
    const body = await res.json().catch(() => ({}));
    setNotice(res.ok ? `${ip} is now blocked.` : body.error || 'Could not block that address.');
    void load();
  }

  async function unblockIp(ip: string) {
    const res = await fetch(`/api/admin/blocklist/?ip=${encodeURIComponent(ip)}`, { method: 'DELETE' });
    setNotice(res.ok ? `${ip} is unblocked.` : 'Could not unblock that address.');
    void load();
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setNotice(`Copied ${text}`);
    } catch {
      setNotice('Copy is blocked by the browser.');
    }
  }

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(''), 3500);
    return () => clearTimeout(t);
  }, [notice]);

  const k = summary?.kpis;
  const tabs: Array<{ id: Tab; label: string }> = [
    { id: 'overview', label: 'Overview' },
    { id: 'sources', label: 'Traffic sources' },
    { id: 'activity', label: 'Live activity' },
    { id: 'visitors', label: 'Visitors' },
    { id: 'ips', label: 'IP addresses' },
  ];

  const exportHref = `/api/admin/export/?range=${range}&${eventParams().toString()}`;

  return (
    <section className="container-app py-8 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">Analytics dashboard</h1>
          <p className="mt-1 text-sm text-ink-3">
            {k ? (
              <>
                <span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-500 align-middle" />
                {k.onlineNow} {k.onlineNow === 1 ? 'visitor' : 'visitors'} active in the last 5 minutes
              </>
            ) : (
              'Loading…'
            )}
            {loadedAt && <span className="ml-2">· updated {loadedAt.toLocaleTimeString()}</span>}
            {error && <span className="ml-2 text-rose-600">· {error}</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-full border border-line bg-white p-1 text-xs font-bold">
            {(['24h', '7d', '30d'] as Range[]).map((r) => (
              <button key={r} type="button" onClick={() => setRange(r)} className={`rounded-full px-3.5 py-1.5 transition ${range === r ? 'bg-ink text-white' : 'text-ink-2 hover:text-ink'}`}>
                {r === '24h' ? '24 hours' : r === '7d' ? '7 days' : '30 days'}
              </button>
            ))}
          </div>
          <button type="button" onClick={handleLogout} className="btn-secondary px-4 py-2">
            Log out
          </button>
        </div>
      </div>

      <nav className="mt-6 flex gap-1 overflow-x-auto border-b border-line" aria-label="Dashboard sections">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id ? 'page' : undefined}
            className={`-mb-px whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-bold transition ${tab === t.id ? 'border-accent text-ink' : 'border-transparent text-ink-3 hover:text-ink'}`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {notice && (
        <p role="status" className="mt-4 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white">
          {notice}
        </p>
      )}
      {summary?.truncated && (
        <p className="mt-4 rounded-xl bg-amber-50 px-4 py-2.5 text-sm text-amber-800">Very high traffic: only the most recent 200,000 events in this range are counted.</p>
      )}

      {/* ---------------- Overview ---------------- */}
      {tab === 'overview' && summary && k && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Kpi label="Visitors" value={num(k.visitors)} sub={`${num(k.uniqueIps)} unique IPs · ${num(k.sessions)} visits`} />
            <Kpi label="Page views" value={num(k.pageViews)} />
            <Kpi label="Links pasted OK" value={num(k.fetchOk)} sub={`${num(k.fetchFail)} failed · ${pct(k.fetchSuccessRate)} success`} tone="text-emerald-700" />
            <Kpi label="Avg link lookup" value={ms(k.avgFetchMs)} sub="paste → preview" />
            <Kpi label="Downloads completed" value={num(k.downloadOk)} sub={`${pct(k.downloadSuccessRate)} of finished`} tone="text-emerald-700" />
            <Kpi label="Downloads failed" value={num(k.downloadFail)} tone={k.downloadFail ? 'text-rose-600' : 'text-ink'} />
            <Kpi label="Downloads cancelled" value={num(k.downloadAborted)} sub="visitor stopped it" tone={k.downloadAborted ? 'text-amber-600' : 'text-ink'} />
            <Kpi label="Data served" value={formatBytes(k.bytesServed) ?? '0 B'} sub={`avg ${ms(k.avgDownloadMs)} per file · ${num(k.rateLimited)} blocked/limited`} />
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-bold text-ink">Visitor journey</h3>
            <p className="mt-0.5 text-xs text-ink-3">How many distinct visitors reached each step.</p>
            <ol className="mt-5 grid gap-3 sm:grid-cols-5">
              {summary.funnel.map((f, i) => {
                const first = Math.max(1, summary.funnel[0]?.count ?? 1);
                const prev = i > 0 ? summary.funnel[i - 1]!.count : 0;
                return (
                  <li key={f.label} className="rounded-2xl border border-line bg-brand-soft/60 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-3">{f.label}</p>
                    <p className="mt-1 text-2xl font-extrabold text-ink">{num(f.count)}</p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
                      <div className="h-full rounded-full bg-gradient-to-r from-accent to-[#db2777]" style={{ width: `${(f.count / first) * 100}%` }} />
                    </div>
                    <p className="mt-1.5 text-[11px] text-ink-3">{i === 0 ? 'everyone' : prev > 0 ? `${Math.round((f.count / prev) * 100)}% of previous step` : '–'}</p>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Chart title="Traffic" series={summary.series} unit={summary.seriesUnit} kind="traffic" />
            <Chart title="Link lookups and downloads" series={summary.series} unit={summary.seriesUnit} kind="outcomes" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Bars title="Where visitors come from" items={summary.sources.slice(0, 8).map((s) => ({ label: s.source, count: s.visitors }))} tone="bg-sky-400" />
            <Bars title="Top landing pages" items={summary.breakdowns.landingPages} />
            <Bars title="Devices" items={summary.breakdowns.devices} tone="bg-violet-400" />
            <Bars title="Browsers" items={summary.breakdowns.browsers} tone="bg-violet-400" />
            <Bars title="Operating systems" items={summary.breakdowns.os} tone="bg-violet-400" />
            <Bars title="What people download" items={summary.breakdowns.media} tone="bg-emerald-500" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Bars title="Why link lookups failed" items={summary.breakdowns.fetchErrors} tone="bg-rose-500" />
            <Bars title="Why downloads failed or were cancelled" items={summary.breakdowns.downloadErrors} tone="bg-rose-500" />
          </div>
          <p className="text-xs text-ink-3">Activity, including IP addresses, is kept for {summary.retentionDays} days and then deleted automatically.</p>
        </div>
      )}

      {/* ---------------- Traffic sources ---------------- */}
      {tab === 'sources' && summary && (
        <div className="mt-6 space-y-6">
          <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="bg-brand-soft/70 text-[11px] font-bold uppercase tracking-[0.1em] text-ink-3">
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3 text-right">Visitors</th>
                  <th className="px-4 py-3 text-right">Visits</th>
                  <th className="px-4 py-3 text-right">Links OK</th>
                  <th className="px-4 py-3 text-right">Downloads</th>
                  <th className="px-4 py-3 text-right">Downloaded / visitors</th>
                </tr>
              </thead>
              <tbody>
                {summary.sources.map((s) => (
                  <tr key={`${s.source}|${s.medium}`} className="border-t border-line">
                    <td className="px-4 py-3">
                      <SourcePill source={s.source} medium={s.medium} />
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{num(s.visitors)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{num(s.sessions)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{num(s.linksOk)}</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums text-emerald-700">{num(s.downloadsOk)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {num(s.convertedVisitors)} / {num(s.visitors)} <span className="ml-1 font-bold text-ink">{pct(s.conversionRate)}</span>
                    </td>
                  </tr>
                ))}
                {summary.sources.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-ink-3">
                      No traffic recorded in this range yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="text-xs leading-relaxed text-ink-3">
            A visitor is credited to the source of their first visit in this range. “Direct” means no referrer was sent: typed or bookmarked addresses, links from
            apps that hide the referrer, and some privacy browsers. “Unknown” is traffic from before source tracking was added. Add <code className="rounded bg-brand-soft px-1">?utm_source=…&amp;utm_medium=…&amp;utm_campaign=…</code> to
            links you share to see them here by name. Search engines do not reveal the keyword.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <Bars title="Traffic by medium" items={summary.breakdowns.mediums} tone="bg-sky-400" />
            <Bars title="Campaigns (utm_campaign)" items={summary.breakdowns.campaigns} tone="bg-fuchsia-400" />
            <Bars title="Landing pages" items={summary.breakdowns.landingPages} />
          </div>
        </div>
      )}

      {/* ---------------- Live activity ---------------- */}
      {tab === 'activity' && (
        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2">
            {([
              ['all', 'Everything'],
              ['pages', 'Page views'],
              ['fetches', 'Link lookups'],
              ['downloads', 'Downloads'],
              ['errors', 'Errors only'],
            ] as Array<[Group, string]>).map(([g, label]) => (
              <button key={g} type="button" onClick={() => setGroup(g)} className={`rounded-full border px-4 py-1.5 text-xs font-bold transition ${group === g ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink-2 hover:border-ink/30'}`}>
                {label}
              </button>
            ))}
            <a href={exportHref} className="ml-auto rounded-full border border-line bg-white px-4 py-1.5 text-xs font-bold text-ink-2 transition hover:border-ink/30">
              Export CSV
            </a>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search IP, visitor id, post id, @username, source or error…"
              aria-label="Search activity"
              className="h-11 min-w-[260px] flex-1 rounded-full border border-line bg-white px-5 text-sm outline-none focus:border-accent focus:ring-4 focus:ring-accent/15"
            />
            {filter && (
              <button type="button" onClick={() => setFilter('')} className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-4 py-2 text-xs font-bold text-accent-lo">
                Showing only {filter} <span aria-hidden="true">×</span>
                <span className="sr-only">clear filter</span>
              </button>
            )}
          </div>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead>
                <tr className="bg-brand-soft/70 text-[11px] font-bold uppercase tracking-[0.1em] text-ink-3">
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Visitor / IP</th>
                  <th className="px-4 py-3">What happened</th>
                  <th className="px-4 py-3">Details</th>
                  <th className="px-4 py-3">Source</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => {
                  const meta = EVENT_META[e.event] ?? { label: e.event, tone: 'bg-slate-100 text-slate-600 ring-slate-200' };
                  return (
                    <tr key={e.id} className="border-t border-line align-top">
                      <td className="whitespace-nowrap px-4 py-3 text-ink-3" title={when(e.createdAt)}>
                        {ago(e.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        {e.ip ? (
                          <button type="button" onClick={() => drillInto(e.ip!)} title="Show everything from this IP" className="font-mono text-xs font-bold text-ink hover:text-accent-lo hover:underline">
                            {e.ip}
                          </button>
                        ) : (
                          <span className="text-xs text-ink-3">IP not recorded</span>
                        )}
                        <div className="mt-0.5 flex items-center gap-2">
                          {e.visitorId && (
                            <button type="button" onClick={() => drillInto(e.visitorId!)} className="font-mono text-[11px] font-semibold text-accent-lo hover:underline">
                              {e.visitorId}
                            </button>
                          )}
                          <span className="text-[11px] text-ink-3">{deviceLine(e)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Pill tone={meta.tone}>{meta.label}</Pill>
                      </td>
                      <td className="max-w-sm px-4 py-3">
                        <EventDetail e={e} />
                      </td>
                      <td className="px-4 py-3">{e.entry ? <SourcePill source={e.source} medium={e.medium} /> : <span className="text-ink-3">–</span>}</td>
                    </tr>
                  );
                })}
                {events.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-ink-3">
                      No activity matches this filter yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------------- Visitors ---------------- */}
      {tab === 'visitors' && (
        <div className="mt-6">
          <p className="text-sm text-ink-3">
            {num(visitorTotal)} distinct visitors in this range{visitors.length < visitorTotal ? ` (showing the ${visitors.length} most recent)` : ''}. Click a visitor or IP to see everything they did.
          </p>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
            <table className="w-full min-w-[1020px] text-left text-sm">
              <thead>
                <tr className="bg-brand-soft/70 text-[11px] font-bold uppercase tracking-[0.1em] text-ink-3">
                  <th className="px-4 py-3">Visitor</th>
                  <th className="px-4 py-3">IP address</th>
                  <th className="px-4 py-3">Device</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Last seen</th>
                  <th className="px-4 py-3 text-right">Pages</th>
                  <th className="px-4 py-3 text-right">Links</th>
                  <th className="px-4 py-3 text-right">Downloads</th>
                </tr>
              </thead>
              <tbody>
                {visitors.map((v) => (
                  <tr key={v.id} className="border-t border-line">
                    <td className="px-4 py-3">
                      <button type="button" onClick={() => drillInto(v.id)} className="font-mono text-xs font-semibold text-accent-lo hover:underline">
                        {v.id}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      {v.ip ? (
                        <span className="inline-flex items-center gap-2">
                          <button type="button" onClick={() => drillInto(v.ip!)} className="font-mono text-xs font-bold text-ink hover:text-accent-lo hover:underline">
                            {v.ip}
                          </button>
                          {v.blocked && <Pill tone="bg-rose-100 text-rose-800 ring-rose-300">blocked</Pill>}
                        </span>
                      ) : (
                        <span className="text-xs text-ink-3">not recorded</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ink-2">{deviceLine(v) || '–'}</td>
                    <td className="px-4 py-3">
                      <SourcePill source={v.source} medium={v.medium} />
                      {v.landingPage && <p className="mt-0.5 text-[11px] text-ink-3">landed on {v.landingPage}</p>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink-3" title={when(v.lastSeen)}>
                      {ago(v.lastSeen)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{v.pageViews}</td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      <span className="text-emerald-700">{v.fetchOk}</span>
                      {v.fetchFail > 0 && <span className="text-rose-600"> / {v.fetchFail} failed</span>}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      <span className="text-emerald-700">{v.downloadOk}</span>
                      {v.downloadFail > 0 && <span className="text-rose-600"> / {v.downloadFail} failed</span>}
                    </td>
                  </tr>
                ))}
                {visitors.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-ink-3">
                      No visitors in this range yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------------- IP addresses ---------------- */}
      {tab === 'ips' && (
        <div className="mt-6 space-y-6">
          <p className="text-sm text-ink-3">
            {num(ipTotal)} IP addresses in this range{ips.length < ipTotal ? ` (busiest ${ips.length} shown)` : ''}. Blocking stops an address from looking up links and downloading; it can still read the site. Entries marked
            <span className="mx-1 inline-block"><Pill tone="bg-orange-50 text-orange-700 ring-orange-200">review</Pill></span>
            have a lot of requests, many failures or were rate limited.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
            <table className="w-full min-w-[1080px] text-left text-sm">
              <thead>
                <tr className="bg-brand-soft/70 text-[11px] font-bold uppercase tracking-[0.1em] text-ink-3">
                  <th className="px-4 py-3">IP address</th>
                  <th className="px-4 py-3">Device / source</th>
                  <th className="px-4 py-3 text-right">Requests</th>
                  <th className="px-4 py-3 text-right">Links</th>
                  <th className="px-4 py-3 text-right">Downloads</th>
                  <th className="px-4 py-3 text-right">Limited</th>
                  <th className="px-4 py-3">Last seen</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {ips.map((x) => {
                  const failures = x.fetchFail + x.downloadFail;
                  const review = !x.blocked && (x.rateLimited > 0 || x.events >= 150 || (failures >= 10 && failures > (x.fetchOk + x.downloadOk) * 2));
                  return (
                    <tr key={x.ip} className="border-t border-line align-top">
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <button type="button" onClick={() => drillInto(x.ip)} title="Show everything from this IP" className="font-mono text-xs font-bold text-ink hover:text-accent-lo hover:underline">
                            {x.ip}
                          </button>
                          <button type="button" onClick={() => void copy(x.ip)} aria-label={`Copy ${x.ip}`} className="rounded border border-line px-1.5 text-[10px] font-bold text-ink-3 hover:text-ink">
                            copy
                          </button>
                          {x.blocked && <Pill tone="bg-rose-100 text-rose-800 ring-rose-300">blocked</Pill>}
                          {review && <Pill tone="bg-orange-50 text-orange-700 ring-orange-200">review</Pill>}
                        </div>
                        <p className="mt-0.5 text-[11px] text-ink-3">
                          {x.visitors} {x.visitors === 1 ? 'browser' : 'browsers'}
                          {x.blockReason ? ` · ${x.blockReason}` : ''}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-ink-2">{deviceLine(x) || '–'}</p>
                        <p className="mt-0.5 text-[11px] text-ink-3">{x.source ? `via ${x.source}` : ''}</p>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">{num(x.events)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        <span className="text-emerald-700">{x.fetchOk}</span>
                        {x.fetchFail > 0 && <span className="text-rose-600"> / {x.fetchFail} failed</span>}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        <span className="text-emerald-700">{x.downloadOk}</span>
                        {x.downloadFail > 0 && <span className="text-rose-600"> / {x.downloadFail} failed</span>}
                      </td>
                      <td className={`px-4 py-3 text-right tabular-nums ${x.rateLimited ? 'font-bold text-orange-600' : 'text-ink-3'}`}>{x.rateLimited}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink-3" title={when(x.lastSeen)}>
                        {ago(x.lastSeen)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {x.blocked ? (
                          <button type="button" onClick={() => void unblockIp(x.ip)} className="rounded-full border border-line px-3.5 py-1.5 text-xs font-bold text-ink-2 hover:border-ink/30">
                            Unblock
                          </button>
                        ) : (
                          <button type="button" onClick={() => void blockIp(x.ip)} className="rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100">
                            Block
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {ips.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-ink-3">
                      No IP addresses recorded in this range yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-bold text-ink">Blocked addresses ({blocked.length})</h3>
            {blocked.length === 0 ? (
              <p className="mt-3 text-sm text-ink-3">Nothing is blocked.</p>
            ) : (
              <ul className="mt-3 divide-y divide-line">
                {blocked.map((b) => (
                  <li key={b.ip} className="flex flex-wrap items-center justify-between gap-3 py-2.5">
                    <span>
                      <span className="font-mono text-sm font-bold text-ink">{b.ip}</span>
                      <span className="ml-3 text-xs text-ink-3">
                        blocked {ago(b.createdAt)}
                        {b.reason ? ` · ${b.reason}` : ''}
                      </span>
                    </span>
                    <button type="button" onClick={() => void unblockIp(b.ip)} className="rounded-full border border-line px-3.5 py-1.5 text-xs font-bold text-ink-2 hover:border-ink/30">
                      Unblock
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
