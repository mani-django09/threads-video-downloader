import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolHero } from '@/components/ToolHero';
import { FaqSection } from '@/components/FaqSection';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FULL_FAQ } from '@/content/faq';
import { pageMetadata } from '@/lib/seo';
import { VideoDownloaderMore } from '@/content/more/VideoDownloaderMore';

const PATH = '/threads-video-downloader/';

export const metadata: Metadata = pageMetadata({
  title: 'Threads Video Downloader Online – Save MP4 Free',
  description:
    'Save public Threads videos as MP4 in their original quality. Paste the post link, preview the clip and download. Works on iPhone, Android and desktop.',
  path: PATH,
});

const WHAT_YOU_GET = [
  {
    title: 'The original file',
    text: 'The MP4 Threads itself plays. Same picture, same sound, no second round of compression and no watermark.',
  },
  {
    title: 'A preview first',
    text: 'You see the clip, the poster and the caption before you save anything, so you know it is the right one.',
  },
  {
    title: 'The size up front',
    text: 'The file size is shown before you tap download. Handy on mobile data, or when storage is tight.',
  },
  {
    title: 'Plays everywhere',
    text: 'Plain MP4. It opens in Photos, VLC, Windows Media Player, WhatsApp, an editor, whatever you use.',
  },
];

const TIPS = [
  'Not sure a post is public? Open the link in a private or incognito tab. If you can watch it there, we can usually fetch it.',
  'Long clips are bigger files. If you are on mobile data, check the size shown on the result card first.',
  'Vertical, square and widescreen videos all work. You get the clip in the shape it was posted.',
  'A repost works the same as the original, as long as the post is public and the video is still up.',
  'The file name includes the post ID, so repeated downloads stay easy to tell apart.',
];

export default function ThreadsVideoDownloaderPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Video Downloader', href: PATH }]} />

      <ToolHero
        title="Threads Video Downloader"
        highlight="Downloader"
        description="Paste a public Threads post link, preview the clip, and save it as an MP4 in its original quality."
      />

      <section className="container-app py-14 sm:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow">What you get</p>
          <h2 className="section-title">The video, as it was posted.</h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHAT_YOU_GET.map((item) => (
            <div key={item.title} className="bento">
              <h3 className="text-lg font-bold tracking-tight text-ink">{item.title}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-2">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-app pb-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="section-title">Quality, without the jargon</h2>
          <div className="prose-content mt-2">
            <p>
              When someone uploads a video to Threads, the app keeps it as an MP4 and plays that file back. For most
              public posts there is a single version of the clip, and that is what this tool gives you, labelled
              honestly as <strong>Original</strong>. We don&apos;t invent HD and SD buttons that would just point at the
              same file.
            </p>
            <p>
              If a post ever exposes more than one version, you&apos;ll see each one as its own option with its file
              size next to it. The rule of thumb is simple: the bigger file is sharper, the smaller one downloads faster
              and takes up less room. Either way you are getting something Threads itself served, never an upscaled
              copy.
            </p>
            <p>
              One thing worth knowing: a downloader can&apos;t add detail that was never in the video. If a clip was
              recorded in 720p and uploaded that way, 720p is what exists. The preview and the size on the result card
              give you a good idea of what you&apos;re about to save.
            </p>

            <h2>What kinds of videos work</h2>
            <p>
              Anything attached directly to a public Threads post: clips recorded in the app, videos reposted from
              other places, and videos inside public replies. What it can&apos;t do is pull a video out of a linked
              article, an embedded YouTube player or any other site. If the post only contains a link to that content,
              there is no video attached to the post itself.
            </p>
            <p>
              Reposts are treated like originals. If the repost is public and the video is still online, it downloads
              the same way. If you want a photo or a looping clip instead, the{' '}
              <Link href="/threads-image-downloader/">image downloader</Link> and the{' '}
              <Link href="/threads-gif-downloader/">GIF downloader</Link> use the same box.
            </p>

            <h2>Downloader or screen recording?</h2>
            <p>
              Screen-recording is what most people try first, and it works in a pinch. But you end up with a
              re-encoded copy at your screen&apos;s resolution, with whatever notification popped up mid-clip, the app
              controls in the corner and a lower frame rate if your phone was busy. A downloader takes the actual file
              Threads stored, so the quality is the clip&apos;s own, with nothing else on screen.
            </p>

            <h2>Tips for smoother downloads</h2>
            <ul>
              {TIPS.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p>
              New to this? The <Link href="/how-to-download-threads-videos/">step-by-step guide</Link> walks through
              copying the link, and there are device-specific notes for{' '}
              <Link href="/threads-video-downloader-iphone/">iPhone</Link> and{' '}
              <Link href="/threads-video-downloader-android/">Android</Link>.
            </p>
          </div>
        </div>
      </section>

      <VideoDownloaderMore />

      <FaqSection items={FULL_FAQ.slice(0, 5)} title="Video downloader FAQ" />
    </>
  );
}
