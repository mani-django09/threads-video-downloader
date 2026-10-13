import Link from 'next/link';
import { Callout, Section, Table } from '@/components/ContentKit';

const SYMPTOMS = [
  ['Nothing happens when I press download', 'The page is open in an in-app browser, or a pop-up or download prompt was dismissed', 'Open the link in Chrome or Samsung Internet and try again; tap Download or Allow if asked'],
  ['It starts, then stops at the same point', 'Data saver, battery saver or a weak connection interrupted the transfer', 'Switch to Wi-Fi, turn power saving off, and keep the screen on until it finishes'],
  ['It says it downloaded, but I cannot find it', 'The file is in Downloads, not in the Gallery', 'Open the Files app, go to Downloads, and move or share the video from there'],
  ['The video is there but will not play', 'An incomplete file from an interrupted download', 'Delete it and download again; try VLC if it still will not play'],
  ['“Not enough storage” or a silent failure', 'The phone is almost full', 'Clear some space, especially old videos and cached app data'],
];

export function AndroidMore() {
  return (
    <>
      <Section eyebrow="Know your phone" title="Where Android actually puts a downloaded video">
        <p>
          Android is more varied than any other phone platform, so the same download can look different depending on whether you have a Pixel, a Samsung, a Xiaomi or a budget
          handset. The good news is that the pattern is always the same: a downloaded file goes to the <strong>Downloads</strong> folder first, and what differs is how
          that folder is shown to you.
        </p>
        <ul>
          <li>
            <strong>Pixel and most &ldquo;stock&rdquo; Android phones:</strong> open the Files app and tap Downloads. Chrome also keeps a list under its menu, in Downloads.
          </li>
          <li>
            <strong>Samsung:</strong> open My Files, then Downloads. The Gallery usually picks up new videos and may show them in a Downloads album.
          </li>
          <li>
            <strong>Xiaomi, Oppo, Realme and others:</strong> each has its own file manager, but all of them have a Downloads section. If you cannot find the app, search your
            apps for &ldquo;Files&rdquo;.
          </li>
        </ul>
        <p>
          Once you know where Downloads is, saving becomes a habit rather than a hunt. From there, long-press the video to move it, share it, or rename it.
        </p>
      </Section>

      <Section eyebrow="Settings worth a minute" title="Two settings that make downloads smoother">
        <p>You can do all of this without changing anything, but these two tweaks save time if you download often.</p>
        <h3>Choose where Chrome saves files</h3>
        <p>
          In Chrome, open the menu, go to Settings, then Downloads. Depending on your version you can turn on an option to be asked where to save each file, which is useful
          if you keep a memory card or a dedicated folder for videos. Leave it off if you want everything to land in Downloads automatically.
        </p>
        <h3>Check that your Photos app will back it up</h3>
        <p>
          Google Photos backs up the camera folder by default, and may not include Downloads. If you want saved clips to be backed up as well, open Google Photos, go to the
          device folders section in settings, and switch on backup for Downloads. Otherwise, a video you saved only exists on that phone.
        </p>
      </Section>

      <Section eyebrow="Mind your data" title="Mobile data, Wi-Fi and battery">
        <p>
          A video is one of the heaviest things you can download, and phones are often on a plan with a monthly limit. The tool shows the file size on the result card
          before you save. Use it:
        </p>
        <ul>
          <li>A clip of about 5 to 15 MB is fine on mobile data for most people.</li>
          <li>Anything over about 50 MB is better saved on Wi-Fi, especially while roaming.</li>
          <li>Power-saving modes can pause transfers when the screen turns off. For a large file, keep the screen on until the notification says it is complete.</li>
        </ul>
        <Callout title="Tip: save now, watch later">
          <p>
            If you are out and about, you can paste the link and download on the train, but doing it on Wi-Fi at home is usually quicker and keeps your data allowance for
            things that need it.
          </p>
        </Callout>
      </Section>

      <Section eyebrow="Sharing from your phone" title="Sending the clip to WhatsApp, Telegram or a friend">
        <p>
          Once the file is in Downloads you have a normal video, so every sharing option on your phone works.
        </p>
        <ul>
          <li>
            <strong>From the Files app:</strong> long-press the video, tap Share, and choose WhatsApp, Telegram, Messages or email.
          </li>
          <li>
            <strong>To a nearby phone:</strong> Quick Share (or Nearby Share on older phones) sends the file as it is, with no recompression, which is best when you are next to
            the person.
          </li>
        </ul>
        <p>
          If the clip is for someone who is not on Threads, this is the whole point: they get an actual video, not a link they cannot open.
        </p>
      </Section>

      <Section eyebrow="Quick diagnosis" title="Problem, likely cause and fix">
        <p>When something goes wrong on Android it is nearly always one of these. Find your symptom in the left column:</p>
        <Table caption="Android download problems and fixes" head={['What you notice', 'Likely cause', 'What to try']} rows={SYMPTOMS} />
        <p>
          If none of those fit, the general <Link href="/threads-video-download/">troubleshooting page</Link> explains what each error message means, or you can{' '}
          <Link href="/contact/">contact us</Link> with the post link and your phone model.
        </p>
        <p>
          Prefer a bigger screen? The tool works the same on a Chromebook or an Android tablet; downloads go to the Downloads folder there too.
        </p>
      </Section>
    </>
  );
}
