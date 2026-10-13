import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FaqSection } from '@/components/FaqSection';
import { PageHero } from '@/components/PageHero';
import { FULL_FAQ } from '@/content/faq';
import { pageMetadata } from '@/lib/seo';

const PATH = '/faq/';

export const metadata: Metadata = pageMetadata({
  title: 'Threads Video Downloader FAQ – Your Questions Answered',
  description: 'Answers to common questions about downloading Threads videos, images, and GIFs online.',
  path: PATH,
});

export default function FaqPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'FAQ', href: PATH }]} />
      <PageHero
        eyebrow="Help"
        title="Frequently Asked Questions"
        highlight="Questions"
        description="The things people ask us most about saving videos, photos and GIFs from Threads: how it works, which devices are supported, and what this tool deliberately won't do."
      />
      <FaqSection items={FULL_FAQ} title="" />
    </>
  );
}
