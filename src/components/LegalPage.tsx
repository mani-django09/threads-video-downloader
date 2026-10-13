import Link from 'next/link';
import type { ReactNode } from 'react';
import { Breadcrumbs } from './Breadcrumbs';
import { JsonLd } from './JsonLd';
import { SITE_NAME, absoluteUrl } from '@/lib/site';

export const CONTACT_EMAIL = 'support@threadsdl.io';
/** Bump this whenever a policy's wording actually changes. */
export const POLICY_UPDATED = 'October 13, 2026';

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

const RELATED = [
  { href: '/about/', label: 'About us' },
  { href: '/privacy-policy/', label: 'Privacy Policy' },
  { href: '/terms-of-service/', label: 'Terms of Service' },
  { href: '/dmca/', label: 'DMCA & copyright' },
  { href: '/disclaimer/', label: 'Disclaimer' },
  { href: '/contact/', label: 'Contact' },
];

interface LegalPageProps {
  path: string;
  title: string;
  /** One or two sentences in plain language, shown in a box above the detail. */
  summary: string;
  sections: LegalSection[];
  /** Page type for structured data. Defaults to a generic web page. */
  schemaType?: 'WebPage' | 'AboutPage' | 'ContactPage';
  updated?: string;
}

/** Shared layout for the policy pages so they read, link and are structured the same way. */
export function LegalPage({ path, title, summary, sections, schemaType = 'WebPage', updated = POLICY_UPDATED }: LegalPageProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: `${title} | ${SITE_NAME}`,
    url: absoluteUrl(path),
    dateModified: new Date(updated).toISOString().slice(0, 10),
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: absoluteUrl('/') },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: absoluteUrl('/') },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: title, href: path }]} />
      <article className="container-app pb-20 pt-2">
        <header className="max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-ink-3">
            Last updated <time dateTime={new Date(updated).toISOString().slice(0, 10)}>{updated}</time> · Maintained by the {SITE_NAME} team
          </p>
          <div className="mt-6 rounded-2xl border border-line bg-brand-soft/70 p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent-lo">In short</p>
            <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{summary}</p>
          </div>
        </header>

        <div className="mt-10 grid gap-10 lg:grid-cols-[220px_1fr]">
          <nav aria-label="On this page" className="hidden lg:block">
            <div className="sticky top-24">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-3">On this page</p>
              <ol className="mt-3 space-y-2 border-l border-line pl-4 text-sm">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="text-ink-2 hover:text-accent-lo">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <div className="prose-content max-w-3xl">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24 pt-9 first:pt-0">
                <h2 className="!mt-0">{s.title}</h2>
                {s.body}
              </section>
            ))}

            <div className="mt-12 rounded-2xl border border-line bg-white p-5 shadow-card">
              <p className="!mt-0 font-bold text-ink">Questions about this page?</p>
              <p>
                Write to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. A person on the team reads every message, and we reply within three
                business days.
              </p>
            </div>

            <nav aria-label="Related pages" className="mt-8 flex flex-wrap gap-2">
              {RELATED.filter((r) => r.href !== path).map((r) => (
                <Link key={r.href} href={r.href} className="rounded-full border border-line bg-white px-4 py-1.5 text-xs font-bold !text-ink-2 !no-underline hover:border-ink/30">
                  {r.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </article>
    </>
  );
}
