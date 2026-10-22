import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolHero } from '@/components/ToolHero';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FaqSection, type FaqItem } from '@/components/FaqSection';
import { CardSection, Callout, Section, Table } from '@/components/ContentKit';
import { pageMetadata } from '@/lib/seo';

const PATH = '/threads-to-mp3/';

export const metadata: Metadata = pageMetadata({
  title: 'Threads to MP3 – Get Audio from Threads Videos',
  description:
    'Save a public Threads video, then pull the audio out as an MP3 on your phone or computer. Free, no account, with step-by-step instructions for VLC, ffmpeg and mobile apps.',
  path: PATH,
});

const METHODS = [
  ['VLC (Windows, Mac, Linux)', 'Media, then Convert/Save, pick the MP3 profile', 'Free, point and click'],
  ['ffmpeg (any computer)', 'One command, shown below', 'Fastest, best quality control'],
  ['Phone video-to-audio apps', 'Open the MP4 and choose Extract audio', 'Easy on iPhone and Android'],
  ['Editors (CapCut, iMovie)', 'Import the clip and export audio only', 'Handy if you are trimming too'],
];

const FAQ: FaqItem[] = [
  {
    question: 'Does this tool give me an MP3 directly?',
    answer:
      'Not yet. It saves the video from a public Threads post as an MP4 file. The audio is inside that file, and you can turn it into an MP3 with free software on your own device. The steps are on this page.',
  },
  {
    question: 'Will the MP3 sound as good as the video?',
    answer:
      'The audio in a Threads video is already compressed (AAC). Making an MP3 from it re-encodes the sound once more, so use a high setting such as VBR quality 2 or 192 kbps and the difference is hard to hear.',
  },
  {
    question: 'Can I get audio from a private Threads post?',
    answer: 'No. Only public posts that anyone can open without signing in are supported.',
  },
  {
    question: 'Is it legal to save the audio from a video?',
    answer:
      'Saving for personal listening is usually fine, but the audio still belongs to its creator, and music in a clip may be licensed. Do not reuse or repost it without permission.',
  },
  {
    question: 'Do I need an account or an app?',
    answer: 'No. The download works in your browser with no sign-up. Extracting audio uses free software you may already have, like VLC.',
  },
];

export default function ThreadsToMp3Page() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Threads to MP3', href: PATH }]} />

      <ToolHero
        title="Threads to MP3"
        highlight="MP3"
        description="Save a public Threads video, then pull the audio out as an MP3. Step one is below, step two is on this page."
      />

      <Section eyebrow="How it works" title="Threads to MP3 in three steps">
        <ol>
          <li>
            <strong>Copy the post link</strong> from a public Threads post and paste it into the box above.
          </li>
          <li>
            <strong>Press Download</strong> and save the video. It is an MP4 and the sound is inside it.
          </li>
          <li>
            <strong>Extract the audio</strong> with VLC, ffmpeg or a phone app, using the methods below.
          </li>
        </ol>
        <Callout title="Why two steps?">
          <p>
            This site saves the original file Threads serves, untouched. Turning that into an MP3 is a separate job where you choose the quality, so it happens on your
            device instead of on ours.
          </p>
        </Callout>
      </Section>

      <Section eyebrow="Pick a method" title="Ways to turn the MP4 into an MP3">
        <Table caption="Ways to extract MP3 audio from a Threads MP4" head={['Tool', 'What to do', 'Good for']} rows={METHODS} />

        <h3>VLC, step by step</h3>
        <ol>
          <li>Open VLC and choose Media, then Convert / Save.</li>
          <li>Add your MP4, then press Convert / Save.</li>
          <li>Set the profile to Audio - MP3, choose a destination file ending in .mp3, and press Start.</li>
        </ol>

        <h3>ffmpeg, one command</h3>
        <pre className="my-4 overflow-x-auto rounded-2xl border border-line bg-ink p-4 text-[13px] leading-relaxed text-white">
          <code>ffmpeg -i clip.mp4 -vn -c:a libmp3lame -q:a 2 clip.mp3</code>
        </pre>
        <p>
          <code>-vn</code> drops the picture and <code>-q:a 2</code> is a high-quality variable bitrate, around 190 kbps.
        </p>

        <h3>On a phone</h3>
        <p>
          Search your app store for a video-to-audio or MP3 converter, open the saved MP4 in it and export audio. On iPhone, the saved file is in Files, then Downloads. On
          Android it is in Downloads. See the <Link href="/threads-video-downloader-iphone/">iPhone</Link> and <Link href="/threads-video-downloader-android/">Android</Link>{' '}
          pages for where files go.
        </p>
      </Section>

      <CardSection
        eyebrow="Good to know"
        title="Before you extract audio."
        items={[
          { title: 'Quality is capped by the source', text: 'A quiet or noisy clip stays quiet or noisy. Converting to MP3 cannot add detail that was never recorded.' },
          { title: 'Keep the MP4', text: 'If you may want the picture later, keep the original and make the MP3 from a copy.' },
          { title: 'Music has owners', text: 'If a clip uses a licensed song, extracting it does not change who owns it. Personal listening is one thing, reuse is another.' },
          { title: 'Ask before you reuse', text: 'For podcasts, videos or ads, get the creator’s permission first.' },
        ]}
        footnote={
          <>
            Read our <Link href="/terms-of-service/" className="font-semibold text-accent-lo underline underline-offset-2">terms</Link> and{' '}
            <Link href="/disclaimer/" className="font-semibold text-accent-lo underline underline-offset-2">disclaimer</Link>.
          </>
        }
      />

      <Section eyebrow="Related" title="Other things you might need">
        <ul>
          <li>
            Want to keep the video or convert it to GIF or MOV? See <Link href="/threads-to-mp4/">Threads to MP4</Link>.
          </li>
          <li>
            Never done this before? Follow the <Link href="/how-to-download-threads-videos/">step-by-step guide</Link>.
          </li>
          <li>
            Download failing? <Link href="/threads-video-download/">Troubleshooting and error messages</Link>.
          </li>
        </ul>
      </Section>

      <FaqSection items={FAQ} title="Threads to MP3 FAQ" />
    </>
  );
}
