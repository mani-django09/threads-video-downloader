'use client';

import { useEffect, useRef, useState } from 'react';
import { buildDownloadUrl, resolveThreadsMedia, type ResolvedMediaDto } from '@/lib/apiClient';
import { isLikelyThreadsUrl } from '@/lib/validation';
import { trackEvent } from '@/lib/analytics';
import { formatBytes } from '@/lib/format';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface DownloaderProps {
  /** Label on the main button. Defaults to the spec wording. */
  ctaLabel?: string;
  placeholder?: string;
}

const KIND_LABEL = { video: 'video', image: 'photo', gif: 'GIF' } as const;
const FORMAT_LABEL = { video: 'MP4', image: 'JPG', gif: 'GIF' } as const;

export function Downloader({ ctaLabel = 'Download', placeholder = 'Paste Threads video URL here' }: DownloaderProps) {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [step, setStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [media, setMedia] = useState<ResolvedMediaDto | null>(null);
  const [selectedQuality, setSelectedQuality] = useState(0);
  const [started, setStarted] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Walks the progress steps while a request is in flight so it never looks frozen.
  useEffect(() => {
    if (status !== 'loading') return;
    setStep(0);
    const t1 = setTimeout(() => setStep(1), 700);
    const t2 = setTimeout(() => setStep(2), 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [status]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();

    if (!trimmed || !isLikelyThreadsUrl(trimmed)) {
      setStatus('error');
      setErrorMessage('Please enter a valid Threads post URL.');
      return;
    }

    trackEvent('downloader_start');
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus('loading');
    setMedia(null);
    setSelectedQuality(0);
    setStarted(false);

    const result = await resolveThreadsMedia(trimmed, controller.signal);
    if (controller.signal.aborted) return;

    if (!result.success) {
      setStatus('error');
      setErrorMessage(result.error.message);
      trackEvent('downloader_error', { code: result.error.code });
      return;
    }

    setMedia(result.data);
    setStatus('success');
    trackEvent('downloader_success', { mediaKind: result.data.mediaKind });
  }

  function handleDownload() {
    if (!media) return;
    const quality = media.qualities[selectedQuality];
    if (!quality) return;

    trackEvent('download_click', { mediaKind: media.mediaKind, quality: quality.label });

    // A plain link to the streaming endpoint (served as an attachment) lets the
    // browser download natively with its own progress, instead of buffering the
    // whole file in memory first.
    const a = document.createElement('a');
    a.href = buildDownloadUrl(quality, `threads-${media.postId}-${quality.label.toLowerCase().replace(/\s+/g, '-')}`, true);
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();

    setStarted(true);
  }

  function handleCoverDownload() {
    if (!media?.thumbnail) return;
    trackEvent('thumbnail_download', { mediaKind: media.mediaKind });
    const a = document.createElement('a');
    a.href = buildDownloadUrl({ url: media.thumbnail, downloadId: media.thumbnailDownloadId }, `threads-${media.postId}-cover`, true);
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function reset() {
    abortRef.current?.abort();
    setStatus('idle');
    setErrorMessage('');
    setMedia(null);
    setStarted(false);
  }

  function pasteAnother() {
    reset();
    setUrl('');
    inputRef.current?.focus();
  }

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
        inputRef.current?.focus();
      }
    } catch {
      // Clipboard access can be blocked by the browser; the user can still paste manually.
    }
  }

  const busy = status === 'loading';

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <label htmlFor="threads-url" className="sr-only">
          Threads post URL
        </label>
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-3" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M9.5 14.5 14.5 9.5M11 7l1.3-1.3a3.5 3.5 0 0 1 5 5L16 12M13 17l-1.3 1.3a3.5 3.5 0 0 1-5-5L8 12"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <input
            ref={inputRef}
            id="threads-url"
            name="threads-url"
            type="url"
            inputMode="url"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={placeholder}
            className="h-12 w-full rounded-2xl border border-line bg-white pl-12 pr-14 text-[15px] text-ink outline-none transition placeholder:text-ink-3 focus:border-accent focus:ring-4 focus:ring-accent/15 sm:pr-24 sm:text-base"
          />
          <button
            type="button"
            onClick={handlePaste}
            aria-label="Paste link from clipboard"
            className="absolute right-2.5 top-1/2 flex h-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-brand-soft px-2.5 text-xs font-bold text-ink-2 transition hover:border-accent/40 hover:bg-white hover:text-ink sm:px-3.5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="sm:hidden">
              <rect x="8" y="3" width="8" height="4" rx="1.2" stroke="currentColor" strokeWidth="1.8" />
              <path d="M16 5h1.5A1.5 1.5 0 0 1 19 6.5v13a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5v-13A1.5 1.5 0 0 1 6.5 5H8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span className="hidden sm:inline">Paste</span>
          </button>
        </div>
        <button type="submit" disabled={busy} className="btn-cta h-10 gap-1.5 self-center whitespace-nowrap px-4 py-0 text-xs">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 3v11.5m0 0-4-4m4 4 4-4M5 17.5c0 2 3 3.5 7 3.5s7-1.5 7-3.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {busy ? 'Fetching…' : ctaLabel}
        </button>
      </form>

      <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-ink-3 sm:justify-start sm:pl-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3Z" stroke="currentColor" strokeWidth="1.6" />
          <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        We don&apos;t ask for your Threads password or account credentials.
      </p>

      <div className="mt-4 empty:mt-0" aria-live="polite">
        {status === 'loading' && <LoadingState step={step} />}
        {status === 'error' && <ErrorState message={errorMessage} onRetry={reset} />}
        {status === 'success' && media && (
          <MediaPreview
            media={media}
            selectedQuality={selectedQuality}
            onSelectQuality={setSelectedQuality}
            onDownload={handleDownload}
            onPasteAnother={pasteAnother}
            onDownloadCover={handleCoverDownload}
            started={started}
          />
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-brand-soft/70 px-3.5 py-3 text-left">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-3">{label}</p>
      <p className="mt-0.5 truncate text-sm font-bold text-ink">{value}</p>
    </div>
  );
}

function MediaPreview({
  media,
  selectedQuality,
  onSelectQuality,
  onDownload,
  onPasteAnother,
  onDownloadCover,
  started,
}: {
  media: ResolvedMediaDto;
  selectedQuality: number;
  onSelectQuality: (i: number) => void;
  onDownload: () => void;
  onPasteAnother: () => void;
  onDownloadCover: () => void;
  started: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const quality = media.qualities[selectedQuality];
  const kind = KIND_LABEL[media.mediaKind];
  const format = FORMAT_LABEL[media.mediaKind];
  const size = formatBytes(quality?.fileSizeBytes);
  const canSaveCover = media.mediaKind !== 'image' && !!media.thumbnailDownloadId;

  async function copyCaption() {
    if (!media.caption) return;
    try {
      await navigator.clipboard.writeText(media.caption);
      trackEvent('caption_copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be blocked; the caption is still visible to select by hand.
    }
  }

  return (
    <div className="animate-fadeUp overflow-hidden rounded-3xl border border-line bg-white text-left shadow-lift">
      <div className="grid gap-0 md:grid-cols-[250px_1fr]">
        {/* Phone-style frame so vertical clips look right. */}
        <div className="flex items-center justify-center bg-gradient-to-br from-[#14141f] to-[#23203d] p-4 md:p-5">
          <div className="w-full max-w-[210px] overflow-hidden rounded-[1.4rem] border-[3px] border-white/15 bg-black shadow-2xl">
            {media.mediaKind === 'video' && quality ? (
              <video
                key={quality.url}
                src={quality.url}
                poster={media.thumbnail}
                controls
                playsInline
                preload="metadata"
                className="aspect-[9/16] w-full bg-black object-contain"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={media.thumbnail || quality?.url}
                alt="Preview of the Threads media"
                className="aspect-[9/16] w-full bg-black object-contain"
              />
            )}
          </div>
        </div>

        <div className="flex flex-col p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold capitalize text-emerald-700 ring-1 ring-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {kind} found
            </span>
            {media.author?.username && <span className="text-sm font-medium text-ink-2">@{media.author.username}</span>}
          </div>

          {media.caption && (
            <div className="mt-3">
              <p className="line-clamp-3 text-sm leading-relaxed text-ink-2">{media.caption}</p>
              <button
                type="button"
                onClick={copyCaption}
                className="mt-1.5 text-xs font-bold text-accent-lo underline underline-offset-2 hover:text-ink"
              >
                {copied ? 'Caption copied' : 'Copy caption'}
              </button>
            </div>
          )}

          <div className="mt-4 grid grid-cols-3 gap-2.5">
            <Stat label="Format" value={format} />
            <Stat label="Size" value={size ?? 'Not shown'} />
            <Stat label="Quality" value={quality?.label ?? '—'} />
          </div>

          {media.qualities.length > 1 && (
            <div className="mt-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-3">Choose quality</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {media.qualities.map((q, i) => (
                  <button
                    key={`${q.label}-${i}`}
                    type="button"
                    onClick={() => onSelectQuality(i)}
                    aria-pressed={i === selectedQuality}
                    className={`rounded-full border px-4 py-1.5 text-xs font-bold transition ${
                      i === selectedQuality
                        ? 'border-accent bg-accent text-white shadow-pop'
                        : 'border-line bg-white text-ink-2 hover:border-accent/40'
                    }`}
                  >
                    {q.label}
                    {formatBytes(q.fileSizeBytes) ? ` · ${formatBytes(q.fileSizeBytes)}` : ''}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto pt-5">
            <button type="button" onClick={onDownload} className="btn-cta w-full py-3 text-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 3v11.5m0 0-4-4m4 4 4-4M5 17.5c0 2 3 3.5 7 3.5s7-1.5 7-3.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Download {format}
            </button>

            <p
              className={`mt-3 flex items-center justify-center gap-1.5 text-center text-sm font-semibold ${
                started ? 'text-emerald-700' : 'text-ink-2'
              }`}
            >
              {started ? 'Download started. Check your downloads folder.' : `Your ${kind} is ready.`}
            </p>

            {canSaveCover && (
              <button
                type="button"
                onClick={onDownloadCover}
                className="btn-secondary mt-2.5 w-full py-2.5 text-sm"
              >
                Save cover image (JPG)
              </button>
            )}

            <button
              type="button"
              onClick={onPasteAnother}
              className="mx-auto mt-2 block text-xs font-semibold text-ink-3 underline underline-offset-2 hover:text-ink"
            >
              Paste another link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
