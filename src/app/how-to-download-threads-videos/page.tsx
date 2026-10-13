import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { PageHero } from '@/components/PageHero';
import { pageMetadata } from '@/lib/seo';

const PATH = '/how-to-download-threads-videos/';

export const metadata: Metadata = pageMetadata({
  title: 'How to Download Threads Videos (Step-by-Step Guide)',
  description:
    'A friendly walkthrough: find the post link in Threads, paste it, preview the clip and save the MP4. Covers iPhone, Android and desktop.',
  path: PATH,
});

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Download a Threads Video',
  step: [
    { '@type': 'HowToStep', name: 'Find the post', text: 'Open the public Threads post that contains the video you want to save.' },
    { '@type': 'HowToStep', name: 'Copy the link', text: 'Tap the share icon under the post and choose "Copy link".' },
    { '@type': 'HowToStep', name: 'Paste the URL', text: 'Paste the link into the Threads Video Downloader input field and press Download Video.' },
    { '@type': 'HowToStep', name: 'Save the file', text: 'Check the preview, then press the download button to save the MP4 to your device.' },
  ],
};

const STEPS = [
  {
    title: 'Find the post',
    body: [
      'Open the Threads app, or threads.com in a browser, and go to the post with the video. It needs to be a public post. A quick test: if you can watch it in a private or incognito browser tab without signing in, it is public.',
      'Videos inside replies count too. Open the reply on its own so you are looking at that one post.',
    ],
  },
  {
    title: 'Copy the post link',
    body: [
      'Tap the share arrow (or the three dots) under the post and choose Copy link. On a computer you can also just copy the address from the top of the browser while the post is open.',
      'What you copy will look like one of these:',
    ],
    code: ['https://www.threads.com/@username/post/ABC123xyz', 'https://www.threads.com/share/…', 'https://www.threads.net/t/ABC123xyz'],
  },
  {
    title: 'Paste it into the downloader',
    body: [
      'Go back to the box at the top of the page (or open the video downloader), paste the link and press Download Video. Tapping Paste inside the box does the same thing in one tap, if your browser allows clipboard access.',
      'A few seconds later you will see a preview with the caption, the file format and the file size.',
    ],
  },
  {
    title: 'Save the file',
    body: [
      'If the preview is the clip you wanted, press the download button. The file goes to your usual downloads location. If it did not seem to start, check your browser’s downloads list, or your phone’s Files app.',
      'That is it. The same two moves work for photos and GIFs, and the tool picks the right kind of file for you.',
    ],
  },
];

const MISTAKES = [
  {
    title: 'Copying the profile link instead of the post link',
    text: 'A link like threads.com/@username points at the whole profile. There is no single video to find there. Open the post first, then copy its link.',
  },
  {
    title: 'Pasting the caption instead of the URL',
    text: 'If you select the text of the post by accident, you will paste words, not a link. Use the share button instead and tap Copy link.',
  },
  {
    title: 'Trying a post from a private account',
    text: 'If you cannot open the post in a private browser tab, we cannot either. That is on purpose, and it is not something this tool will ever try to get around.',
  },
  {
    title: 'Assuming every post has a video',
    text: 'Text-only posts have nothing to extract. For photo posts, the image downloader is the right tool, and it uses the very same box.',
  },
];

const TIPS = [
  'On a phone, copy the link first and then switch to the browser. The Paste button in the box saves you a long-press.',
  'Wi-Fi is kinder to your data plan for long clips. The result card shows the file size before you commit.',
  'Want it in your camera roll? On iPhone, open the file in Files, tap Share and then Save Video. On Android it usually shows up in the Gallery by itself.',
  'If a link will not load, wait a minute and try again. Threads sometimes hiccups, and a second try often goes through.',
];

export default function HowToPage() {
  return (
    <>
      <JsonLd data={howToJsonLd} />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'How It Works', href: PATH }]} />

      <PageHero
        eyebrow="Step-by-step guide"
        title="How to Download Threads Videos"
        highlight="Download"
        description="From finding the link in the app to having the MP4 on your device. It takes about as long as reading this sentence twice."
      >
        <Link href="/threads-video-downloader/" className="btn-cta px-7 py-3.5">
          Open the downloader
        </Link>
      </PageHero>

      <section className="container-app py-10 sm:py-16">
        <ol className="relative mx-auto max-w-3xl space-y-6">
          {STEPS.map((step, i) => (
            <li key={step.title} className="bento flex gap-5 sm:gap-7">
              <span className="gradient-text w-12 flex-shrink-0 text-4xl font-extrabold tracking-tighter sm:text-5xl">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">{step.title}</h2>
                {step.body.map((p) => (
                  <p key={p} className="mt-3 text-[15px] leading-relaxed text-ink-2">
                    {p}
                  </p>
                ))}
                {step.code && (
                  <ul className="mt-3 space-y-2">
                    {step.code.map((c) => (
                      <li key={c} className="overflow-x-auto rounded-xl bg-[#0b0b12] px-4 py-2.5 font-mono text-xs text-white/85">
                        {c}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-app py-10 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="section-title">Where to find “Copy link”</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
            It lives in a slightly different spot depending on where you are using Threads.
          </p>
          <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white shadow-card">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-brand-soft text-ink-2">
                  <th className="px-5 py-3.5 font-semibold">Where</th>
                  <th className="px-5 py-3.5 font-semibold">How</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Computer (threads.com)', 'Hover the post, click the share icon, choose Copy link. Or copy the address bar.'],
                  ['iPhone app', 'Tap the share arrow under the post, then Copy link in the share sheet.'],
                  ['Android app', 'Tap the share icon under the post, then Copy link in the share menu.'],
                ].map(([where, how]) => (
                  <tr key={where} className="border-t border-line">
                    <td className="px-5 py-4 font-semibold text-ink">{where}</td>
                    <td className="px-5 py-4 text-ink-2">{how}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-ink-3">
            The mobile apps often copy a short <code className="rounded bg-brand-soft px-1.5 py-0.5 text-xs">/share/</code>{' '}
            or <code className="rounded bg-brand-soft px-1.5 py-0.5 text-xs">/t/</code> link instead of the full
            address. That&apos;s normal, and the downloader treats them all the same.
          </p>
        </div>
      </section>

      <section className="container-app py-10 sm:py-14">
        <div className="max-w-2xl">
          <p className="eyebrow">If something goes wrong</p>
          <h2 className="section-title">Four mistakes that break a download.</h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {MISTAKES.map((m) => (
            <div key={m.title} className="bento">
              <h3 className="text-lg font-bold tracking-tight text-ink">{m.title}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-2">{m.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-app py-10 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="section-title">Small things that help</h2>
          <div className="prose-content mt-2">
            <ul>
              {TIPS.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-app pb-20 pt-6 sm:pb-28">
        <div className="grid gap-5 md:grid-cols-2">
          <Link href="/threads-video-downloader-iphone/" className="group bento">
            <h3 className="text-xl font-bold tracking-tight text-ink">On iPhone</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-2">Where Safari puts the file, and how to get it into Photos.</p>
            <span className="mt-4 inline-block text-sm font-bold text-accent-lo transition-transform group-hover:translate-x-1">Read the iPhone guide &rarr;</span>
          </Link>
          <Link href="/threads-video-downloader-android/" className="group bento">
            <h3 className="text-xl font-bold tracking-tight text-ink">On Android</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-2">Which browsers behave best, and where your downloads end up.</p>
            <span className="mt-4 inline-block text-sm font-bold text-accent-lo transition-transform group-hover:translate-x-1">Read the Android guide &rarr;</span>
          </Link>
        </div>
      </section>
    </>
  );
}
