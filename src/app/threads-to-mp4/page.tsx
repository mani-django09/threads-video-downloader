import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolHero } from '@/components/ToolHero';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FaqSection, type FaqItem } from '@/components/FaqSection';
import { CardSection, Callout, Section, Table } from '@/components/ContentKit';
import { pageMetadata } from '@/lib/seo';

const PATH = '/threads-to-mp4/';

export const metadata: Metadata = pageMetadata({
  title: 'Threads to MP4 – Save Threads Videos as MP4 Free',
  description:
    'Threads videos are already MP4 files. Paste a public post link and save the original MP4 with no conversion, no quality loss and no watermark. Includes how to make MP3, GIF or MOV from it.',
  path: PATH,
});

const COMPAT = [
  ['iPhone and iPad', 'Plays in Photos, Files and Safari', 'Nothing to do. Add it to Photos with Share, then Save Video.'],
  ['Android', 'Plays in Gallery, Google Photos and any player', 'Nothing to do.'],
  ['Windows', 'Plays in Movies & TV and Windows Media Player', 'Nothing to do. VLC also plays it.'],
  ['Mac', 'Plays in QuickTime and Photos', 'Nothing to do.'],
  ['Smart TVs and consoles', 'Plays from a USB stick on most models', 'If a TV refuses it, copy the file over a cast or use a streaming stick.'],
  ['Editors (iMovie, CapCut, DaVinci Resolve, Premiere)', 'Imports as a normal clip', 'If an older editor complains, re-encode with HandBrake or ffmpeg.'],
];

const FAQ: FaqItem[] = [
  {
    question: 'Does the tool convert Threads videos to MP4?',
    answer:
      'It does not need to. Threads serves its videos as MP4 files already, so the tool saves that file as it is. Nothing is re-encoded, which is why there is no quality loss and no waiting for a conversion.',
  },
  {
    question: 'Why does my download show a different file type?',
    answer:
      'Posts that contain a photo or a real GIF are saved as JPG or GIF instead, because that is what the post actually holds. If you pasted a video post, the file is an MP4.',
  },
  {
    question: 'Can I get an MP3 or audio-only file?',
    answer:
      'The tool saves the original MP4. If you only want the sound, you can extract it from the MP4 on your own device with a free tool such as VLC or ffmpeg; the steps are on this page.',
  },
  {
    question: 'Will the MP4 play on my TV or in my editor?',
    answer:
      'In most cases yes. The files use H.264 video and AAC audio, the most widely supported combination. If a particular editor or TV will not open it, re-encoding with HandBrake or ffmpeg fixes it.',
  },
  {
    question: 'Is there a watermark on the MP4?',
    answer: 'No. We do not add anything to the file. It is the same MP4 Threads plays in the app.',
  },
  {
    question: 'Can I save a private Threads video as MP4?',
    answer: 'No. The tool only works with public posts that anyone can open without signing in. Private accounts stay private.',
  },
];

export default function ThreadsToMp4Page() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Threads to MP4', href: PATH }]} />

      <ToolHero
        title="Threads to MP4"
        highlight="MP4"
        description="Paste a public Threads post link and save the video as an MP4. It is already an MP4, so there is nothing to convert."
      />

      <Section eyebrow="Short answer" title="Why there is no conversion step">
        <p>
          People search for &ldquo;Threads to MP4 converter&rdquo; because most video sites keep clips in some unusual format that has to be converted before you can use it.
          Threads is not one of them. When someone uploads a video, Threads stores and plays it as an <strong>MP4</strong> file, so the useful job is simply fetching that file,
          not converting anything.
        </p>
        <p>
          That is good news for you. A conversion means decoding the video and encoding it again, and every round of encoding costs a little sharpness and takes time. Saving the
          original MP4 skips all of it: the picture and sound you get are exactly what Threads plays, and the download starts as soon as you press the button.
        </p>
        <Callout title="What is inside the file">
          <p>
            In the videos we have tested, the picture is H.264 and the sound is AAC, packed in an MP4 container. It is the most compatible combination there is, which is why the
            file opens almost everywhere without help.
          </p>
        </Callout>
      </Section>

      <Section eyebrow="Will it play?" title="Where the MP4 works without fuss">
        <p>The same file works on all of these, so you do not need a different version per device:</p>
        <Table caption="Where a saved Threads MP4 plays" head={['Where', 'What happens', 'What to do']} rows={COMPAT} />
        <p>
          Not sure where your phone saved it? The <Link href="/threads-video-downloader-iphone/">iPhone</Link> and <Link href="/threads-video-downloader-android/">Android</Link> pages
          show exactly where to look.
        </p>
      </Section>

      <Section eyebrow="After you have the MP4" title="Turning it into something else (MP3, GIF, MOV, smaller MP4)">
        <p>
          Sometimes the MP4 is only the first step. These are the common follow-ups, each doable on your own device with free software. They are separate jobs from downloading, which
          is why the tool leaves them to you: you decide the trade-off between size and quality.
        </p>
        <h3>Only the audio (MP3)</h3>
        <p>Open the MP4 in VLC and use Convert/Save, or with ffmpeg:</p>
        <pre className="my-4 overflow-x-auto rounded-2xl border border-line bg-ink p-4 text-[13px] leading-relaxed text-white">
          <code>ffmpeg -i clip.mp4 -vn -c:a libmp3lame -q:a 2 clip.mp3</code>
        </pre>
        <h3>A GIF</h3>
        <pre className="my-4 overflow-x-auto rounded-2xl border border-line bg-ink p-4 text-[13px] leading-relaxed text-white">
          <code>ffmpeg -i clip.mp4 -vf &quot;fps=12,scale=480:-1&quot; clip.gif</code>
        </pre>
        <p>
          Keep GIFs short. A few seconds at a small width looks better and weighs far less than a long one. There is more on the trade-off on the{' '}
          <Link href="/threads-gif-downloader/">GIF downloader page</Link>.
        </p>
        <h3>A smaller MP4</h3>
        <pre className="my-4 overflow-x-auto rounded-2xl border border-line bg-ink p-4 text-[13px] leading-relaxed text-white">
          <code>ffmpeg -i clip.mp4 -vf scale=-2:480 -crf 28 clip-small.mp4</code>
        </pre>
        <p>
          Handy for email or chat, but this does re-encode, so keep the original if you may want full quality later.
        </p>
        <h3>A MOV or another container</h3>
        <p>
          If an app insists on <code>.mov</code>, you can usually rewrap the same video without re-encoding it, which is fast and lossless:
        </p>
        <pre className="my-4 overflow-x-auto rounded-2xl border border-line bg-ink p-4 text-[13px] leading-relaxed text-white">
          <code>ffmpeg -i clip.mp4 -c copy clip.mov</code>
        </pre>
      </Section>

      <CardSection
        eyebrow="Good habits"
        title="Four things worth knowing before you convert anything."
        items={[
          { title: 'Keep the original', text: 'Convert a copy. Once a video has been re-encoded smaller, the lost detail cannot be brought back.' },
          { title: 'Do not upscale', text: 'Converting a 720p clip to 1080p makes the file bigger, not sharper. There is no detail to add.' },
          { title: 'Check the rights first', text: 'Saving for yourself is simple. Editing and reposting someone else’s clip needs their permission, whatever the format.' },
          { title: 'Mind the audio', text: 'Some clips use licensed music. Pulling out the sound does not change who owns it.' },
        ]}
        footnote={
          <>
            Our <Link href="/terms-of-service/" className="font-semibold text-accent-lo underline underline-offset-2">terms</Link> and{' '}
            <Link href="/disclaimer/" className="font-semibold text-accent-lo underline underline-offset-2">disclaimer</Link> explain what responsible use looks like.
          </>
        }
      />

      <Section eyebrow="Related" title="Other things you might need">
        <ul>
          <li>
            The main <Link href="/">Threads video downloader</Link> on the homepage covers saving, quality and file size.
          </li>
          <li>
            Something not saving? <Link href="/threads-video-download/">Troubleshooting and error messages</Link> explains each one.
          </li>
          <li>
            Brand new to this? Start with the <Link href="/how-to-download-threads-videos/">step-by-step guide</Link>.
          </li>
        </ul>
      </Section>

      <FaqSection items={FAQ} title="Threads to MP4 FAQ" />
    </>
  );
}
