import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolHero } from '@/components/ToolHero';
import { FaqSection } from '@/components/FaqSection';
import { JsonLd } from '@/components/JsonLd';
import { HOME_FAQ } from '@/content/faq';
import { pageMetadata } from '@/lib/seo';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Threads Video Downloader – Download Threads Videos Online',
  description:
    'Download publicly accessible Threads videos online in high quality. Fast, simple and free Threads video downloader.',
  path: '/',
});

const softwareAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Threads Video Downloader',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any (Web browser)',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  url: absoluteUrl('/'),
};

/* ------------------------------------------------------------------ */
/* Copy lives in plain arrays so apostrophes need no JSX escaping.     */
/* ------------------------------------------------------------------ */

const FACTS = [
  { title: 'Public posts', text: 'Anything you can open without signing in to Threads.' },
  { title: 'The original file', text: 'The same MP4 Threads plays, with no re-encoding on top.' },
  { title: 'No watermark', text: 'We never stamp anything onto your video or photo.' },
  { title: 'Nothing kept', text: "Downloads pass straight through to you. We don't store them." },
];

const STEPS = [
  {
    n: '01',
    title: 'Copy the link',
    text: 'In the Threads app, tap the share arrow under a public post and choose Copy link. On a computer, copy the address from the top of your browser.',
  },
  {
    n: '02',
    title: 'Paste it above',
    text: "Drop it into the box and press Download Video. We check that it's a real Threads link before doing anything else.",
  },
  {
    n: '03',
    title: 'Save the file',
    text: "You'll get a preview first. If it looks right, tap the download button and the file goes to your downloads folder.",
  },
];

const KINDS = [
  {
    title: 'Videos',
    format: 'MP4',
    href: '/threads-video-downloader/',
    text: "Native clips and reposted videos from public posts. Vertical, square or widescreen, you get it exactly as it was posted.",
    tone: 'from-accent to-[#7a45f0]',
  },
  {
    title: 'Photos',
    format: 'JPG',
    href: '/threads-image-downloader/',
    text: 'Single photos and multi-photo posts, saved at the size Threads itself stores them. Nothing upscaled, nothing sharpened.',
    tone: 'from-[#db2777] to-[#f97316]',
  },
  {
    title: 'GIFs & loops',
    format: 'GIF / MP4',
    href: '/threads-gif-downloader/',
    text: "You'll get a real .gif when the post has one. Most looping clips are short videos underneath, and those come as a looping MP4.",
    tone: 'from-[#0891b2] to-accent',
  },
];

const DEVICES = [
  {
    title: 'iPhone & iPad',
    href: '/threads-video-downloader-iphone/',
    text: 'Copy the link in Threads, paste it in Safari, download. The file lands in the Files app under Downloads. Open it and tap Share, then Save Video, to put it in Photos.',
  },
  {
    title: 'Android',
    href: '/threads-video-downloader-android/',
    text: 'Chrome and Samsung Internet both work. The file goes to your Downloads folder and usually appears in the Gallery or Files app within a moment.',
  },
  {
    title: 'Computer',
    href: '/how-to-download-threads-videos/',
    text: 'Paste, press the button, and the MP4 saves wherever your browser keeps downloads. Current versions of Chrome, Edge, Firefox and Safari all work.',
  },
];

const WILL = [
  'Work with posts anyone can open without signing in.',
  'Hand you the file Threads serves, untouched.',
  "Say plainly when something can't be saved, and why.",
  "Keep nothing. Your downloads aren't stored on our side.",
];
const WONT = [
  'Touch private accounts or anything behind a login.',
  'Ask for your Threads password, cookies or tokens.',
  'Add watermarks or hide fake download buttons on the page.',
  "Pretend to work on every single post. Some won't, and we'd rather tell you.",
];

const LINK_TYPES = [
  'The address of a post on threads.net or threads.com (it looks like …/@name/post/ABC123).',
  'The link the Threads app gives you when you tap Copy link. These often look like threads.com/share/…',
  'Short links that start with threads.net/t/.',
];

const FAIL_REASONS = [
  'the account is private, so only approved followers can see the post (and so can’t we)',
  'the post was deleted',
  'the post is text only, with no video, photo or GIF attached',
  'the link got cut off when it was copied',
  'Threads changed how it serves media and we’re a step behind',
];

/* ------------------------------------------------------------------ */

function Icon({ name }: { name: 'phone' | 'file' | 'image' | 'alert' | 'shield' | 'bolt' }) {
  const paths: Record<string, string> = {
    phone: 'M8 3h8a1.5 1.5 0 0 1 1.5 1.5v15A1.5 1.5 0 0 1 16 21H8a1.5 1.5 0 0 1-1.5-1.5v-15A1.5 1.5 0 0 1 8 3Zm3 15h2',
    file: 'M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm7 0v4h4M9.5 13.5l2 2 3.5-4',
    image: 'M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5v-11Zm0 9 4.5-4.5 4 4 2.5-2.5 5 5M9 9.5h.01',
    alert: 'M12 4 3.5 19h17L12 4Zm0 6v4m0 3h.01',
    shield: 'M12 3 5 6v5.5c0 4.2 2.9 7.6 7 9.5 4.1-1.9 7-5.3 7-9.5V6l-7-3Zm-2.5 9 2 2 3.5-4',
    bolt: 'M13 3 5 13.5h6L10 21l8-10.5h-6L13 3Z',
  };
  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/15 to-[#db2777]/15 text-accent-lo ring-1 ring-accent/15">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d={paths[name]} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Tick({ tone }: { tone: 'yes' | 'no' }) {
  return tone === 'yes' ? (
    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  ) : (
    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-rose-400/20 text-rose-300">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="transition-transform group-hover:translate-x-1">
      <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={softwareAppJsonLd} />

      <ToolHero
        title="Threads Video Downloader"
        highlight="Video Downloader"
        description="Download publicly accessible Threads videos online in high quality. Fast, simple and free."
        size="large"
        panelClassName="mt-10 max-w-2xl"
        footer={
          <div className="flex flex-col items-center gap-5">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-ink-2">
              {['Works on iPhone, Android & desktop', 'MP4, JPG & GIF files', 'Nothing to install'].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-emerald-500">
                    <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {t}
                </li>
              ))}
            </ul>
            <Link href="/how-to-download-threads-videos/" className="group inline-flex items-center gap-1.5 text-sm font-bold text-accent-lo">
              How it works
              <Arrow />
            </Link>
          </div>
        }
      />

      {/* Facts strip */}
      <section aria-label="At a glance" className="border-y border-line bg-white">
        <div className="container-app grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          {FACTS.map((f) => (
            <div key={f.title} className="px-1 py-6 sm:px-6">
              <p className="text-sm font-extrabold tracking-tight text-ink">{f.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-2">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="container-app py-20 sm:py-28">
        <div className="max-w-2xl">
          <p className="eyebrow">How it works</p>
          <h2 className="section-title">Three steps, and one of them is just copying.</h2>
          <p className="section-lead">
            There&apos;s no account to make and nothing to install. If you can share a post, you can save its video.
          </p>
        </div>
        <ol className="relative mt-12 grid gap-5 md:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n} className="bento">
              <span className="gradient-text text-5xl font-extrabold tracking-tighter">{s.n}</span>
              <h3 className="mt-5 text-xl font-bold tracking-tight text-ink">{s.title}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-2">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Bento: why it feels different */}
      <section className="bg-gradient-to-b from-transparent via-white to-transparent py-4">
        <div className="container-app py-16 sm:py-24">
          <div className="max-w-2xl">
            <p className="eyebrow">Why people stick with it</p>
            <h2 className="section-title">Made for the way you actually save things.</h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-6">
            <div className="bento md:col-span-4">
              <Icon name="phone" />
              <h3 className="mt-5 text-xl font-bold tracking-tight text-ink">Built for a thumb, not a mouse</h3>
              <p className="mt-2.5 max-w-xl text-[15px] leading-relaxed text-ink-2">
                Most people save Threads videos on their phone, so the whole page is designed around one hand: a big
                paste button, a big download button, no tiny links to miss. On a desktop it&apos;s the same two moves.
              </p>
            </div>
            <div className="bento md:col-span-2">
              <Icon name="file" />
              <h3 className="mt-5 text-xl font-bold tracking-tight text-ink">The real file</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-2">
                You get the MP4 Threads plays, not a screen recording of it.
              </p>
            </div>
            <div className="bento md:col-span-2">
              <Icon name="image" />
              <h3 className="mt-5 text-xl font-bold tracking-tight text-ink">Photos and loops too</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-2">
                Paste any public post. If it&apos;s a photo or a looping clip, that&apos;s what you&apos;ll get.
              </p>
            </div>
            <div className="bento md:col-span-2">
              <Icon name="alert" />
              <h3 className="mt-5 text-xl font-bold tracking-tight text-ink">Clear when it can&apos;t help</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-2">
                Private account or deleted post? You&apos;ll get a plain message, not a spinner that never ends.
              </p>
            </div>
            <div className="bento md:col-span-2">
              <Icon name="shield" />
              <h3 className="mt-5 text-xl font-bold tracking-tight text-ink">Your account stays yours</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-2">
                We never ask for a password, a cookie or a token. Nothing on this site needs them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Kinds of posts */}
      <section className="container-app py-16 sm:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow">What you can save</p>
          <h2 className="section-title">One box, three kinds of post.</h2>
          <p className="section-lead">
            The tool looks at what the post actually contains and gives you the right file, so you never have to choose
            a mode first.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {KINDS.map((k) => (
            <Link key={k.title} href={k.href} className="group bento flex flex-col !p-0">
              <div className={`h-2 w-full bg-gradient-to-r ${k.tone}`} />
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-extrabold tracking-tight text-ink">{k.title}</h3>
                  <span className="rounded-full bg-brand-soft px-3 py-1 text-[11px] font-bold tracking-wide text-ink-2">{k.format}</span>
                </div>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-2">{k.text}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-accent-lo">
                  Open the {k.title.toLowerCase().split(' ')[0]} downloader
                  <Arrow />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Devices */}
      <section className="container-app pb-16 sm:pb-24">
        <div className="max-w-2xl">
          <p className="eyebrow">Wherever you scroll</p>
          <h2 className="section-title">Same two steps on every device.</h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {DEVICES.map((d) => (
            <Link key={d.title} href={d.href} className="group bento">
              <h3 className="text-xl font-bold tracking-tight text-ink">{d.title}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-2">{d.text}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-accent-lo">
                Step-by-step guide
                <Arrow />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Honest limits (dark) */}
      <section className="relative isolate overflow-hidden bg-[#0b0b12] py-20 text-white sm:py-28">
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 -z-10 h-96 w-96 rounded-full bg-accent/30 blur-[110px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-32 -z-10 h-96 w-96 rounded-full bg-[#db2777]/20 blur-[110px]" />
        <div className="container-app">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-hi">Where we draw the line</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">What we do, and what we won&apos;t.</h2>
            <p className="mt-4 text-base leading-relaxed text-white/65 sm:text-lg">
              A downloader is only worth using if you can trust it. So here it is, plainly.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className="rounded-xl3 border border-white/10 bg-white/[0.04] p-6 backdrop-blur sm:p-8">
              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-300">We will</h3>
              <ul className="mt-5 space-y-4">
                {WILL.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[15px] leading-relaxed text-white/80">
                    <Tick tone="yes" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl3 border border-white/10 bg-white/[0.04] p-6 backdrop-blur sm:p-8">
              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-rose-300">We won&apos;t</h3>
              <ul className="mt-5 space-y-4">
                {WONT.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[15px] leading-relaxed text-white/80">
                    <Tick tone="no" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The guide: long-form, written to be read */}
      <section className="container-app py-20 sm:py-28">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow">The short guide</p>
          <h2 className="section-title">A plain-English guide to saving Threads videos.</h2>
          <div className="prose-content mt-2">
            <p>
              Threads is full of clips worth keeping: a goal replay someone posted at midnight, a recipe you&apos;ll want
              when you&apos;re actually standing in the kitchen, a ten-second explanation that does a better job than the
              ten-minute one. The app lets you like, repost and share them. What it doesn&apos;t give you is a button to
              keep a copy. That gap is the whole reason a Threads video downloader exists.
            </p>

            <h3>What a Threads video downloader actually does</h3>
            <p>
              There&apos;s no trick to it. When you paste a link, we open the same public page anyone could open in a
              browser, find the video attached to that post, and hand it back to you as a normal MP4. It&apos;s the file
              Threads itself uses to play the clip, so the picture and sound are what you saw, with no extra compression
              layered on top and no watermark across the corner.
            </p>
            <p>
              If the post turns out to be a photo or a looping GIF instead, the tool tells you that and gives you that
              file. You don&apos;t have to know in advance.
            </p>

            <h3>Why a screen recording is the worse option</h3>
            <p>
              A screen recording captures your screen, not the video. You get whatever resolution your phone happened to
              be showing, the notification that dropped in halfway through, the interface controls sitting in the corner,
              and a file that&apos;s been compressed a second time. For a quick reference that&apos;s fine. If you want to
              keep the clip, take the real file.
            </p>

            <h3>Which links work</h3>
            <ul>
              {LINK_TYPES.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p>
              Anything else (a profile page, a search result, a link from another site) isn&apos;t a single post, so there
              is nothing for us to fetch. If you&apos;re not sure, open the link in your browser first. If you can see the
              post without logging in, we can usually work with it.
            </p>

            <h3>When a download doesn&apos;t work</h3>
            <p>It happens, and it&apos;s nearly always one of these:</p>
            <ul>
              {FAIL_REASONS.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p>
              Check the link, wait a few minutes and try once more. If a public video still won&apos;t load, tell us
              through the <Link href="/contact/">contact page</Link>. Those reports are how problems get found and fixed.
            </p>

            <h2>A note on respect</h2>
            <p>
              Every video on Threads belongs to the person who made it. Saving a clip to rewatch on a flight or to show a
              friend is one thing. Re-uploading someone else&apos;s work as your own, or using it commercially without
              asking, is something else, and that responsibility sits with you. When in doubt, ask the creator or give
              them clear credit. If you&apos;re a creator with a concern, the <Link href="/dmca/">DMCA page</Link>{' '}
              explains how to reach us, and the <Link href="/disclaimer/">disclaimer</Link> covers where we stand.
            </p>
          </div>
        </div>
      </section>

      <FaqSection items={HOME_FAQ} title="Questions people ask before they paste" />

      {/* Closing call to action */}
      <section className="container-app pb-20 sm:pb-28">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#14102e] via-[#1b1545] to-[#2a1250] px-6 py-14 text-center text-white sm:px-12 sm:py-20">
          <div aria-hidden="true" className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-64 w-[34rem] -translate-x-1/2 rounded-full bg-accent/40 blur-[90px]" />
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight sm:text-5xl">Got a link? Let&apos;s get it saved.</h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
            Copy it from Threads, paste it at the top of the page, and you&apos;re about ten seconds from a file on your
            device.
          </p>
          <a href="#downloader" className="btn mt-8 bg-white px-8 py-4 text-base text-ink shadow-glow hover:-translate-y-0.5">
            Paste a link
          </a>
        </div>
      </section>
    </>
  );
}
