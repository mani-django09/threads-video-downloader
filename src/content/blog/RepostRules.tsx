import Link from 'next/link';
import { Callout, Table } from '@/components/ContentKit';

const USES = [
  ['Keeping it to watch offline', 'Low', 'Everyday personal use'],
  ['Sending it to a friend privately', 'Low', 'Small and private, with nothing earned'],
  ['Using the repost button in Threads', 'Low', 'The original stays attached and the creator stays in control'],
  ['Re-uploading it to your own profile with credit', 'Medium', 'Credit is polite, but it is not permission'],
  ['Re-uploading it to another platform', 'Medium to high', 'You are taking it out of the place the creator chose'],
  ['Using it in an ad, a paid course or a sponsored post', 'High', 'Get written permission or a licence first'],
];

export function RepostRules() {
  return (
    <>
      <p>
        Short answer: you can use the repost button on Threads whenever you like, and you need permission for almost everything else. Being able to save a video doesn&apos;t
        give you the right to publish it again, and that catches a lot of people out, since a download tool makes both feel equally easy.
      </p>
      <p>
        This is a plain-language guide. It isn&apos;t legal advice, and rules differ between countries. If real money or a real dispute is involved, talk to a lawyer.
      </p>

      <h2>Who owns a Threads video</h2>
      <p>
        Whoever made it, in most cases. Copyright generally applies automatically when a video is recorded, so the creator doesn&apos;t have to register anything or add a notice. A
        clip with no &copy; symbol is still protected, and a post that anyone can view is still owned by the person who made it.
      </p>
      <p>
        When someone posts on a Meta app, they keep ownership and give Meta a licence to host and show the content. That licence is an agreement between them and Meta. Courts
        have argued over how far licences like this reach to other people, and the results depend on the wording and the facts, so don&apos;t build a plan around them.
      </p>
      <p>
        There can be more than one owner. A clip of someone dancing to a hit song involves the person who filmed it and the people who own the music. A creator giving you the
        go-ahead for the video can&apos;t clear the song for you.
      </p>

      <h2>What about credit?</h2>
      <p>
        Tagging the creator is good manners. It isn&apos;t a licence. &ldquo;Credit to the owner&rdquo; and &ldquo;no copyright intended&rdquo; in a caption have no legal effect, and they tell
        anyone reading that you knew the clip wasn&apos;t yours.
      </p>

      <h2>How risky is each use?</h2>
      <p>This is our rough reading, and it isn&apos;t a rule. A creator can object to anything public, and a song can get a post removed even if the creator is happy.</p>
      <Table caption="Common uses of a saved Threads video and how risky they are" head={['What you want to do', 'Risk', 'Why']} rows={USES} />

      <h2>Does fair use cover it?</h2>
      <p>
        Sometimes, if US law applies. Fair use is a US defence that a court weighs case by case, under{' '}
        <a href="https://www.copyright.gov/title17/92chap1.html#107" rel="noopener noreferrer" target="_blank">
          four factors
        </a>
        : why and how you used the work, what kind of work it is, how much of it you took, and how your use affects the market for the original.
      </p>
      <p>
        A short clip inside a video that criticises or teaches about it has a reasonable argument. Reposting the entire video because it&apos;s funny has a weak one. Other countries
        work differently. India and the UK, for example, use a narrower idea called fair dealing, limited to specific purposes.
      </p>

      <h2>Asking takes one minute</h2>
      <p>Be specific about what you want, and make it easy to say yes or no. You can copy this and adjust it:</p>
      <Callout title="A message you can send">
        <p>
          Hi! I loved your video about [topic]. Would you mind if I shared it on my [Threads / Instagram / website]? I&apos;d credit you as @[username] and link back to your post.
          I won&apos;t edit it or use it in any ads. If you&apos;d rather I didn&apos;t, no problem at all.
        </p>
      </Callout>
      <p>
        Keep the reply. A screenshot is enough for a casual repost. For anything commercial, get it in writing with the details spelled out: which video, where it will run, and for
        how long. If you hear nothing, treat that as a no.
      </p>

      <h2>What happens if you get it wrong</h2>
      <p>
        Usually a takedown. The owner reports the post, the platform removes it, and your account may pick up a strike. Repeat strikes can cost you the account. Money becomes a
        real possibility once a clip is used commercially, since that is where a rights holder has a clear loss to point at.
      </p>
      <p>
        If someone asks you to take a clip down, do it straight away and thank them. That often ends the matter. And if you are the creator and someone has
        reposted your video, report it to the platform where it appears. Our <Link href="/dmca/">copyright page</Link> explains how to contact us too.
      </p>
      <p>
        Saving a clip for yourself is a separate question, and it is covered in our <Link href="/terms-of-service/">terms</Link>. To keep a copy of work that is yours, see{' '}
        <Link href="/blog/back-up-your-threads-posts/">how to back up your own Threads posts</Link>.
      </p>
    </>
  );
}
