import Link from 'next/link';
import { CardSection, Callout, Section, Table } from '@/components/ContentKit';

const WHY_MP4 = [
  {
    title: 'One file, every device',
    text: 'MP4 with H.264 video and AAC audio is the most widely supported pairing there is. The same file plays on iPhone, Android, Windows, Mac and most smart TVs.',
  },
  {
    title: 'Easy to share',
    text: 'WhatsApp, Telegram, Discord, email and cloud drives all accept MP4 without complaint, so the clip you save is the clip your friend can open.',
  },
  {
    title: 'Ready to edit',
    text: 'CapCut, iMovie, DaVinci Resolve and Premiere import an MP4 as a normal clip. No format juggling before you start cutting.',
  },
  {
    title: 'Small for its quality',
    text: 'MP4 compresses well, so a clip that looks sharp on a phone screen usually weighs only a few megabytes.',
  },
];

const SIZES = [
  ['15 seconds', '2 to 7 MB', 'A quick reaction or a single tip'],
  ['30 seconds', '4 to 15 MB', 'The most common length for clips we see'],
  ['1 minute', '8 to 30 MB', 'A short explainer or a skit'],
  ['3 minutes', '25 to 90 MB', 'A full demo; check the size before using mobile data'],
];

const COMPARE = [
  ['Screen recording', 'Re-encoded at your screen size', 'Notifications and app buttons can end up in the picture', 'Takes as long as the clip plays'],
  ['Threads MP4 Downloader', 'The MP4 Threads itself serves, untouched', 'Nothing added: no watermark, no overlay', 'A few seconds, whatever the clip length'],
  ['Asking the creator', 'The true original, often higher quality', 'Clean, and with permission', 'Depends on a reply, but best for reuse'],
];

const PLAYERS = [
  ['iPhone and iPad', 'Files, then Share, then Save Video to add it to Photos'],
  ['Android', 'Opens from Downloads, and Gallery or Google Photos usually picks it up'],
  ['Windows', 'Movies & TV, Windows Media Player or VLC'],
  ['Mac', 'QuickTime Player or Photos'],
];

export function Mp4DownloaderMore() {
  return (
    <>
      <CardSection
        eyebrow="Why MP4"
        title="The format that just works."
        intro="Most of the time you do not want to think about codecs. You want a file that opens. That is what MP4 is for."
        items={WHY_MP4}
      />

      <Section eyebrow="Behind the button" title="What happens when you press Download MP4">
        <ol>
          <li>
            <strong>We check the link.</strong> Only a genuine address for a single Threads post is accepted. Anything else is turned away with a message.
          </li>
          <li>
            <strong>We read the public page.</strong> Our server opens the same page any visitor could, without logging in, and finds the video, poster and caption. That is
            why private posts are out of reach.
          </li>
          <li>
            <strong>You preview it.</strong> The clip appears with its size, so you can confirm it is the right one before saving. If the post holds a photo or GIF, the tool
            says so and offers that instead.
          </li>
          <li>
            <strong>The MP4 reaches your device.</strong> It streams through our server straight to your browser and is gone when the transfer ends. Nothing is stored on our
            side. The <Link href="/privacy-policy/">privacy policy</Link> lists what we do record.
          </li>
        </ol>
      </Section>

      <Section eyebrow="Where it plays" title="Opening your MP4 after the download">
        <Table caption="Where a saved Threads MP4 opens" head={['Device', 'Where to find and play it']} rows={PLAYERS} />
        <p>
          More detail for phones is on the <Link href="/threads-video-downloader-iphone/">iPhone</Link> and{' '}
          <Link href="/threads-video-downloader-android/">Android</Link> pages.
        </p>
      </Section>

      <Section eyebrow="Size planning" title="How big will the MP4 be?">
        <p>
          The result card shows the exact size before you save. For a rough idea beforehand, here are typical numbers for phone-shot clips. A still shot of someone talking
          compresses better than a busy street scene.
        </p>
        <Table caption="Rough MP4 sizes for common clip lengths" head={['Clip length', 'Typical file size', 'Good to know']} rows={SIZES} />
        <p>On a metered mobile plan, anything over a minute is worth saving on Wi-Fi.</p>
      </Section>

      <Section eyebrow="Choosing a method" title="Three ways to keep a video, compared">
        <Table caption="Comparison of ways to keep a Threads video" head={['Method', 'Picture quality', 'What ends up in the file', 'Effort']} rows={COMPARE} />
        <p>
          For anything you plan to reuse publicly, the third row wins. A message to the creator takes a minute, gets you a better file, and keeps you on the right side of
          copyright.
        </p>
      </Section>

      <Section eyebrow="Doing it properly" title="Using saved MP4s responsibly">
        <ul>
          <li>
            <strong>Keep it personal by default.</strong> Watching offline or sending it to a friend privately is the everyday case.
          </li>
          <li>
            <strong>Ask before you repost.</strong> For your own channel, an ad or a course, get the creator&apos;s permission.
          </li>
          <li>
            <strong>Leave watermarks and handles alone.</strong> Cropping out a name is the fastest route to a takedown.
          </li>
          <li>
            <strong>Take it down when asked.</strong> If a creator asks you to remove a copy, remove it.
          </li>
        </ul>
        <Callout title="Commercial use">
          <p>
            Anything that earns money needs a licence or explicit permission, and a free tool cannot grant it. See our <Link href="/terms-of-service/">terms</Link> and{' '}
            <Link href="/disclaimer/">disclaimer</Link>. Rights holders can use the <Link href="/dmca/">copyright page</Link>.
          </p>
        </Callout>
        <p>
          Want an MP3, GIF or smaller file from your MP4? See <Link href="/threads-to-mp4/">Threads to MP4: converting after you download</Link>.
        </p>
      </Section>
    </>
  );
}
