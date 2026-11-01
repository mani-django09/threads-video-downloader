import Link from 'next/link';
import { Callout, Table } from '@/components/ContentKit';

const OPTIONS = [
  ['Normal video', 'Compressed heavily', 'Plays right in the chat', 'Quick shares where quality does not matter'],
  ['HD option', 'Compressed less, but still compressed', 'Plays right in the chat', 'A decent middle ground'],
  ['Document', 'Sent unchanged', 'The other person taps to download, then opens it', 'Anything you want to keep sharp'],
];

export function WhatsAppQuality() {
  return (
    <>
      <p>
        You save a clean copy of a Threads clip, send it to the family group, and it arrives looking like it was filmed through a shower door. WhatsApp did that. Attach a video
        the normal way and the app compresses it to save data, whatever the quality of your file.
      </p>
      <p>
        You can avoid it by sending the clip as a document. That takes about two extra taps. The other person gets the same file you have, byte for byte.
      </p>

      <h2>Your three options</h2>
      <Table caption="Ways to send a video on WhatsApp" head={['How you send it', 'What happens to quality', 'What the other person sees', 'Use it for']} rows={OPTIONS} />
      <p>
        The HD button looks like the answer, and it does help. But it only reduces the compression, so the file that arrives still isn&apos;t the file you sent. If you care
        about quality, use the document option.
      </p>

      <h2>First, get the file on your phone</h2>
      <p>
        Copy the link from the Threads post, paste it into <Link href="/">the downloader</Link>, and save the MP4. Then remember where it landed, because the next step depends
        on it.
      </p>
      <ul>
        <li>
          <strong>iPhone:</strong> Safari puts it in the Files app, under Downloads. Leave it there for now. WhatsApp&apos;s document picker reads from Files, so you don&apos;t need
          to move it to Photos.
        </li>
        <li>
          <strong>Android:</strong> it goes to your Downloads folder.
        </li>
      </ul>
      <p>
        The <Link href="/threads-video-downloader-iphone/">iPhone</Link> and <Link href="/threads-video-downloader-android/">Android</Link> guides have more on finding saved
        files.
      </p>

      <h2>Sending it on iPhone</h2>
      <ol>
        <li>Open the chat and tap the + button next to the message box.</li>
        <li>
          Choose <strong>Document</strong>.
        </li>
        <li>Browse to Downloads in Files and tap the video.</li>
        <li>Tap Send.</li>
      </ol>

      <h2>Sending it on Android</h2>
      <ol>
        <li>Open the chat and tap the paperclip icon.</li>
        <li>
          Choose <strong>Document</strong>.
        </li>
        <li>Browse to your Downloads folder and tap the video. If it isn&apos;t listed, use the option to browse other files.</li>
        <li>Tap Send.</li>
      </ol>
      <p>WhatsApp changes its menus from time to time, so the labels on your phone may differ slightly. The Document option has been there for years.</p>

      <h2>Will the file be too big?</h2>
      <p>
        Almost certainly not. WhatsApp&apos;s document limit is reported at 2 GB, and a Threads clip is nowhere near that. A 30-second clip is usually 4 to 15 MB, and even a
        3-minute one tends to stay under 100 MB.
      </p>
      <Callout title="One trade-off">
        <p>
          A document doesn&apos;t play inside the chat. The other person sees a file, taps to download it, and opens it in their video player. For someone who isn&apos;t comfortable
          with their phone, add a line saying &ldquo;tap this to watch it.&rdquo;
        </p>
      </Callout>

      <h2>Other apps</h2>
      <p>
        Telegram has the same idea built in, under its &ldquo;send as file&rdquo; option. Gmail caps attachments at 25 MB and offers a Google Drive link above that, so most short clips fit
        as they are. For longer clips, a Drive or Dropbox link is usually the easier route anyway, since the person can watch it in the browser.
      </p>
      <p>
        If the clip looks bad on your own phone before you send it, compression in the chat isn&apos;t the problem, and{' '}
        <Link href="/blog/why-threads-videos-look-blurry/">this post on blurry Threads videos</Link> will help you find what is. When the clip belongs to someone else, sending it to a
        friend is one thing and posting it publicly is another, and <Link href="/blog/can-you-repost-a-threads-video/">the repost guide</Link> explains where that line sits.
      </p>
    </>
  );
}
