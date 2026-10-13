import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolHero } from '@/components/ToolHero';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FaqSection } from '@/components/FaqSection';
import { ANDROID_FAQ } from '@/content/faq';
import { pageMetadata } from '@/lib/seo';
import { AndroidMore } from '@/content/more/AndroidMore';

const PATH = '/threads-video-downloader-android/';

export const metadata: Metadata = pageMetadata({
  title: 'Threads Video Downloader for Android (Free, Online)',
  description:
    'Save Threads videos on Android with Chrome or Samsung Internet. Nothing to install: copy the link, paste it, download the MP4.',
  path: PATH,
});

const STEPS = [
  'In the Threads app, tap the share arrow under the post and choose Copy link.',
  'Open Chrome (or Samsung Internet, or Firefox) and come back to this page.',
  'Paste the link, or tap the Paste button, then press Download Video.',
  'Check the preview and tap the download button. The MP4 saves to your Downloads folder.',
];

const BROWSERS = [
  ['Chrome', 'Shows a download notification; the file lands in Downloads and is listed in the browser’s own downloads page.'],
  ['Samsung Internet', 'Downloads appear in the My Files app under Downloads.'],
  ['Firefox', 'Open the downloads panel from the menu, or find the file in the Downloads folder.'],
];

const FIXES = [
  {
    title: 'Open it in a real browser',
    text: 'Links tapped inside other apps often open in a small built-in browser that can block downloads. Copy the link and paste it into Chrome or Samsung Internet instead.',
  },
  {
    title: 'Switch off data saver for a moment',
    text: 'Data saver and battery saver modes can pause downloads in the background. Turn them off, or keep the screen on until the file has finished.',
  },
  {
    title: 'Check your storage',
    text: 'A nearly full phone will quietly fail to save a video. Clear a little space and try again.',
  },
  {
    title: 'Allow the download if asked',
    text: 'Chrome sometimes asks before downloading a file. Tapping Download (or Allow) is all it needs.',
  },
];

export default function AndroidPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Android', href: PATH }]} />

      <ToolHero
        title="Threads Video Downloader for Android"
        highlight="Android"
        description="Runs in your phone's browser, so there is no app to install. Paste a public post link below to get started."
      />

      <section className="container-app py-12 sm:py-16">
        <div className="max-w-2xl">
          <p className="eyebrow">Four taps</p>
          <h2 className="section-title">Saving a Threads video on Android.</h2>
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
          <h2 className="section-title">Which browser, and where does the file go?</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
            All three below work the same with this tool, so use whichever is already on your phone.
          </p>
          <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white shadow-card">
            <table className="w-full text-left text-sm">
              <tbody>
                {BROWSERS.map(([b, d]) => (
                  <tr key={b} className="border-t border-line first:border-t-0">
                    <th scope="row" className="w-40 bg-brand-soft/60 px-5 py-4 font-semibold text-ink">
                      {b}
                    </th>
                    <td className="px-5 py-4 text-ink-2">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-6">
            <h3>Getting it into your Gallery</h3>
            <p>
              Downloads go to the Downloads folder first. On most phones the Gallery or Google Photos notices new videos
              within a moment and shows them in a Downloads album. If yours does not, open the Files app, find the
              video, and use Move or Share to put it where you want it.
            </p>
            <h3>Make it one tap away</h3>
            <p>
              In Chrome, open the menu and choose Add to Home screen. You get an icon on your home screen that opens this
              page directly, which is handy if you save Threads clips often.
            </p>
          </div>
        </div>
      </section>

      <section className="container-app py-10 sm:py-14">
        <div className="max-w-2xl">
          <p className="eyebrow">If a download stalls</p>
          <h2 className="section-title">Four common Android fixes.</h2>
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
          Still stuck? The general <Link href="/threads-video-download/" className="font-semibold text-accent-lo underline underline-offset-2">troubleshooting page</Link>{' '}
          covers errors that are not specific to Android.
        </p>
      </section>

      <AndroidMore />

      <FaqSection items={ANDROID_FAQ} title="Android questions" />
    </>
  );
}
