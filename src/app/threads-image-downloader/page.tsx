import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolHero } from '@/components/ToolHero';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FaqSection } from '@/components/FaqSection';
import { IMAGE_FAQ } from '@/content/faq';
import { pageMetadata } from '@/lib/seo';
import { ImageDownloaderMore } from '@/content/more/ImageDownloaderMore';

const PATH = '/threads-image-downloader/';

export const metadata: Metadata = pageMetadata({
  title: 'Threads Image Downloader – Save Photos in Full Size',
  description:
    'Save photos from public Threads posts at the size Threads stores them. Paste the post link, preview the picture and download it for free.',
  path: PATH,
});

const REASONS = [
  { t: 'A personal archive', d: 'Keep photos from accounts you follow before a post is edited or deleted.' },
  { t: 'Offline reference', d: 'Save an infographic, a schedule or an announcement so you can read it without a connection.' },
  { t: 'Moodboards and inspiration', d: 'Collect design, fashion or art references that were shared publicly, for your own projects.' },
  { t: 'Sharing with credit', d: 'Keep a copy to discuss or send to a friend, and give the original poster proper credit.' },
];

export default function ThreadsImageDownloaderPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Image Downloader', href: PATH }]} />

      <ToolHero
        title="Threads Image Downloader"
        highlight="Image Downloader"
        description="Save photos from public Threads posts at the size Threads stores them. The tool spots photos, videos and GIFs on its own."
        ctaLabel="Download Image"
        placeholder="Paste Threads post URL here"
      />

      <section className="container-app py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="section-title">Saving photos from Threads</h2>
          <div className="prose-content mt-2">
            <p>
              Paste the link to a public post, and if it carries a photo you will see it in the preview with a button to
              save it as a JPG. It is the same picture you would see if you tapped the photo open in the app, with nothing
              cropped, filtered or watermarked along the way.
            </p>

            <h3>Posts with several photos</h3>
            <p>
              Some posts hold a small set of pictures. When a post exposes more than one image, each one is offered as its
              own download instead of being squashed into a single file, so you can keep just the ones you want.
            </p>

            <h3>Saving on a phone</h3>
            <p>
              On Android the picture goes to your Downloads folder and normally shows up in the Gallery shortly after. On
              iPhone, Safari puts it in the Files app, and you can send it to Photos with Share, then Save Image. The{' '}
              <Link href="/threads-video-downloader-iphone/">iPhone</Link> and{' '}
              <Link href="/threads-video-downloader-android/">Android</Link> guides show where to look.
            </p>

            <h2>A word about image quality</h2>
            <p>
              Every service that hosts photos, Threads included, compresses them so pages load quickly. That is normal
              everywhere on the web. What you download is that stored version. We can&apos;t bring back detail that
              compression already removed, and we won&apos;t apply fake upscaling or sharpening to make it look bigger
              than it is.
            </p>
            <p>
              In practice the saved photo looks just like it does in Threads: same pixels, same file, nothing added and
              nothing taken away. If you need a higher-quality original, the best route is to ask the person who posted
              it.
            </p>
          </div>
        </div>
      </section>

      <section className="container-app py-8 sm:py-12">
        <div className="max-w-2xl">
          <p className="eyebrow">Why people save photos</p>
          <h2 className="section-title">Common reasons to keep a copy.</h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {REASONS.map((r) => (
            <div key={r.t} className="bento">
              <h3 className="text-lg font-bold tracking-tight text-ink">{r.t}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-2">{r.d}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-ink-3">
          Whatever the reason, the photo still belongs to whoever took it. Our{' '}
          <Link href="/disclaimer/" className="font-semibold text-accent-lo underline underline-offset-2">
            disclaimer
          </Link>{' '}
          explains what responsible use looks like.
        </p>
      </section>

      <ImageDownloaderMore />

      <FaqSection items={IMAGE_FAQ} title="Image downloader FAQ" />
    </>
  );
}
