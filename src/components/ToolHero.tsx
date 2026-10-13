import type { ReactNode } from 'react';
import { DownloaderPanel } from './DownloaderPanel';

interface ToolHeroProps {
  title: string;
  /** Part of `title` to paint with the brand gradient. */
  highlight?: string;
  description: string;
  /** Homepage uses a larger display size than the individual tool pages. */
  size?: 'default' | 'large';
  panelClassName?: string;
  ctaLabel?: string;
  placeholder?: string;
  footer?: ReactNode;
}

/**
 * The centered, aurora-backed hero above the URL input on every page that
 * embeds the downloader. Defined once so it looks and behaves identically
 * everywhere instead of being rebuilt per page.
 */
export function ToolHero({
  title,
  highlight,
  description,
  size = 'default',
  panelClassName = 'mt-5 max-w-2xl',
  ctaLabel,
  placeholder,
  footer,
}: ToolHeroProps) {
  const at = highlight ? title.indexOf(highlight) : -1;
  const heading =
    highlight && at >= 0 ? (
      <>
        {title.slice(0, at)}
        <span className="gradient-text">{highlight}</span>
        {title.slice(at + highlight.length)}
      </>
    ) : (
      title
    );

  return (
    <section id="downloader" className={`relative isolate scroll-mt-16 overflow-hidden ${size === 'large' ? 'pb-10 pt-7 sm:pb-14 sm:pt-10' : 'pb-8 pt-5 sm:pb-12 sm:pt-8'}`}>
      <div className="aurora" aria-hidden="true" />
      <div className="grid-fade absolute inset-0 -z-10" aria-hidden="true" />

      <div className="container-app flex flex-col items-center text-center">
        <h1
          className={`max-w-3xl animate-fadeUp font-extrabold leading-[1.08] tracking-[-0.03em] text-ink delay-1 ${
            size === 'large' ? 'text-3xl sm:text-5xl' : 'text-3xl sm:text-4xl'
          }`}
        >
          {heading}
        </h1>
        <p className="mt-3 max-w-xl animate-fadeUp text-sm leading-relaxed text-ink-2 delay-2 sm:text-base">{description}</p>
        <div className="w-full animate-fadeUp delay-3">
          <DownloaderPanel className={`mx-auto ${panelClassName}`} ctaLabel={ctaLabel} placeholder={placeholder} />
        </div>
        {footer && <div className="mt-5 w-full animate-fadeUp delay-4">{footer}</div>}
      </div>
    </section>
  );
}
