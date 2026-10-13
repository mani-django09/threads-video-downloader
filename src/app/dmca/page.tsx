import type { Metadata } from 'next';
import { LegalPage, CONTACT_EMAIL, type LegalSection } from '@/components/LegalPage';
import { absoluteUrl } from '@/lib/site';

const PATH = '/dmca/';

export const metadata: Metadata = {
  title: 'DMCA & Copyright Policy',
  description:
    'How to send a copyright takedown notice to Threads Downloader, what it must contain, how we respond, how to file a counter-notice and our repeat-infringer policy.',
  alternates: { canonical: absoluteUrl(PATH) },
};

const sections: LegalSection[] = [
  {
    id: 'our-position',
    title: 'Our position on copyright',
    body: (
      <>
        <p>
          We respect creators&apos; rights and expect visitors to as well. Threads Downloader does not host, store or index any video, photo or GIF. When a visitor
          pastes the address of a public Threads post, our server reads that public page and the visitor&apos;s browser then receives the file straight from the
          original content network, or through our server in memory for the length of the transfer. We keep no copy and have no library of saved media.
        </p>
        <p>
          That matters for takedowns: the content itself lives on Threads/Instagram, and only removal there takes it off the internet. We still act on valid notices
          for our own service, as described below.
        </p>
      </>
    ),
  },
  {
    id: 'report-at-source',
    title: 'Start at the source',
    body: (
      <p>
        If your work is posted on Threads without permission, the fastest and most complete remedy is to report it to Meta through the reporting tools in the app or
        its copyright form. Once a post is removed or made private, our tool can no longer read it, and every other tool that depends on public posts stops
        working for it too.
      </p>
    ),
  },
  {
    id: 'send-a-notice',
    title: 'Sending us a takedown notice',
    body: (
      <>
        <p>
          If you are a copyright owner, or are authorised to act for one, and you believe our service is being used to copy your work in a way that infringes, email{' '}
          <a href={`mailto:${CONTACT_EMAIL}?subject=Copyright%20notice`}>{CONTACT_EMAIL}</a> with the subject &ldquo;Copyright notice&rdquo; and include, as required by 17
          U.S.C. &sect; 512(c)(3):
        </p>
        <ol>
          <li>Your physical or electronic signature (a typed full name is acceptable).</li>
          <li>Identification of the copyrighted work you say has been infringed, with a link to an authorised copy where possible.</li>
          <li>The exact address of each Threads post involved, so we can find it.</li>
          <li>Your name, postal address, telephone number and email address.</li>
          <li>A statement that you have a good-faith belief that the use is not authorised by the copyright owner, its agent or the law.</li>
          <li>A statement, made under penalty of perjury, that the information in the notice is accurate and that you are the owner or authorised to act for the owner.</li>
        </ol>
        <p>
          Notices that omit these items, or that are not about our service, may not be actionable and we may ask for the missing detail. Please do not send
          requests to remove a post from Threads itself; we cannot do that.
        </p>
      </>
    ),
  },
  {
    id: 'what-we-do',
    title: 'What we do when we get a valid notice',
    body: (
      <>
        <ul>
          <li>We acknowledge the notice, normally within three business days.</li>
          <li>We block the post addresses you identified (and the owner&apos;s account, if you ask and it is justified) from being looked up or downloaded through our service.</li>
          <li>We may pass a copy of the notice, with your contact details removed where possible, to the person whose use is affected, and we record the action taken.</li>
        </ul>
        <p>We may also act without a notice if we become aware of clear infringement or of a post that should not be processed.</p>
      </>
    ),
  },
  {
    id: 'counter-notice',
    title: 'Counter-notice',
    body: (
      <>
        <p>
          If you believe a post was blocked by mistake or misidentification, you can send a counter-notice to the same address. It must contain your signature, the
          identification of the blocked material and where it appeared, a statement under penalty of perjury that you believe in good faith it was blocked by mistake
          or misidentification, your name, address and telephone number, and a statement that you consent to the jurisdiction of the federal court for your address
          (or, outside the United States, any judicial district in which we may be found).
        </p>
        <p>
          We will forward it to the person who sent the original notice. Unless they tell us within ten business days that they have started court action, we may
          restore access.
        </p>
      </>
    ),
  },
  {
    id: 'repeat-infringers',
    title: 'Repeat infringers',
    body: (
      <p>
        Addresses repeatedly named in valid notices, or that we find abusing the service to copy protected work, are blocked from the tool, and the block is not lifted
        on request.
      </p>
    ),
  },
  {
    id: 'false-claims',
    title: 'False claims',
    body: (
      <p>
        Under 17 U.S.C. &sect; 512(f), anyone who knowingly misrepresents that material is infringing, or that it was removed by mistake, can be liable for damages,
        including costs and legal fees. Please check that your notice is accurate, and consider whether the use might be permitted (for example as fair use) before
        sending one.
      </p>
    ),
  },
  {
    id: 'other-laws',
    title: 'Outside the United States',
    body: (
      <p>
        We take notices of infringement under other countries&apos; laws seriously too. Send them to the same address with the same details and the law you are relying
        on, and we will handle them in good faith.
      </p>
    ),
  },
];

export default function DmcaPage() {
  return (
    <LegalPage
      path={PATH}
      title="DMCA & Copyright Policy"
      summary="We host no media: every file comes from Threads itself. Report infringing posts to Meta to remove them everywhere. If you also want our tool to stop processing a post, send a notice to our copyright address with the details listed below and we will block it."
      sections={sections}
    />
  );
}
