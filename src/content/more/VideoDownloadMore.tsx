import Link from 'next/link';
import { Callout, Section, Table } from '@/components/ContentKit';

const MESSAGES = [
  ['“Please enter a valid Threads post URL.”', 'The text was not recognised as a link to one Threads post.', 'Copy the link again with Share, then Copy link, from the post itself, not from a profile or a screenshot.'],
  ['“This Threads post does not contain downloadable public media.”', 'The post is public but has no video, photo or GIF attached. It may be text only, or the “media” is a link preview to another site.', 'Open the post and check that the media is really part of it.'],
  ['“This content is private or restricted and cannot be processed.”', 'The account is private, or the post needs a login to view.', 'Nothing to fix: this is by design. Ask the creator to share the file.'],
  ['“Too many requests. Please try again later.”', 'You, or someone sharing your network, sent a lot of requests in a short time.', 'Wait a minute or two, then try again. Normal use never hits this.'],
  ['“This download link has expired. Please paste the link again.”', 'The save link is only valid for about half an hour.', 'Paste the post link again to get a fresh one.'],
  ['“Something went wrong. Please try again.”', 'Threads did not answer, or was slow, or a connection dropped.', 'Wait a few seconds and retry. If a public post keeps failing, send it to us.'],
  ['“Access from your network has been restricted.”', 'Requests from your network address were blocked, usually because of automated or abusive traffic.', 'Switch networks (for example Wi-Fi to mobile data) and, if you think it is a mistake, contact us.'],
];

const CHECKS = [
  {
    t: 'Play the first and last five seconds',
    d: 'This is enough to confirm that the file is complete. An interrupted download usually plays for a moment and then stops.',
  },
  {
    t: 'Look at the size',
    d: 'Compare it with the size on the result card. If your file is far smaller, the transfer was cut short and it is worth downloading again.',
  },
  {
    t: 'Check there is sound',
    d: 'Some phones mute videos in the preview. Unmute, or open the file in a player, so you do not find out later that the audio is missing.',
  },
];

export function VideoDownloadMore() {
  return (
    <>
      <Section eyebrow="After the download" title="Is the file actually good? A 30-second check">
        <p>
          Most of the time a downloaded clip is fine on the first try. When it is not, the cause is nearly always the connection rather than the video. Three quick
          checks tell you whether you can trust the file before you rely on it, for example before you delete the original or send it to someone.
        </p>
        <ol>
          {CHECKS.map((c) => (
            <li key={c.t}>
              <strong>{c.t}.</strong> {c.d}
            </li>
          ))}
        </ol>
        <p>
          On a computer you can also right-click the file and open its properties (or &ldquo;Get Info&rdquo; on a Mac) to see its length and size. If the duration looks
          right, the file is whole.
        </p>
      </Section>

      <Section eyebrow="Why sizes differ" title="Two clips of the same length, two very different sizes">
        <p>
          People are often surprised that a 30-second clip from one account is 5 MB and another is 20 MB. That is normal. Size is set by a few things that have nothing
          to do with the downloader:
        </p>
        <ul>
          <li>
            <strong>Resolution.</strong> A 1280×720 picture holds more detail, and so more data, than a 720×720 one.
          </li>
          <li>
            <strong>How busy the picture is.</strong> A person talking against a plain wall compresses very well. Crowds, water and fast camera moves do not.
          </li>
          <li>
            <strong>Frame rate.</strong> Thirty frames a second takes more room than twenty-four.
          </li>
          <li>
            <strong>How the creator exported it.</strong> Apps and editors use different settings before the clip is ever uploaded, and Threads does its own processing
            on top.
          </li>
        </ul>
        <p>
          We do not shrink or enlarge anything. What Threads serves for that post is what you get, which is why the size shown on the result card is the real one.
        </p>
      </Section>

      <Section eyebrow="What the messages mean" title="Reading the error messages">
        <p>
          When something cannot be saved, the tool tries to say why in everyday language. This table translates each message into what is going on and what usually
          fixes it.
        </p>
        <Table caption="Common messages, their meaning and the fix" head={['You see', 'What it means', 'What to try']} rows={MESSAGES} />
        <Callout title="Still stuck after trying the fix?">
          <p>
            Send us the post link, the device and browser you used, and the exact message. With those four things we can usually tell within one reply whether it is a
            problem with the post or with our tool. Use the <Link href="/contact/">contact page</Link> and put &ldquo;Help&rdquo; in the subject.
          </p>
        </Callout>
      </Section>

      <Section eyebrow="Sending it on" title="Sharing a downloaded video without ruining the quality">
        <p>
          The file you saved is in good shape. The step that usually damages it is what happens next, when a messaging app recompresses it to save its own bandwidth.
        </p>
        <ul>
          <li>
            <strong>WhatsApp and similar chat apps</strong> compress videos you send as ordinary attachments, and have historically capped how large a video can be. If
            quality matters, send the clip as a document or file instead of as a video, which skips the squeeze.
          </li>
          <li>
            <strong>Email</strong> has attachment limits that vary by provider and are often small. For anything big, share it through a cloud drive link.
          </li>
          <li>
            <strong>AirDrop, Nearby Share and Bluetooth-free transfers</strong> move the file as it is, which is the best option when both people are in the same room.
          </li>
          <li>
            <strong>Social apps</strong> re-encode whatever you upload. Do not judge the file by how it looks after it has been through one.
          </li>
        </ul>
      </Section>

      <Section eyebrow="Housekeeping" title="Storing clips so you can find them again">
        <p>
          A folder of files called <code>threads-1234567-original.mp4</code> is hard to search a year later. Two small habits make a big difference:
        </p>
        <ul>
          <li>
            <strong>Rename when it matters.</strong> Add who made it and why you kept it, for example &ldquo;Maria bread-scoring tip, from Threads.mp4&rdquo;. It takes ten
            seconds and saves you watching ten clips to find the right one.
          </li>
          <li>
            <strong>Keep the source link.</strong> Paste the original post link into a notes file or the file&apos;s description. If you ever need to credit the creator or
            ask permission, you will know exactly where it came from.
          </li>
          <li>
            <strong>Back up what is truly precious.</strong> A phone can be lost. Anything you would be upset to lose belongs on a second device or in cloud storage.
          </li>
        </ul>
        <p>
          New to the whole process? Start with the <Link href="/how-to-download-threads-videos/">step-by-step guide</Link>, or use the dedicated notes for{' '}
          <Link href="/threads-video-downloader-iphone/">iPhone</Link> and <Link href="/threads-video-downloader-android/">Android</Link>.
        </p>
      </Section>
    </>
  );
}
