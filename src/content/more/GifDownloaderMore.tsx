import Link from 'next/link';
import { Callout, Section, Table } from '@/components/ContentKit';

const WHERE = [
  ['Messaging apps (WhatsApp, iMessage, Telegram)', 'Both work', 'Most apps turn a GIF into a looping video behind the scenes anyway. An MP4 is usually smaller and sharper.'],
  ['Slack, Discord and similar team chat', 'Both work', 'A real GIF animates in the message. A looping MP4 plays as a short video.'],
  ['PowerPoint and Keynote', 'Both work', 'A GIF loops by itself. A video may need you to set it to start automatically and repeat.'],
  ['Google Slides', 'GIF works best', 'GIFs animate on their own in a slide. Video needs to be uploaded or linked.'],
  ['Email', 'GIF (small)', 'Many email programs show a GIF but not an embedded video. Keep it small so the message loads.'],
  ['Websites and blogs', 'MP4 preferred', 'A short muted looping MP4 is much lighter than a GIF for the same clip.'],
];

export function GifDownloaderMore() {
  return (
    <>
      <Section eyebrow="Which one should you want?" title="Where each kind of loop works best">
        <p>
          Once you have a loop, the next question is where it is going. The format you get matters less than you might think, because most apps handle both well, but
          there are differences worth knowing before you build a presentation around one.
        </p>
        <Table caption="Where GIFs and looping MP4 files work" head={['Where you want to use it', 'Works as', 'Notes']} rows={WHERE} />
        <p>
          The general rule: if you are showing it somewhere that plays video, take the MP4. If you need it to animate by itself in a program that only knows images, a real GIF
          is the safer bet. The tool gives you whichever one the post actually contains, and does not convert in either direction.
        </p>
      </Section>

      <Section eyebrow="Why it looks the way it does" title="Why GIFs look grainy, and why they are so big">
        <p>
          A GIF is a very old format, from the late 1980s. It can store only 256 colours per frame, and it keeps each frame almost like a separate picture. Two things
          follow from that:
        </p>
        <ul>
          <li>
            <strong>Grain and banding.</strong> Skin tones, sunsets and gradients that look smooth in a video get squeezed into 256 colours, which shows up as a speckled or
            stepped look.
          </li>
          <li>
            <strong>Large files.</strong> With no modern video compression, a few seconds can run to many megabytes. The same clip as an MP4 is often a fraction of the size
            and looks better.
          </li>
        </ul>
        <p>
          That is the reason most of the loops you see on Threads are really short videos. It is not a trick, it is simply the better tool for the job, and it is why the
          file you save is often an MP4 and not a .gif.
        </p>
        <Callout title="Sound is not a given">
          <p>
            A true GIF has no audio at all. A looping MP4 can have sound, but many are silent. If a clip has audio, you will hear it when you preview it in the tool before
            saving.
          </p>
        </Callout>
      </Section>

      <Section eyebrow="If you really need a .gif" title="Turning a looping MP4 into a GIF yourself">
        <p>
          Sometimes a program insists on a real GIF. You can make one from the MP4 you saved. The tool does not do the conversion for you, partly because it makes files
          bigger and worse, but it is easy to do yourself:
        </p>
        <ul>
          <li>
            <strong>Use a video editor or a free online converter.</strong> Drop in the MP4, pick GIF as the output, and keep the length short.
          </li>
          <li>
            <strong>Or use a command line tool.</strong> If you are comfortable with it, ffmpeg can do it in one line:
          </li>
        </ul>
        <pre className="my-4 overflow-x-auto rounded-2xl border border-line bg-ink p-4 text-[13px] leading-relaxed text-white">
          <code>ffmpeg -i loop.mp4 -vf &quot;fps=12,scale=480:-1&quot; loop.gif</code>
        </pre>
        <p>
          Lowering the frame rate (<code>fps=12</code>) and the width (<code>scale=480:-1</code>) keeps the file size reasonable. A smaller, shorter GIF will almost always
          look better than a long, large one.
        </p>
      </Section>

      <Section eyebrow="Good manners" title="Sharing loops without annoying people">
        <p>
          Loops are meant to be fun, but a few things make them kinder to the people looking at them:
        </p>
        <ul>
          <li>
            <strong>Mind the motion.</strong> Fast flashing or constant movement is hard on some people, and can trigger problems for those with motion sensitivity or
            photosensitive conditions. Avoid putting rapidly flashing loops in a place people cannot pause.
          </li>
          <li>
            <strong>Do not loop forever on a slide.</strong> In a presentation, an endless animation next to your text is distracting. Let it play a few times, or use it as
            a short punctuation mark.
          </li>
          <li>
            <strong>Watch the size on mobile data.</strong> A 20 MB GIF in a group chat uses up other people&apos;s data allowance too.
          </li>
          <li>
            <strong>Remember where it came from.</strong> Many popular loops are clips from films, shows or music videos, which belong to the studios. Sharing one in a chat
            is part of everyday culture; putting it in an advert or a product is not.
          </li>
        </ul>
        <p>
          Our <Link href="/disclaimer/">disclaimer</Link> sets out what responsible use looks like, and if you want a regular video clip rather than a loop, the{' '}
          <Link href="/">video downloader</Link> is the page for that.
        </p>
      </Section>
    </>
  );
}
