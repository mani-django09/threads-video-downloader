import type { Metadata } from 'next';
import { ToolHero } from '@/components/ToolHero';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FaqSection } from '@/components/FaqSection';
import { GIF_FAQ } from '@/content/faq';
import { pageMetadata } from '@/lib/seo';
import { GifDownloaderMore } from '@/content/more/GifDownloaderMore';

const PATH = '/threads-gif-downloader/';

export const metadata: Metadata = pageMetadata({
  title: 'Threads GIF Downloader – Save Looping Clips Online',
  description:
    'Save looping GIF-style clips from public Threads posts, as a real GIF when the post has one or as a looping MP4. Free, nothing to install.',
  path: PATH,
});

const FORMATS = [
  {
    name: 'Animated GIF',
    what: 'A true frame-by-frame image loop. No sound, and a limited colour palette.',
    size: 'Large for its length',
  },
  {
    name: 'Looping MP4',
    what: 'A short video set to repeat. Full colour, and it can carry sound.',
    size: 'Much smaller for the same quality',
  },
  {
    name: 'Boomerang-style clip',
    what: 'A short video that plays forward then backward, delivered as an MP4.',
    size: 'Small, like a looping MP4',
  },
];

const USES = [
  'Dropping it into a group chat or messaging app that does not preview Threads links.',
  'Putting it on a slide in a presentation.',
  'Keeping a reaction clip you can reuse later.',
  'Saving a loop that is about to disappear when a post is deleted.',
];

export default function ThreadsGifDownloaderPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'GIF Downloader', href: PATH }]} />

      <ToolHero
        title="Threads GIF Downloader"
        highlight="GIF Downloader"
        description="Save short, looping clips from public Threads posts. Paste the link and the tool works out what kind of file it is."
        ctaLabel="Download GIF"
        placeholder="Paste Threads post URL here"
      />

      <section className="container-app py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="section-title">GIF or looping video? Here&apos;s the honest answer.</h2>
          <div className="prose-content mt-2">
            <p>
              Most of the little loops you see on Threads, the ones that repeat a few seconds of motion, are not really
              GIF files. They are short videos set to loop, because video compresses far better than the old GIF format
              and looks nicer while doing it.
            </p>
            <p>
              So the tool does the sensible thing. When a post carries a genuine <strong>.gif</strong>, you get that file
              exactly as it is. When the &ldquo;GIF&rdquo; is a looping video underneath, you get an{' '}
              <strong>MP4</strong> that loops the same way in any player or app. Nothing is converted or watermarked
              either way.
            </p>
          </div>
        </div>
      </section>

      <section className="container-app py-8 sm:py-12">
        <div className="max-w-2xl">
          <p className="eyebrow">Loop formats compared</p>
          <h2 className="section-title">Three kinds of &ldquo;looping clip&rdquo;.</h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {FORMATS.map((f) => (
            <div key={f.name} className="bento">
              <h3 className="text-lg font-bold tracking-tight text-ink">{f.name}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-2">{f.what}</p>
              <p className="mt-4 inline-block rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-ink-2">{f.size}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-ink-3">
          That is exactly why most apps, Threads included, moved away from true GIFs for anything longer than a couple of
          seconds. The video-based versions look better and take up a fraction of the space.
        </p>
      </section>

      <section className="container-app py-10 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="section-title">What people do with saved loops</h2>
          <div className="prose-content mt-2">
            <ul>
              {USES.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          </div>
          <div className="prose-content">
            <p>
              Because you end up with a real MP4 or GIF file instead of a link, it works in any app that accepts a normal
              video or image attachment. The person on the receiving end does not need Threads at all.
            </p>
          </div>
        </div>
      </section>

      <GifDownloaderMore />

      <FaqSection items={GIF_FAQ} title="GIF downloader FAQ" />
    </>
  );
}
