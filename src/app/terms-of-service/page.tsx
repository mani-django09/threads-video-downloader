import type { Metadata } from 'next';
import { LegalPage, CONTACT_EMAIL, type LegalSection } from '@/components/LegalPage';
import { absoluteUrl } from '@/lib/site';

const PATH = '/terms-of-service/';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'The rules for using Threads Downloader: what you may save, what is not allowed, how we handle abuse and copyright, and the limits of our responsibility.',
  alternates: { canonical: absoluteUrl(PATH) },
};

const sections: LegalSection[] = [
  {
    id: 'agreement',
    title: 'Agreement to these terms',
    body: (
      <p>
        These terms form an agreement between you and Threads Downloader (&ldquo;we&rdquo;, &ldquo;the Service&rdquo;), the website at threadsdl.io and its tools. By
        opening the site or using the downloader you accept them, together with our <a href="/privacy-policy/">Privacy Policy</a>. If you do not agree, please do not
        use the Service. You must be old enough to form a binding agreement where you live, or have a parent or guardian who accepts on your behalf.
      </p>
    ),
  },
  {
    id: 'what-the-service-does',
    title: 'What the Service does',
    body: (
      <p>
        The Service reads the public web page of a Threads post whose address you paste in, finds the video, photo or GIF that the post already shows to anyone
        without logging in, and lets you save a copy to your own device. It does not log in to anyone&apos;s account, open private profiles, remove watermarks,
        or get around any technical protection.
      </p>
    ),
  },
  {
    id: 'permitted-use',
    title: 'Permitted use',
    body: (
      <>
        <p>You may use the Service for lawful, personal, non-commercial purposes, for example:</p>
        <ul>
          <li>saving your own posts or media you have created;</li>
          <li>keeping a copy of something for offline viewing;</li>
          <li>saving content with the creator&apos;s permission, or content that is licensed for reuse;</li>
          <li>private study, commentary or criticism that is allowed under the copyright rules where you live.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'prohibited-use',
    title: 'What you must not do',
    body: (
      <ul>
        <li>Download, copy, re-upload or sell someone else&apos;s content without the right to do so, or pass it off as your own.</li>
        <li>Use the Service to harass, impersonate or endanger anyone, or to collect media of a person in order to do so.</li>
        <li>Try to reach private, deleted or restricted content, or to bypass logins, age gates, paywalls or any access control.</li>
        <li>Send automated, bulk or scripted requests, scrape the site, or resell access to the Service.</li>
        <li>Probe, overload or attack the Service, its network or other users, including attempts to make it fetch internal or private addresses.</li>
        <li>Break the law, or the terms of Threads or Instagram, through your use of the Service.</li>
      </ul>
    ),
  },
  {
    id: 'your-responsibility',
    title: 'Your responsibility for what you save',
    body: (
      <p>
        Everything you save belongs to its creator or their licensors. You alone are responsible for deciding whether you have the right to download, keep, share
        or republish it, and for following copyright, privacy, publicity and other laws. Saving a video does not give you a licence to reuse it. If you are unsure,
        ask the creator.
      </p>
    ),
  },
  {
    id: 'ownership',
    title: 'Ownership',
    body: (
      <>
        <p>
          We do not host the content you save and make no claim to it; all rights stay with the original creator. The site&apos;s own design, text, code and brand are
          ours or used under licence, and you may not copy them without permission, apart from sharing a link to a page or quoting a short excerpt with credit.
        </p>
        <p>
          &ldquo;Threads&rdquo;, &ldquo;Instagram&rdquo; and &ldquo;Meta&rdquo; are trademarks of their owners. We use the names only to describe what the tool works with.
        </p>
      </>
    ),
  },
  {
    id: 'copyright',
    title: 'Copyright complaints',
    body: (
      <p>
        We respond to valid copyright notices and end access for repeat infringers where appropriate. How to send a notice, and how to dispute one, is explained on
        our <a href="/dmca/">DMCA &amp; copyright page</a>.
      </p>
    ),
  },
  {
    id: 'availability',
    title: 'Availability and changes to the Service',
    body: (
      <p>
        The Service is free and depends on how Threads currently presents public posts, which can change without notice. We may change, pause or remove any feature,
        and we do not promise that every public post can be saved or that the Service will always be available. We try to fix breakages quickly, but we owe you no
        particular uptime.
      </p>
    ),
  },
  {
    id: 'rate-limits',
    title: 'Rate limits and blocking',
    body: (
      <p>
        To keep the Service fast for everyone we limit how many requests one address can make. We may slow down, temporarily block or permanently block any address
        that breaches these terms, shows signs of automated or abusive use, or is the subject of a valid legal complaint, with or without notice.
      </p>
    ),
  },
  {
    id: 'ads-and-links',
    title: 'Advertising and third-party links',
    body: (
      <p>
        The Service is supported by advertising, and some pages link to other websites. We do not control or endorse third-party sites or ads and are not responsible
        for them; their own terms and privacy policies apply when you use them. Please report an ad that looks misleading or inappropriate via the{' '}
        <a href="/contact/">Contact page</a>.
      </p>
    ),
  },
  {
    id: 'warranty',
    title: 'No warranty',
    body: (
      <p>
        The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;. To the fullest extent the law allows, we disclaim all warranties, express or implied,
        including that the Service will be uninterrupted, error-free, accurate, or fit for a particular purpose, or that the files you save will be free of defects.
      </p>
    ),
  },
  {
    id: 'liability',
    title: 'Limit of liability',
    body: (
      <>
        <p>
          To the fullest extent the law allows, we are not liable for any indirect, incidental, special or consequential loss, or for loss of data, profits or
          reputation, arising from your use of, or inability to use, the Service or any content you save. Because the Service is free, our total liability for any
          claim is limited to one hundred US dollars (USD 100).
        </p>
        <p>
          Nothing in these terms excludes liability that cannot be excluded by law, such as for fraud or for death or personal injury caused by negligence, nor
          removes consumer rights you have under your local law.
        </p>
      </>
    ),
  },
  {
    id: 'indemnity',
    title: 'If a claim is made because of how you used the Service',
    body: (
      <p>
        If a third party brings a claim against us because you saved, copied or shared content in breach of these terms or the law, you agree to cover our reasonable
        costs of dealing with it, to the extent the law permits.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to these terms',
    body: (
      <p>
        We may update these terms as the Service or the law changes. The &ldquo;last updated&rdquo; date above shows the current version, and continuing to use the
        Service after a change means you accept it.
      </p>
    ),
  },
  {
    id: 'general',
    title: 'General',
    body: (
      <p>
        If any part of these terms is found unenforceable, the rest stays in force. Failing to enforce a term is not a waiver of it. These terms and the documents
        they refer to are the whole agreement between you and us about the Service. Questions? Write to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      path={PATH}
      title="Terms of Service"
      summary="Use Threads Downloader for lawful, personal purposes, only on public posts, and only for content you have the right to save. Do not abuse it, scrape it or bypass anything. We do not host or own the media, the tool is provided as-is, and you are responsible for how you use what you save."
      sections={sections}
    />
  );
}
