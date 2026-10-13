import type { ReactNode } from 'react';

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  /** Part of `title` to paint with the brand gradient. */
  highlight?: string;
  description?: string;
  children?: ReactNode;
}

/** Header for guide pages: same aurora backdrop as the tool hero, without the downloader. */
export function PageHero({ eyebrow, title, highlight, description, children }: PageHeroProps) {
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
    <section className="relative isolate overflow-hidden pb-10 pt-8 sm:pb-14 sm:pt-12">
      <div className="aurora" aria-hidden="true" />
      <div className="grid-fade absolute inset-0 -z-10" aria-hidden="true" />
      <div className="container-app">
        {eyebrow && <p className="eyebrow animate-fadeUp">{eyebrow}</p>}
        <h1 className="mt-3 max-w-3xl animate-fadeUp text-4xl font-extrabold leading-[1.06] tracking-[-0.03em] text-ink delay-1 sm:text-5xl">
          {heading}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl animate-fadeUp text-base leading-relaxed text-ink-2 delay-2 sm:text-lg">{description}</p>
        )}
        {children && <div className="mt-7 animate-fadeUp delay-3">{children}</div>}
      </div>
    </section>
  );
}
