import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolHero } from '@/components/ToolHero';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FaqSection } from '@/components/FaqSection';
import { IPHONE_FAQ } from '@/content/faq';
import { pageMetadata } from '@/lib/seo';
import { IphoneMore } from '@/content/more/IphoneMore';

const PATH = '/threads-video-downloader-iphone/';

export const metadata: Metadata = pageMetadata({
  title: 'Threads Video Downloader for iPhone (Free, Online)',
  description:
    'Save Threads videos on iPhone and iPad with Safari. Nothing to install: copy the link, paste it, download, then send it to Photos.',
  path: PATH,
});

const STEPS = [
  'In the Threads app, tap the share arrow under the post and choose Copy link.',
  'Open Safari (or Chrome) and come back to this page.',
  'Paste the link, or tap the Paste button, then press Download Video.',
  'Check the preview and tap the download button. Safari saves the MP4 to the Files app.',
];

const FIXES = [
  {
    title: 'Look for the download arrow',
    text: 'In Safari a small download icon appears next to the address bar when the file starts. Tap it to see progress and open the file.',
  },
  {
    title: 'Check both Downloads folders',
    text: 'Depending on your settings the file is in iCloud Drive > Downloads or On My iPhone > Downloads. Both appear in the Files app sidebar.',
  },
  {
    title: 'Use Safari rather than an in-app browser',
    text: 'Links opened inside other apps use a stripped-down browser. Copy the link and paste it into Safari for the smoothest download.',
  },
  {
    title: 'Free up a little storage',
    text: 'If your iPhone is almost full, a video will not finish saving. Clear some room and try once more.',
  },
];

export default function IphonePage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'iPhone', href: PATH }]} />

      <ToolHero
        title="Threads Video Downloader for iPhone"
        highlight="iPhone"
        description="Works right in Safari, so there is no app to install. Paste a public post link below to get started."
      />

      <section className="container-app py-12 sm:py-16">
        <div className="max-w-2xl">
          <p className="eyebrow">Four taps</p>
          <h2 className="section-title">Saving a Threads video on iPhone.</h2>
        </div>
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s} className="bento">
              <span className="gradient-text text-4xl font-extrabold tracking-tighter">{String(i + 1).padStart(2, '0')}</span>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-2">{s}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-app py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="section-title">Files or Photos? Here&apos;s the difference.</h2>
          <div className="prose-content mt-2">
            <p>
              iOS keeps two separate homes for videos. The <strong>Files</strong> app is a general file manager, and it is
              where Safari puts downloads. The <strong>Photos</strong> app is your camera roll. A video in Files does not
              turn up in Photos by itself.
            </p>
            <p>
              To move it across: open Files, tap the video, tap the Share icon, and choose <strong>Save Video</strong>. It
              is now in your camera roll as well, ready to send or edit like any clip you filmed.
            </p>

            <h3>Make it one tap away</h3>
            <p>
              In Safari, tap Share and choose Add to Home Screen. You get an icon that opens this page directly, which is
              handy if you save Threads clips often.
            </p>
          </div>
        </div>
      </section>

      <section className="container-app py-10 sm:py-14">
        <div className="max-w-2xl">
          <p className="eyebrow">If you cannot find the file</p>
          <h2 className="section-title">Four common iPhone fixes.</h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {FIXES.map((f) => (
            <div key={f.title} className="bento">
              <h3 className="text-lg font-bold tracking-tight text-ink">{f.title}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-2">{f.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-ink-3">
          Other errors? The general{' '}
          <Link href="/threads-video-download/" className="font-semibold text-accent-lo underline underline-offset-2">
            troubleshooting page
          </Link>{' '}
          covers what is not specific to iPhone.
        </p>
      </section>

      <IphoneMore />

      <FaqSection items={IPHONE_FAQ} title="iPhone questions" />
    </>
  );
}
