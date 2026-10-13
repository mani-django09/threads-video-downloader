import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolHero } from '@/components/ToolHero';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { pageMetadata } from '@/lib/seo';
import { VideoDownloadMore } from '@/content/more/VideoDownloadMore';

const PATH = '/threads-video-download/';

export const metadata: Metadata = pageMetadata({
  title: 'Threads Video Download: Formats & Troubleshooting',
  description:
    'What file you actually get when you download a Threads video, how big it is, and how to fix a download that fails.',
  path: PATH,
});

const SPECS = [
  ['Container', 'MP4'],
  ['Video', 'H.264, which plays natively on practically every phone, computer and TV'],
  ['Audio', 'AAC, inside the same file, so there is no separate audio track to fetch'],
  ['Shape', 'Whatever was posted: vertical, square or widescreen. Clips we tested ranged from 720×720 to 1280×720, plus tall 720×1280 ones'],
  ['Length & size', 'Scales with the clip. A short 20 to 40 second clip is usually a few megabytes'],
];

const ISSUES = [
  {
    q: 'The button does nothing, or says the link is not valid',
    a: 'The link was not recognised as a single Threads post. Copy it again with the share button (Copy link) rather than from a profile page, and make sure it starts with https://.',
  },
  {
    q: 'The preview loads, but it is a photo and not a video',
    a: 'Not every post has a video. When it is a photo or GIF the tool says so and offers that file instead. Text-only posts have nothing to download.',
  },
  {
    q: 'The file downloaded but will not play',
    a: 'Try VLC, which plays almost anything, or download again on a steadier connection. A download that was interrupted can leave a half-finished file.',
  },
  {
    q: 'It says the content is private or restricted',
    a: 'We only handle posts anyone can open without signing in. If the account is private, the post stays private, and that is deliberate.',
  },
  {
    q: 'It worked yesterday and not today',
    a: 'Threads changes how it serves media from time to time. Wait a few minutes and retry. If a public video keeps failing, tell us on the contact page and we will look into it.',
  },
];

export default function ThreadsVideoDownloadPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Video Download', href: PATH }]} />

      <ToolHero
        title="Threads Video Download"
        highlight="Download"
        description="What you actually get when you save a Threads video, how big it is, and what to do when it will not work."
      />

      <section className="container-app py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="section-title">What file do you actually get?</h2>
          <div className="prose-content mt-2">
            <p>
              A normal MP4 file, the same one Threads uses to play the clip in the app. In the videos we have tested the
              picture is H.264 and the sound is AAC, which is the most widely supported combination there is. That means
              the download opens in Photos, QuickTime, VLC, Windows Media Player, WhatsApp or a video editor without
              converting anything first.
            </p>
            <p>
              You only get what the post offers. Most public posts have a single version of the video, so you will see
              one file labelled Original. If a post ever offers several, each is listed with its size so you can choose.
              Nothing is generated, upscaled or re-encoded by us.
            </p>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-white shadow-card">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Typical properties of a downloaded Threads video</caption>
              <tbody>
                {SPECS.map(([k, v]) => (
                  <tr key={k} className="border-t border-line first:border-t-0">
                    <th scope="row" className="w-36 bg-brand-soft/60 px-5 py-4 font-semibold text-ink">
                      {k}
                    </th>
                    <td className="px-5 py-4 text-ink-2">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="container-app py-10 sm:py-14">
        <div className="max-w-2xl">
          <p className="eyebrow">When it will not work</p>
          <h2 className="section-title">Troubleshooting a failed download.</h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {ISSUES.map((item) => (
            <div key={item.q} className="bento !p-6">
              <h3 className="text-base font-bold tracking-tight text-ink">{item.q}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <VideoDownloadMore />

      <section className="container-app pb-20 pt-6 sm:pb-28">
        <div className="mx-auto max-w-3xl">
          <h2 className="section-title">Keeping your downloads tidy</h2>
          <div className="prose-content mt-2">
            <p>
              Your browser names the file for you (ours include the post ID), so if you are saving more than a handful
              of clips, make a folder for them and move files across as you go. On a phone, the Files or My Files app
              can select several at once and move them in one go.
            </p>
            <p>
              Video is one of the heaviest things on any device. If storage gets tight, clear out clips you have already
              watched or backed up. There is no reason to keep every download forever. And if you are not sure how to
              copy a link in the first place, the <Link href="/how-to-download-threads-videos/">step-by-step guide</Link>{' '}
              covers it.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
