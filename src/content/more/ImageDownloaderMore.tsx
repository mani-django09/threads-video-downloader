import Link from 'next/link';
import { CardSection, Callout, Section, Table } from '@/components/ContentKit';

const WORKFLOWS = [
  {
    title: 'Designers and illustrators',
    text: 'You keep a private board of layouts, colour palettes and lettering you want to learn from. Saved at full size you can zoom in on the detail, which a screenshot of a phone screen rarely lets you do.',
  },
  {
    title: 'Small business owners',
    text: 'A customer posts a photo of your product in use. With their permission, a saved copy can go into a testimonial or a thank-you message, credited to them.',
  },
  {
    title: 'Event-goers',
    text: 'Venues and organisers post timetables, floor plans and menus as pictures. Saving them means you can still read the schedule when the venue Wi-Fi gives up.',
  },
  {
    title: 'Students and note-takers',
    text: 'A lecturer or author shares a diagram or a slide. A copy on your device can sit next to your notes, with the post link written underneath so you can cite it.',
  },
];

const METHODS = [
  ['Screenshot', 'Your screen resolution, with the app interface around the photo unless you crop it', 'Fast, but you lose detail and have to crop'],
  ['Long-press / “Save image” in the app', 'Depends on what the app offers, and not every post allows it', 'Convenient when it exists, and not always there'],
  ['Threads Downloader', 'The picture file Threads stores, with nothing around it', 'Paste a link and save it as a JPG'],
];

export function ImageDownloaderMore() {
  return (
    <>
      <Section eyebrow="Getting it right" title="What “full size” really means">
        <p>
          When we say a photo is saved at full size, we mean the largest version of that picture that Threads has stored and shows to the public. We do not stretch it or
          sharpen it. That is a useful distinction, because there are three different sizes in play every time you look at a photo online:
        </p>
        <ul>
          <li>
            <strong>The original the person took.</strong> This may be many megapixels, and only they have it.
          </li>
          <li>
            <strong>The version Threads stores.</strong> It is resized and compressed so pages open quickly. This is the one you can download.
          </li>
          <li>
            <strong>The size you see on screen.</strong> Smaller still, because it has to fit your phone. Zooming in does not change the file; it just enlarges it.
          </li>
        </ul>
        <p>
          So a download will usually look sharper than a screenshot of the same post, but it will never be quite the camera original. If a picture matters enough that
          you need that original, such as for printing, ask the person who posted it. Most people are glad to be asked.
        </p>
        <Callout title="Printing? Check before you do.">
          <p>
            A picture that looks fine on a phone can look soft on paper. As a rule of thumb, photos meant for a poster or a large print need to be far bigger than the
            ones Threads stores. A small print or a photo book is more forgiving.
          </p>
        </Callout>
      </Section>

      <Section eyebrow="Choosing a method" title="Screenshot, in-app save or a downloader?">
        <p>Each way of keeping a photo has its place. The honest summary:</p>
        <Table caption="Ways to save a Threads photo compared" head={['Method', 'What you get', 'Trade-off']} rows={METHODS} />
        <p>
          If you only need to remember what a photo looked like, a screenshot is fine. If you want the picture itself, to open in an editor, add to a document or print, a
          proper file is worth the extra few seconds.
        </p>
      </Section>

      <CardSection
        eyebrow="Putting saved photos to use"
        title="How different people use them."
        intro="The tool is the same for everyone, but the reasons vary a lot. These are some of the sensible ones."
        items={WORKFLOWS}
        footnote="In every case the sensible rule is the same: saved for your own use is simple, and anything public needs the photographer's say-so."
      />

      <Section eyebrow="Before you reuse a photo" title="A short checklist">
        <p>
          Saving a picture takes a second. Deciding what you can do with it takes a little more thought. Run through these before the photo goes anywhere public:
        </p>
        <ol>
          <li>
            <strong>Who took it?</strong> The account that posted a picture is not always the person who made it. If the post credits someone else, they are the one to
            ask.
          </li>
          <li>
            <strong>Is there a person in it?</strong> People have a say in how their face is used, particularly in ads, or with children. A public post does not mean everyone
            in it agreed to be republished.
          </li>
          <li>
            <strong>Is it a screenshot of someone else&apos;s work?</strong> Pictures of artwork, products or other posts can carry the original creator&apos;s rights too.
          </li>
          <li>
            <strong>Will you earn money from it?</strong> If the answer is yes, even indirectly, get written permission or use a properly licensed image instead.
          </li>
          <li>
            <strong>Can you give credit?</strong> Name the creator and link the original post. It is the minimum, not a substitute for permission.
          </li>
        </ol>
        <p>
          The details differ between countries, so none of this is legal advice. Our <Link href="/disclaimer/">disclaimer</Link> and{' '}
          <Link href="/terms-of-service/">terms</Link> explain our own position.
        </p>
      </Section>

      <Section eyebrow="Keeping order" title="Building a photo collection you can search later">
        <p>
          A hundred files all named after post IDs are no use to anyone. A tiny bit of discipline when you save pays off:
        </p>
        <ul>
          <li>
            <strong>Make a folder per project or theme</strong>, such as &ldquo;Kitchen ideas&rdquo; or &ldquo;Conference slides&rdquo;, instead of one big pile.
          </li>
          <li>
            <strong>Write the source next to it.</strong> A notes file with the post link and the creator&apos;s handle means you can credit or ask permission months later.
          </li>
          <li>
            <strong>Keep any alt text or caption.</strong> If the post describes the picture, copy that text too. It is useful for accessibility, and for remembering why you
            saved it.
          </li>
          <li>
            <strong>Delete duplicates and near-misses.</strong> Save the one you need, not every version.
          </li>
        </ul>
        <p>
          For posts that mix media, such as a photo and a short clip, the tool recognises the kind of file for each link you paste. If you want the clip, the{' '}
          <Link href="/threads-video-downloader/">video downloader</Link> and the <Link href="/threads-gif-downloader/">GIF downloader</Link> use the same box.
        </p>
      </Section>
    </>
  );
}
