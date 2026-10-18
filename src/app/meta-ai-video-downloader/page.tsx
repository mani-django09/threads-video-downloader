import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolHero } from '@/components/ToolHero';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FaqSection, type FaqItem } from '@/components/FaqSection';
import { CardSection, Callout, Section, Table } from '@/components/ContentKit';
import { pageMetadata } from '@/lib/seo';

const PATH = '/meta-ai-video-downloader/';

export const metadata: Metadata = pageMetadata({
  title: 'Meta AI Video Downloader: What Works on Threads',
  description:
    'Save AI-generated videos that were posted publicly on Threads as MP4. A straight answer on what this tool can and cannot save from Meta AI, Vibes, Instagram and Facebook.',
  path: PATH,
});

const SUPPORT = [
  ['A public Threads post that contains an AI-generated video', 'Yes', 'Paste the post link. It is an ordinary video file once it is on Threads, however it was made.'],
  ['A Meta AI or Vibes video shared as a public Threads post', 'Yes', 'Works the same, as long as the post is public and the video is attached to it.'],
  ['A link from the Meta AI app or the Vibes feed itself', 'No', 'This tool only reads Threads posts. Those links are not Threads links.'],
  ['A Meta AI video posted to Instagram or Facebook', 'No', 'Instagram and Facebook posts are not supported here, only Threads.'],
  ['A private or restricted Threads post', 'No', 'Private stays private. The tool never logs in.'],
];

const FAQ: FaqItem[] = [
  {
    question: 'Can I download videos from the Meta AI app or the Vibes feed with this tool?',
    answer:
      'No. This tool reads public Threads posts only. A link from the Meta AI app, the Vibes feed, Instagram or Facebook is not a Threads link, so it is not supported. If the same video was also shared as a public Threads post, paste that Threads link instead.',
  },
  {
    question: 'Does it work on AI-generated videos posted on Threads?',
    answer:
      'Yes. Once a video is attached to a public Threads post it is a normal video file, whether it came from Meta AI or any other generator. The tool saves it as an MP4.',
  },
  {
    question: 'Does the tool remove AI labels or watermarks?',
    answer:
      'No, and it never will. We save the file exactly as Threads serves it. Please do not remove labels or marks to pass an AI video off as real footage.',
  },
  {
    question: 'How can I tell whether a Threads video is AI-generated?',
    answer:
      'Look for an AI label on the post, check the account and its other posts, and treat unusually smooth motion, garbled text or odd hands and objects as warning signs. Labels are not guaranteed on every post, so no single sign is proof.',
  },
  {
    question: 'Can I reuse an AI-generated video I saved?',
    answer:
      'Not automatically. Whoever made it, and the platform’s terms, decide what you may do with it, and the copyright status of AI-generated output is still unsettled in many countries. Ask the creator before you repost or use it commercially.',
  },
  {
    question: 'Is it free?',
    answer: 'Yes, and you do not need an account or a login.',
  },
];

export default function MetaAiVideoDownloaderPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Meta AI Video Downloader', href: PATH }]} />

      <ToolHero
        title="Meta AI Video Downloader"
        highlight="Video Downloader"
        description="Save AI-generated videos from public Threads posts as MP4. This works on Threads links only; the table below shows exactly what is and is not supported."
      />

      <Section eyebrow="Read this first" title="What this page can and cannot do">
        <p>
          Searching for a &ldquo;Meta AI video downloader&rdquo; usually means one of two things, and it matters which. We would rather tell you now than waste your time.
        </p>
        <Table caption="What the tool supports for Meta AI style videos" head={['The video is…', 'Supported?', 'Why']} rows={SUPPORT} />
        <Callout title="The plain version">
          <p>
            This is a <strong>Threads</strong> downloader. If an AI-generated video lives on a public Threads post, it will save. If it only exists inside the Meta AI app, the Vibes
            feed, Instagram or Facebook, this tool cannot reach it, and we do not pretend otherwise.
          </p>
        </Callout>
      </Section>

      <Section eyebrow="Background" title="Where Meta AI videos show up">
        <p>
          Meta has been adding AI video creation to its apps. In September 2025 it introduced <strong>Vibes</strong>, a feed of short AI-generated videos in the Meta AI app, where
          people can generate, remix and share clips. According to{' '}
          <a href="https://about.fb.com/news/2025/09/introducing-vibes-ai-videos/" rel="noopener noreferrer" target="_blank">
            Meta&apos;s own announcement
          </a>
          , clips can be posted to the Vibes feed, sent in direct messages, or cross-posted to Instagram and Facebook Stories and Reels.
        </p>
        <p>
          Threads is a separate app, and the announcement does not list it as a destination. That does not stop anyone from saving an AI clip and posting the file to Threads like
          any other video, which is the case this tool covers. Product details change often, so check Meta&apos;s current help pages for the latest on where each kind of clip can be
          shared.
        </p>
      </Section>

      <Section eyebrow="How to use it" title="Saving an AI-generated video from Threads">
        <ol>
          <li>In the Threads app, open the post and tap the share arrow, then <strong>Copy link</strong>.</li>
          <li>Paste the link into the box at the top of this page and press the button.</li>
          <li>Check the preview, then save the MP4. It lands in your Downloads (Android and desktop) or the Files app (iPhone).</li>
        </ol>
        <p>
          If the tool says the post has no downloadable media, the video may be a link preview to another site rather than a file on the post. The{' '}
          <Link href="/threads-video-download/">troubleshooting page</Link> explains each message.
        </p>
      </Section>

      <Section eyebrow="Before you share it" title="Telling real footage from AI footage">
        <p>
          AI video is now good enough to fool people at a glance, which is why a downloaded clip needs a second look before you pass it on. A short routine helps:
        </p>
        <ul>
          <li>
            <strong>Check for a label.</strong> Meta marks some AI content, but not every post carries one, so a missing label proves nothing.
          </li>
          <li>
            <strong>Look at the account.</strong> A page that posts only dramatic, perfect-looking clips with no ordinary life around them deserves suspicion.
          </li>
          <li>
            <strong>Look closely at the details.</strong> Hands, teeth, reflections, background text and objects that change shape between frames are where generators slip.
          </li>
          <li>
            <strong>Ask where it happened.</strong> Real events usually have more than one angle, a location and a date. A single flawless clip with none of those is a red flag.
          </li>
          <li>
            <strong>Search for the source.</strong> A reverse image search of a frame often leads to the original or to a debunk.
          </li>
        </ul>
      </Section>

      <CardSection
        eyebrow="Responsible use"
        title="Four rules for AI videos you save."
        items={[
          { title: 'Never pass it off as real', text: 'If you share an AI clip, say it is AI. Removing a label or presenting generated footage as an actual event can mislead people and may break the law.' },
          { title: 'Do not target real people', text: 'AI videos that show a real person doing or saying something they did not are harmful, whatever the intent. Do not save or spread them.' },
          { title: 'Ask before you reuse', text: 'The creator and the platform’s terms decide what you can do with a clip. Copyright status of AI output is unsettled, so permission is the safe route.' },
          { title: 'Keep it for yourself by default', text: 'Watching offline or studying how the clip was made is the ordinary case. Publishing it is a separate decision.' },
        ]}
        footnote={
          <>
            Our <Link href="/terms-of-service/" className="font-semibold text-accent-lo underline underline-offset-2">terms</Link> and{' '}
            <Link href="/dmca/" className="font-semibold text-accent-lo underline underline-offset-2">copyright policy</Link> set out our position, and the{' '}
            <Link href="/disclaimer/" className="font-semibold text-accent-lo underline underline-offset-2">disclaimer</Link> explains that we are not affiliated with Meta.
          </>
        }
      />

      <Section eyebrow="Related" title="Keep reading">
        <ul>
          <li>
            <Link href="/threads-video-downloader/">Threads video downloader</Link>: quality, file size and sharing.
          </li>
          <li>
            <Link href="/threads-to-mp4/">Threads to MP4</Link>: what the file is, and how to make an MP3, GIF or smaller copy.
          </li>
          <li>
            <Link href="/how-to-download-threads-videos/">Step-by-step guide</Link> to copying the link and saving the file.
          </li>
        </ul>
      </Section>

      <FaqSection items={FAQ} title="Meta AI video FAQ" />
    </>
  );
}
