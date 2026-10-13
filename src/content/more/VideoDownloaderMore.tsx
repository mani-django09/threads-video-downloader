import Link from 'next/link';
import { CardSection, Callout, Section, Table } from '@/components/ContentKit';

const SITUATIONS = [
  {
    title: 'The keeper of useful advice',
    text: 'A nutritionist, a mechanic or a language teacher posts a thirty-second clip that finally explains something properly. You want it on your phone for the day the internet is slow or the post is gone.',
  },
  {
    title: 'The creator with a backup problem',
    text: 'You posted a clip years ago and lost the original file when a phone died. Saving it back from your own public post is quicker than digging through old drives.',
  },
  {
    title: 'The person sharing with someone who is not on Threads',
    text: 'A link is useless to a relative who has never opened the app. A real video file goes into the family chat and just plays.',
  },
  {
    title: 'The researcher or moderator',
    text: 'You need to keep a record of what a public post showed on a particular day, for a report, a complaint or a fact-check, before it is edited or removed.',
  },
];

const SIZES = [
  ['15 seconds', '2 to 7 MB', 'A quick reaction or a single tip'],
  ['30 seconds', '4 to 15 MB', 'The most common length for clips we see'],
  ['1 minute', '8 to 30 MB', 'A short explainer or a skit'],
  ['3 minutes', '25 to 90 MB', 'A full demo; worth checking the size before using mobile data'],
];

const COMPARE = [
  ['Screen recording', 'Re-encoded at your screen size', 'Notifications and app buttons can end up in the picture', 'Records while it plays, so it takes as long as the clip'],
  ['Threads Downloader', 'The file Threads itself serves, untouched', 'Nothing added: no watermark, no overlay', 'A few seconds, whatever the clip length'],
  ['Asking the creator', 'The true original, often higher quality', 'Clean, and with permission', 'Depends on a reply, but the best route for reuse'],
];

export function VideoDownloaderMore() {
  return (
    <>
      <Section eyebrow="Behind the button" title="What actually happens when you press Download">
        <p>
          It helps to know what a tool is doing with your link, so here is the whole journey in plain words. It takes a few seconds, but there are four distinct
          steps, and each one explains something you might otherwise wonder about.
        </p>
        <ol>
          <li>
            <strong>We check the link.</strong> The first thing the tool does is make sure what you pasted is a genuine address for a single Threads post. A link to
            some other site, or to a profile, is turned away straight away with a message, instead of being sent anywhere.
          </li>
          <li>
            <strong>We read the public page.</strong> Our server opens the same public page any visitor could open without an account and looks for the video the post
            displays, plus its poster picture and caption. No login is used, which is exactly why private posts are out of reach.
          </li>
          <li>
            <strong>You see a preview.</strong> The clip appears with its size and format so you can confirm it is the right one before saving anything. If the post
            holds a photo or a GIF instead, the tool says so and offers that.
          </li>
          <li>
            <strong>The file reaches your device.</strong> When you press save, the MP4 is sent to your browser as a download. It passes through our server only as a
            stream and is gone when the transfer ends. There is no copy sitting on our side afterwards.
          </li>
        </ol>
        <p>
          That last point is why we can say with a straight face that we do not keep anything you save. The design leaves nothing to keep. If you would like the
          details on what we do record (such as which pages were visited), the <Link href="/privacy-policy/">privacy policy</Link> lists it.
        </p>
      </Section>

      <CardSection
        eyebrow="Real-life situations"
        title="Why people end up needing this."
        intro="These are the situations that come up most often. None of them need anything clever; they just need the video to be on your phone rather than inside an app."
        items={SITUATIONS}
        footnote="Whatever the reason, the clip belongs to whoever made it. Saving it for yourself is one thing; reposting it is another, and the section below explains where that line usually sits."
      />

      <Section eyebrow="Size planning" title="How big will the file be?">
        <p>
          The result card shows the exact size of your clip before you save it, so you never have to guess. If you would like a feel for it in advance, here is a
          ballpark for typical phone-shot clips. Real numbers move with resolution and how much is happening on screen: a still shot of someone talking compresses
          better than a busy street scene.
        </p>
        <Table
          caption="Rough file sizes for common clip lengths"
          head={['Clip length', 'Typical file size', 'Good to know']}
          rows={SIZES}
        />
        <p>
          If you are on a metered mobile plan, anything over a minute is worth saving on Wi-Fi. If storage is the worry, save the clip, send it where it needs to go,
          and delete the local copy afterwards.
        </p>
      </Section>

      <Section eyebrow="Choosing a method" title="Three ways to keep a video, compared">
        <p>
          You are not stuck with a downloader. Here is how the usual options stack up, so you can pick the one that suits what you are doing.
        </p>
        <Table
          caption="Comparison of ways to keep a Threads video"
          head={['Method', 'Picture quality', 'What ends up in the file', 'Effort']}
          rows={COMPARE}
        />
        <p>
          For anything you plan to reuse publicly, the third row wins every time. A message to the creator takes a minute, gets you a better file, and keeps you on
          the right side of copyright.
        </p>
      </Section>

      <Section eyebrow="Doing it properly" title="Using saved videos responsibly">
        <p>
          A tool can only copy what is on a public page. Whether you are allowed to <em>do something</em> with the copy is a separate question, and it is yours to
          answer. A few habits keep you out of trouble and keep creators on side:
        </p>
        <ul>
          <li>
            <strong>Keep it personal by default.</strong> Watching offline, studying it, or sending it to a friend privately is the everyday case and rarely a problem.
          </li>
          <li>
            <strong>Ask before you repost.</strong> If you want to share it on your own channel, in an ad or in a course, get the creator&apos;s permission in writing, even
            if that is just a reply to a message.
          </li>
          <li>
            <strong>Credit, but do not rely on credit.</strong> Naming the creator is polite and expected; it does not replace permission.
          </li>
          <li>
            <strong>Leave watermarks and handles alone.</strong> Cropping out someone&apos;s name to make a clip look like yours is the fastest way to a takedown.
          </li>
          <li>
            <strong>Respect people in the frame.</strong> A public post is not blanket consent to be compiled, mocked or used to target someone.
          </li>
          <li>
            <strong>Take it down when asked.</strong> If a creator asks you to remove a copy, remove it.
          </li>
        </ul>
        <Callout title="A note on commercial use">
          <p>
            Anything that earns money, including ads, sponsored posts and paid courses, needs a licence or explicit permission. The rules differ from country to country, and
            a free download tool cannot grant that permission for you. Our <Link href="/terms-of-service/">terms</Link> and <Link href="/disclaimer/">disclaimer</Link> say
            the same.
          </p>
        </Callout>
        <p>
          If you are a rights holder and think a post has been copied against your wishes, the <Link href="/dmca/">copyright page</Link> explains how to tell us, and how
          to get it removed at the source.
        </p>
      </Section>
    </>
  );
}
