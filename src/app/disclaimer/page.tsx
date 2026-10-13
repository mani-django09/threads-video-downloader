import type { Metadata } from 'next';
import { LegalPage, CONTACT_EMAIL, type LegalSection } from '@/components/LegalPage';
import { absoluteUrl } from '@/lib/site';

const PATH = '/disclaimer/';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description:
    'Threads Downloader is an independent tool, not affiliated with Meta, Instagram or Threads. Read what the tool can and cannot do, who owns the media, and where our responsibility ends.',
  alternates: { canonical: absoluteUrl(PATH) },
};

const sections: LegalSection[] = [
  {
    id: 'independent',
    title: 'Independent and unaffiliated',
    body: (
      <p>
        Threads Downloader is an independent website. It is not affiliated with, authorised, maintained, sponsored or endorsed by Meta Platforms, Inc., Instagram,
        or the Threads app. &ldquo;Threads&rdquo;, &ldquo;Instagram&rdquo; and &ldquo;Meta&rdquo; are trademarks of their respective owners and appear here only to
        say what our tool is compatible with.
      </p>
    ),
  },
  {
    id: 'public-only',
    title: 'Public content only',
    body: (
      <p>
        The tool only works with posts that anyone can open without signing in. It does not access private accounts, log in on your behalf, ask for your password,
        or defeat any technical protection. If a post is private, deleted or restricted, the tool will say it cannot be saved. That is by design.
      </p>
    ),
  },
  {
    id: 'content-ownership',
    title: 'Who owns the content',
    body: (
      <>
        <p>
          Videos, photos, GIFs, captions and usernames you see through the tool belong to the people who made them. We do not host, copy, republish or claim any of it,
          and a file you save is a copy delivered to your device from Threads.
        </p>
        <p>
          Having a file on your device does not give you the right to repost, sell, edit or use it commercially. Where you are unsure, ask the creator, give credit, and
          follow the copyright rules of your country. Our <a href="/terms-of-service/">Terms of Service</a> set out what is and is not permitted.
        </p>
      </>
    ),
  },
  {
    id: 'no-guarantee',
    title: 'No guarantee that it will work',
    body: (
      <p>
        Threads can change how it publishes media at any time, and when it does, the tool may fail until we adjust it. Some public posts cannot be processed, for
        example if they have no downloadable media, have expired, or are blocked in our region. Quality and file size depend on what Threads serves for that post, so
        we cannot promise a particular resolution. We provide the tool without warranty of any kind.
      </p>
    ),
  },
  {
    id: 'informational',
    title: 'Information on this site',
    body: (
      <p>
        Our guides and FAQ are written for general information about saving public Threads media on common devices. They are not legal, copyright or professional
        advice, and settings and screens in other companies&apos; apps change, so a step may look slightly different on your device. We review and correct guides
        when we find they are out of date; to report a mistake, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    ),
  },
  {
    id: 'advertising',
    title: 'Advertising',
    body: (
      <p>
        We earn money from advertising shown on the site, which pays for hosting and development and keeps the tool free. Advertisers do not influence what our guides say
        or how the tool works. We do not accept payment to review, rank or recommend anything, and we are not responsible for the content of ads or the sites they
        lead to.
      </p>
    ),
  },
  {
    id: 'external-links',
    title: 'External links',
    body: (
      <p>
        Pages may link to websites we do not run. We include a link when we think it is useful, but we do not control those sites and are not responsible for their
        content, accuracy or privacy practices.
      </p>
    ),
  },
  {
    id: 'liability',
    title: 'Limit of responsibility',
    body: (
      <p>
        You use the tool at your own risk. To the extent the law allows, we are not liable for loss or damage arising from the tool, from content you save with it, or
        from relying on information on this site. This does not limit any right you have that cannot be excluded by law.
      </p>
    ),
  },
];

export default function DisclaimerPage() {
  return (
    <LegalPage
      path={PATH}
      title="Disclaimer"
      summary="We are an independent site and have no connection to Meta, Instagram or Threads. The tool works only on public posts, the media belongs to its creators, and you are responsible for how you use what you save. We cannot promise it works for every post, every time."
      sections={sections}
    />
  );
}
