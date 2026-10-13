import Link from 'next/link';
import { Callout, Section, Table } from '@/components/ContentKit';

const WHERE = [
  ['Safari download list', 'Tap the download icon next to the address bar', 'Shows progress and opens the file the moment it finishes'],
  ['Files app', 'Browse, then Downloads', 'The usual home of a Safari download: iCloud Drive or On My iPhone'],
  ['Photos app', 'Only after you choose Save Video', 'Files does not copy into Photos by itself'],
  ['Messages / WhatsApp', 'Share from Files', 'Sends the video; apps may compress it on the way'],
  ['A Mac nearby', 'AirDrop from Files', 'Moves the file untouched, with no loss of quality'],
];

const SYMPTOMS = [
  ['No download icon appears in Safari', 'The page is inside another app’s browser, or the tap did not register', 'Copy the link, open Safari yourself, paste it there and try again'],
  ['The file saves but I cannot see it in Photos', 'It is in Files, not the camera roll', 'Open Files, tap the video, then Share and Save Video'],
  ['The download stops when I lock the phone', 'Low Power Mode or the screen locking paused Safari', 'Keep Safari open and the screen on until it has finished'],
  ['It will not start on cellular', 'A VPN or iCloud Private Relay can interfere, or a data setting is off', 'Try again on Wi-Fi, or pause the VPN or Private Relay for a moment'],
  ['“Not enough storage”', 'The iPhone is nearly full', 'Free some room under Settings, General, iPhone Storage, then retry'],
];

export function IphoneMore() {
  return (
    <>
      <Section eyebrow="Where it all goes" title="Following the file from Safari to your camera roll">
        <p>
          The most common thing people say about downloading on an iPhone is &ldquo;it worked, but where did it go?&rdquo; The answer is that iOS keeps downloaded files and
          your photos in different places, on purpose. Here is how to trace a video:
        </p>
        <Table caption="Where a downloaded video can be found on iPhone" head={['Place', 'How to get there', 'What to know']} rows={WHERE} />
        <p>
          Everything starts in Safari&apos;s download list and ends wherever you send it. If you only watch the clip occasionally, leaving it in Files is fine. If you want to
          edit it or send it in a chat as if you had filmed it, add it to your camera roll with <strong>Share</strong> and then <strong>Save Video</strong>.
        </p>
      </Section>

      <Section eyebrow="Settings worth a minute" title="Choose where Safari keeps your downloads">
        <p>
          By default Safari saves into iCloud Drive, in a Downloads folder, if you have iCloud Drive on. You can change that:
        </p>
        <ol>
          <li>Open the <strong>Settings</strong> app and tap <strong>Safari</strong>.</li>
          <li>Scroll to <strong>Downloads</strong>.</li>
          <li>Choose <strong>iCloud Drive</strong>, <strong>On My iPhone</strong> or a folder of your choice.</li>
        </ol>
        <p>
          <strong>On My iPhone</strong> keeps the file only on the device and does not use iCloud space, which is handy for big videos you do not need on every device.
          iCloud Drive makes it available on your other Apple devices, but it counts towards your iCloud storage.
        </p>
        <Callout title="Which should you pick?">
          <p>
            If you tend to forward clips straight away and delete them, <strong>On My iPhone</strong> is the simpler choice. If you move between an iPhone, an iPad and a Mac
            and want the file everywhere, <strong>iCloud Drive</strong> is better.
          </p>
        </Callout>
      </Section>

      <Section eyebrow="It will play" title="Will the video work on every Apple device?">
        <p>
          Yes. The file you download is a standard MP4 with H.264 video and AAC audio, which every iPhone, iPad and Mac can play, along with most Windows PCs, Android
          phones and televisions. That matters because iPhones film in a newer format (HEVC) that does not always open elsewhere. A Threads download does not have that
          problem, so you can share it with an Android friend or open it on a work computer without converting anything.
        </p>
        <p>
          On an iPad the steps are the same. The bigger screen makes the Files app easier to use: you can open it beside Safari in Split View and drag the downloaded video
          straight into a message or a document.
        </p>
      </Section>

      <Section eyebrow="Sharing from your phone" title="AirDrop, Messages and keeping the quality">
        <p>
          Once the video is in Files or Photos, sharing it is a normal iPhone job:
        </p>
        <ul>
          <li>
            <strong>AirDrop</strong> sends the file untouched to a Mac, iPad or iPhone nearby. It is the best way to keep the quality.
          </li>
          <li>
            <strong>Messages</strong> sends the clip in the chat. iMessage handles larger files well; to an Android user it travels as a normal MMS or RCS video and may be
            compressed.
          </li>
          <li>
            <strong>Mail</strong> offers Mail Drop for big attachments, so a large clip does not bounce back.
          </li>
        </ul>
        <p>
          If you made the clip yourself, remember that you are also sending whatever is in it. Check the video before you pass it on.
        </p>
      </Section>

      <Section eyebrow="Quick diagnosis" title="Problem, likely cause and fix">
        <p>iPhones are consistent, so most issues come down to a short list:</p>
        <Table caption="iPhone download problems and fixes" head={['What you notice', 'Likely cause', 'What to try']} rows={SYMPTOMS} />
        <p>
          For messages the tool shows that are not specific to iPhone, the <Link href="/threads-video-download/">troubleshooting page</Link> lists each one and what it means. And
          if a public post keeps failing, <Link href="/contact/">tell us</Link> the link and your iOS version and we will look into it.
        </p>
      </Section>
    </>
  );
}
