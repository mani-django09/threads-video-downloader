import Link from 'next/link';
import { Callout, Table } from '@/components/ContentKit';

const ROUTES = [
  ['Works on', 'Your whole account, public or private', 'One public post at a time'],
  ['How long it takes', 'Up to 30 days, according to Meta', 'A few seconds per post'],
  ['What you get', 'A copy of your Threads data, delivered through an email link', 'One MP4, JPG or GIF, plus the caption to copy'],
  ['Login needed', 'Yes, it is your account', 'No'],
  ['Best for', 'A full archive you rarely open', 'The clips you want on your phone today'],
];

export function BackUpPosts() {
  return (
    <>
      <p>
        Most people think about backups the week after they needed one. A phone dies with the only copy of a clip, an account gets locked, or you clear out old posts in a bad
        mood and regret it on Sunday.
      </p>
      <p>
        There are two sensible ways to keep your Threads posts, and they do different jobs. Meta&apos;s export covers everything but takes a while. A downloader grabs one post
        in seconds. Most people who post regularly will want both.
      </p>

      <h2>Do this before you delete anything</h2>
      <p>
        Meta&apos;s <a href="https://help.instagram.com/259803026523198" rel="noopener noreferrer" target="_blank">help page</a> says content you have already deleted from Threads
        is not included in the file. So if you are planning a clean-up, request the export first, wait for it to arrive, and check it before you remove a single post.
      </p>

      <h2>Route one: ask Meta for your data</h2>
      <p>You can request this from the Threads app:</p>
      <ol>
        <li>Open your profile and tap the menu in the top right.</li>
        <li>
          Tap <strong>Account</strong>, then <strong>Download data</strong>.
        </li>
        <li>
          Follow the prompts. Meta sends an email titled &ldquo;Your Threads Data&rdquo; with a link to the file.
        </li>
      </ol>
      <p>
        Meta says the email can take up to 30 days, so this is a poor plan for the night before you delete your account. Menu names also shift between app versions. If you
        can&apos;t find the option, look in Accounts Center under your information and permissions.
      </p>
      <p>
        When the link arrives, download the file soon after. Then open it and play a video or two, so you find any problem
        while your posts are still online.
      </p>

      <h2>Route two: save the posts you care about</h2>
      <p>
        Everyone has a handful of posts they would really miss: the clip that did well, the one of a friend, the talk you gave. For those, paste the post link into{' '}
        <Link href="/">the downloader</Link> and save the file. The file name includes the post ID, so repeat downloads stay easy to tell apart.
      </p>
      <p>
        The tool also lets you copy the caption. Paste it into a note next to the file, because a video on its own loses the words you wrote with it, and in a year you may not
        remember why you posted it.
      </p>
      <Callout title="If your profile is private">
        <p>
          Our tool only reads posts anyone can open without signing in, so it can&apos;t see a private profile. Use Meta&apos;s export instead. Making a profile public to get
          around this exposes all of your posts to everyone, and a backup isn&apos;t worth that.
        </p>
      </Callout>

      <h2>The two routes side by side</h2>
      <Table caption="Meta data export compared with saving single posts" head={['', 'Meta export', 'Saving single posts']} rows={ROUTES} />

      <h2>Where to keep it</h2>
      <p>
        Keep at least two copies, and make sure they would not both die in the same accident. Your phone and your phone&apos;s cloud sync count as one copy for most purposes,
        since deleting from one often deletes from the other. A laptop folder plus an external drive, or a cloud drive you don&apos;t sync to your phone, is safer.
      </p>
      <p>Name the folder by date, like threads-backup-2026-11. When you make a new export, you will know which one is current.</p>

      <h2>How often to bother</h2>
      <p>
        Twice a year is plenty for most people. If you post work on Threads or run a brand account, once a month is reasonable. Put it in your calendar now, because you won&apos;t
        remember otherwise, and start the export on the day you set the reminder.
      </p>
      <p>
        Saving your own posts raises no rights questions. Other people&apos;s are a different matter, and the post on{' '}
        <Link href="/blog/can-you-repost-a-threads-video/">reposting someone else&apos;s video</Link> covers what you can do with those.
      </p>
    </>
  );
}
