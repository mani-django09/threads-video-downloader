import type { Metadata } from 'next';
import { LegalPage, CONTACT_EMAIL, type LegalSection } from '@/components/LegalPage';
import { absoluteUrl } from '@/lib/site';

const PATH = '/about/';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Who runs Threads Downloader, why it exists, how the tool works, how we keep our guides accurate, how the site is funded and how to hold us to our standards.',
  alternates: { canonical: absoluteUrl(PATH) },
};

const sections: LegalSection[] = [
  {
    id: 'what-we-are',
    title: 'What Threads Downloader is',
    body: (
      <>
        <p>
          Threads Downloader is a free web tool that lets you save videos, photos and GIFs from public Threads posts to your phone or computer. You paste the link to a
          post, the tool finds the media that post already shows to anyone, and you choose a quality and save it. There is nothing to install, and you do not sign in with us
          or with Threads.
        </p>
        <p>
          It is built and maintained by a small independent team. We are not part of, or endorsed by, Meta, Instagram or Threads. Our <a href="/disclaimer/">disclaimer</a>{' '}
          says so plainly.
        </p>
      </>
    ),
  },
  {
    id: 'why',
    title: 'Why we built it',
    body: (
      <p>
        People save Threads posts for ordinary reasons: a recipe video they want to cook from offline, a clip of their own they need back, a talk they want to rewatch on a
        flight, a photo of their work they posted months ago. The app gives no obvious way to do that, and many of the tools that fill the gap are cluttered, push you to
        install something, or hide what they do with your data. We wanted one that is quick on a phone, explains itself, and is honest about its limits.
      </p>
    ),
  },
  {
    id: 'how-it-works',
    title: 'How it works',
    body: (
      <>
        <ol>
          <li>You paste a Threads post link. We first check it really is a Threads address and refuse anything else.</li>
          <li>Our server reads the public post page, the same page any visitor can open, to find the media address and a preview. It never logs in to an account.</li>
          <li>You pick a quality and press save. The file comes to your device from Threads&apos; own servers, passing through ours in memory when needed, and is never stored.</li>
        </ol>
        <p>
          Because the tool only reads public pages, it cannot save private posts, and when a post has no downloadable media it tells you so rather than failing silently. We
          explain the details in our <a href="/how-to-download-threads-videos/">step-by-step guide</a> and answer common questions in the <a href="/faq/">FAQ</a>.
        </p>
      </>
    ),
  },
  {
    id: 'standards',
    title: 'Our standards',
    body: (
      <>
        <p>These are commitments we hold ourselves to, and you are welcome to hold us to them:</p>
        <ul>
          <li>
            <strong>Accuracy.</strong> Guides describe what the tool actually does today. When Threads changes something that makes a step wrong, we re-test the tool and
            correct the page, and update its &ldquo;last updated&rdquo; date.
          </li>
          <li>
            <strong>Honesty about limits.</strong> We say what will not work (private posts, posts with no media, expired links) instead of promising everything.
          </li>
          <li>
            <strong>Respect for creators.</strong> We encourage saving only what you have the right to use, we credit creators in our guidance, and we act quickly on valid
            copyright notices (see our <a href="/dmca/">DMCA policy</a>).
          </li>
          <li>
            <strong>Privacy by restraint.</strong> We keep only what we need to run and secure the site, for 90 days, and say exactly what that is in the{' '}
            <a href="/privacy-policy/">Privacy Policy</a>. We never ask for your Threads password.
          </li>
          <li>
            <strong>Independent content.</strong> Nobody pays us to rank, review or recommend anything, and advertising never changes what a guide says.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'security',
    title: 'Safety and abuse',
    body: (
      <p>
        We protect the site and its visitors with HTTPS, request limits, and checks that stop the tool being tricked into fetching anything other than public Threads media.
        Addresses that attack or scrape the service can be blocked. We do this to keep the tool fast and available for everyone, and the data involved is described in full
        in our privacy policy.
      </p>
    ),
  },
  {
    id: 'funding',
    title: 'How the site is funded',
    body: (
      <p>
        The tool is free. Running it costs real money (servers, bandwidth, domains and development time), which we cover with advertising shown on some pages. Ads are
        labelled, kept apart from the downloader so they cannot be confused with a save button, and served by third parties who set their own cookies, as explained in the
        privacy policy. We do not charge for downloads, sell your data, or accept paid placement.
      </p>
    ),
  },
  {
    id: 'corrections',
    title: 'Corrections and feedback',
    body: (
      <>
        <p>
          If something on the site is wrong, unclear or out of date, or the tool failed on a public post it should have handled, tell us. Every report is read by a person, and
          confirmed errors are corrected and noted on the page.
        </p>
        <p>
          Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, or use the <a href="/contact/">contact page</a> for the right subject line. We reply within three
          business days.
        </p>
      </>
    ),
  },
];

export default function AboutPage() {
  return (
    <LegalPage
      path={PATH}
      title="About Threads Downloader"
      schemaType="AboutPage"
      summary="Threads Downloader is a free, independent tool for saving public Threads videos, photos and GIFs. It reads only public pages, stores none of your media, and is funded by labelled advertising. Here is who we are, how it works and the standards we hold ourselves to."
      sections={sections}
    />
  );
}
