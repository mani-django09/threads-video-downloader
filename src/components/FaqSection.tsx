import { JsonLd } from './JsonLd';

export interface FaqItem {
  question: string;
  answer: string;
}

export function FaqSection({ items, withSchema = true, title = 'Frequently Asked Questions' }: { items: FaqItem[]; withSchema?: boolean; title?: string }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <section className="container-app py-14 sm:py-20" aria-labelledby={title ? 'faq-heading' : undefined}>
      {withSchema && <JsonLd data={jsonLd} />}
      {title && (
        <div className="max-w-2xl">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading" className="section-title">
            {title}
          </h2>
        </div>
      )}
      <div className="mt-8 grid gap-3">
        {items.map((item) => (
          <details
            key={item.question}
            className="group rounded-2xl border border-line bg-white px-5 py-4 shadow-sm transition-all open:border-accent/30 open:shadow-card sm:px-6"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold text-ink marker:content-none">
              {item.question}
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-soft text-ink-2 transition-all group-open:rotate-45 group-open:bg-accent group-open:text-white">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
              </span>
            </summary>
            <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-ink-2">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
