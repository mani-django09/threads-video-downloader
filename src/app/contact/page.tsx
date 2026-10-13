import type { Metadata } from 'next';
import { LegalPage, CONTACT_EMAIL, type LegalSection } from '@/components/LegalPage';
import { absoluteUrl } from '@/lib/site';

const PATH = '/contact/';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Email the Threads Downloader team for help with a download, a copyright notice, a privacy request, a correction or a business enquiry. We reply within three business days.',
  alternates: { canonical: absoluteUrl(PATH) },
};

const TOPICS: Array<{ topic: string; subject: string; use: string }> = [
  { topic: 'Help with a download', subject: 'Help', use: 'A link will not load, a file will not save, or the result looks wrong.' },
  { topic: 'Copyright notice', subject: 'Copyright notice', use: 'You own a work and want our tool to stop processing a post. See the DMCA page first.' },
  { topic: 'Privacy request', subject: 'Privacy request', use: 'Access to or deletion of data we hold about you.' },
  { topic: 'Correction', subject: 'Correction', use: 'A guide, FAQ answer or policy that is wrong or out of date.' },
  { topic: 'Ads and partnerships', subject: 'Business', use: 'Report a bad ad, or ask about working with us.' },
];

const sections: LegalSection[] = [
  {
    id: 'email',
    title: 'How to reach us',
    body: (
      <>
        <p>The quickest way, and the only one we monitor, is email:</p>
        <p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-lg font-semibold">
            {CONTACT_EMAIL}
          </a>
        </p>
        <p>
          A person on the Threads Downloader team reads every message. We usually reply within three business days, and sooner for broken downloads or copyright
          notices. We do not offer phone or live-chat support.
        </p>
      </>
    ),
  },
  {
    id: 'topics',
    title: 'What to write about',
    body: (
      <>
        <p>Putting the topic in the subject line sends your message to the right place first:</p>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="bg-brand-soft/70 text-[11px] font-bold uppercase tracking-[0.1em] text-ink-3">
                <th className="px-4 py-3">Topic</th>
                <th className="px-4 py-3">Subject line</th>
                <th className="px-4 py-3">Use it for</th>
              </tr>
            </thead>
            <tbody>
              {TOPICS.map((t) => (
                <tr key={t.topic} className="border-t border-line align-top">
                  <td className="px-4 py-3 font-semibold text-ink">{t.topic}</td>
                  <td className="px-4 py-3 text-ink-2">&ldquo;{t.subject}&rdquo;</td>
                  <td className="px-4 py-3 text-ink-2">{t.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    id: 'download-help',
    title: 'Getting faster help with a download',
    body: (
      <>
        <p>Before writing, the <a href="/faq/">FAQ</a> covers the most common problems (private posts, posts without video, expired links). If it is still stuck, include:</p>
        <ul>
          <li>the full Threads post link you pasted (the post must be public);</li>
          <li>your device and browser, for example &ldquo;iPhone, Safari&rdquo; or &ldquo;Windows, Chrome&rdquo;;</li>
          <li>the exact message the tool showed, or a screenshot of it;</li>
          <li>roughly when it happened, so we can find it in our logs.</li>
        </ul>
        <p>Please never send us your Threads password, a login code or payment details. We will never ask for them.</p>
      </>
    ),
  },
  {
    id: 'what-we-cannot-do',
    title: 'What we cannot help with',
    body: (
      <p>
        We are not Threads, Instagram or Meta, so we cannot restore accounts, remove posts from Threads, or recover deleted content. To remove a post you do not want
        online, report it to Meta directly. We also cannot save private posts, because the tool only works with public ones.
      </p>
    ),
  },
  {
    id: 'press',
    title: 'Press and partnerships',
    body: (
      <p>
        Write to the same address with the subject &ldquo;Business&rdquo; and a few lines about what you have in mind. Please note that we do not sell guest posts or
        paid links.
      </p>
    ),
  },
];

export default function ContactPage() {
  return (
    <LegalPage
      path={PATH}
      title="Contact Us"
      schemaType="ContactPage"
      summary="Email support@threadsdl.io with a clear subject line. A real person replies within three business days. For download problems include your post link, device and the message you saw. Never send passwords."
      sections={sections}
    />
  );
}
