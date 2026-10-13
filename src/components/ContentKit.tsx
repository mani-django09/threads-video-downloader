import type { ReactNode } from 'react';

/** A titled prose section: the readable column used for long-form guidance on tool pages. */
export function Section({ eyebrow, title, children, wide = false }: { eyebrow?: string; title: string; children: ReactNode; wide?: boolean }) {
  return (
    <section className="container-app py-10 sm:py-14">
      <div className={wide ? 'max-w-4xl' : 'mx-auto max-w-3xl'}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="section-title">{title}</h2>
        <div className="prose-content mt-2">{children}</div>
      </div>
    </section>
  );
}

/** A grid of short cards, for scenarios or tips. */
export function CardSection({
  eyebrow,
  title,
  intro,
  items,
  cols = 2,
  footnote,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  items: Array<{ title: string; text: string }>;
  cols?: 2 | 3;
  footnote?: ReactNode;
}) {
  return (
    <section className="container-app py-10 sm:py-14">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="section-title">{title}</h2>
        {intro && <p className="section-lead">{intro}</p>}
      </div>
      <div className={`mt-10 grid gap-5 sm:grid-cols-2 ${cols === 3 ? 'lg:grid-cols-3' : ''}`}>
        {items.map((i) => (
          <div key={i.title} className="bento">
            <h3 className="text-lg font-bold tracking-tight text-ink">{i.title}</h3>
            <p className="mt-2.5 text-[15px] leading-relaxed text-ink-2">{i.text}</p>
          </div>
        ))}
      </div>
      {footnote && <p className="mt-8 max-w-3xl text-sm leading-relaxed text-ink-3">{footnote}</p>}
    </section>
  );
}

/** A comparison or reference table with a screen-reader caption. */
export function Table({ caption, head, rows }: { caption: string; head: string[]; rows: string[][] }) {
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
      <table className="w-full min-w-[520px] text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="bg-brand-soft/70 text-[11px] font-bold uppercase tracking-[0.1em] text-ink-3">
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-t border-line align-top">
              {r.map((c, i) =>
                i === 0 ? (
                  <th key={i} scope="row" className="bg-brand-soft/40 px-4 py-3 font-semibold text-ink">
                    {c}
                  </th>
                ) : (
                  <td key={i} className="px-4 py-3 leading-relaxed text-ink-2">
                    {c}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A highlighted aside inside prose. */
export function Callout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="my-6 rounded-2xl border border-accent/20 bg-accent-soft/60 p-5">
      <p className="!mt-0 text-sm font-bold text-accent-lo">{title}</p>
      <div className="mt-1.5 text-[15px] leading-relaxed text-ink-2 [&>p]:!mt-2 first:[&>p]:!mt-0">{children}</div>
    </aside>
  );
}
