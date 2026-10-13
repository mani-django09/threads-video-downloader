import type { Metadata } from 'next';
import { LegalPage, CONTACT_EMAIL, type LegalSection } from '@/components/LegalPage';
import { absoluteUrl } from '@/lib/site';

const PATH = '/privacy-policy/';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Exactly what Threads Downloader records when you use it (IP address, device, source, download outcomes), why, who can see it, how long it is kept and how to ask for deletion.',
  alternates: { canonical: absoluteUrl(PATH) },
};

const sections: LegalSection[] = [
  {
    id: 'who-we-are',
    title: 'Who we are and scope',
    body: (
      <>
        <p>
          Threads Downloader (&ldquo;we&rdquo;, &ldquo;us&rdquo;) runs the website at threadsdl.io, a free tool that helps you save publicly visible videos, photos
          and GIFs from Threads posts. This policy explains what personal data we handle when you visit the site or use the tool. It covers threadsdl.io and
          nothing else; Threads, Instagram and Meta have their own policies for their own services.
        </p>
        <p>
          We are an independent site and are not affiliated with Meta Platforms, Inc. For privacy questions, write to{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </>
    ),
  },
  {
    id: 'what-we-collect',
    title: 'What we collect',
    body: (
      <>
        <p>We keep a first-party activity log so we can keep the service working, spot abuse and see which pages and features are useful. Each log entry can contain:</p>
        <ul>
          <li>
            <strong>Your IP address</strong>, stored in plain form together with the event (see the next section).
          </li>
          <li>
            <strong>An anonymous visitor ID</strong>: a short code made by running your IP address and browser type through a one-way salted hash. It lets us
            group one visitor&apos;s activity; it cannot be turned back into an IP address or a name.
          </li>
          <li>
            <strong>Device details</strong>: device type, browser and operating system, worked out from your browser&apos;s user-agent. The raw user-agent string is
            not stored.
          </li>
          <li>
            <strong>How you arrived</strong>: the host name of the website that sent you (for example a search engine or a social network, never the full address
            or search words) and any <code>utm_source</code>, <code>utm_medium</code> or <code>utm_campaign</code> values in the link you followed.
          </li>
          <li>
            <strong>What you did</strong>: pages viewed, whether you pasted a link, whether the lookup worked, and whether a download completed, failed or was
            cancelled, with timings, file size, media type and an error code if something went wrong.
          </li>
          <li>
            <strong>The public post you looked up</strong>: its post ID and the public username of its author. We do not store the post text, and we never store
            the video, photo or GIF itself.
          </li>
        </ul>
        <p>
          We never ask for, and do not collect, your Threads or Instagram username, password, cookies or any account credentials, and you do not need an account
          with us to use the tool.
        </p>
      </>
    ),
  },
  {
    id: 'ip-addresses',
    title: 'IP addresses',
    body: (
      <>
        <p>Your IP address is stored with each activity-log entry. We use it for four purposes:</p>
        <ul>
          <li>security and abuse prevention, including rate limiting and spotting automated scraping;</li>
          <li>letting the site administrator block an address that is attacking or overloading the service;</li>
          <li>counting distinct visitors accurately, so we can see whether the site is actually helping people;</li>
          <li>diagnosing a specific problem when someone reports one.</li>
        </ul>
        <p>
          IP addresses are only visible to the site administrator behind a password-protected dashboard. They are never sold, rented or shared with advertisers.
          They are deleted automatically with the rest of the log after 90 days. An address the administrator has blocked is kept on a block list until it is
          removed from that list, because deleting it would immediately undo the block.
        </p>
      </>
    ),
  },
  {
    id: 'legal-basis',
    title: 'Why we may process this data',
    body: (
      <>
        <p>
          If you are in the European Economic Area, the United Kingdom or Switzerland, our legal basis for the activity log is <strong>legitimate interests</strong>
          : running a secure, working service and understanding how it is used, in a way that has a small impact on you. Where advertising or analytics cookies
          need your consent, we rely on your <strong>consent</strong>, which you can withdraw at any time through your browser or the cookie choices described below.
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies and similar storage',
    body: (
      <>
        <ul>
          <li>
            <strong>Session storage.</strong> To tell the first page of a visit from later pages, the site writes a short flag in your browser&apos;s session
            storage. It disappears when you close the tab and is never sent to us as a cookie.
          </li>
          <li>
            <strong>Google Analytics 4.</strong> Sets its own cookies to tell visits apart (see the next section).
          </li>
          <li>
            <strong>Advertising cookies.</strong> If ads are shown, Google and its partners may set cookies (see Advertising).
          </li>
          <li>
            <strong>Administrator cookie.</strong> A short-lived, signed, HTTP-only cookie keeps the administrator logged in to the private dashboard. Visitors never
            receive it.
          </li>
        </ul>
        <p>The downloader itself does not use cookies to follow you around, and nothing you type into the link box is kept in your browser.</p>
      </>
    ),
  },
  {
    id: 'analytics',
    title: 'Analytics',
    body: (
      <>
        <p>
          We use Google Analytics 4 to measure traffic: which pages are viewed, roughly where visitors are, what devices they use, how they found the site, and
          events such as starting a lookup or a download. IP anonymisation is switched on, and Google Analytics 4 does not log or store full IP addresses. Google
          acts on our behalf under its own terms and privacy policy at policies.google.com/privacy.
        </p>
        <p>
          You can opt out with the{' '}
          <a href="https://tools.google.com/dlpage/gaoptout" rel="noopener noreferrer" target="_blank">
            Google Analytics opt-out browser add-on
          </a>{' '}
          or by blocking analytics in your browser. The tool works the same either way.
        </p>
      </>
    ),
  },
  {
    id: 'advertising',
    title: 'Advertising',
    body: (
      <>
        <p>
          The site is free to use and is supported by advertising. We use, or may start to use, Google AdSense. Google and its partners may use cookies and
          similar technologies to show ads based on your visits to this and other websites, to measure ads and to prevent fraud. We do not control those cookies
          and do not receive the data they collect.
        </p>
        <ul>
          <li>
            Manage personalised ads at{' '}
            <a href="https://adssettings.google.com" rel="noopener noreferrer" target="_blank">
              adssettings.google.com
            </a>
            , or opt out through{' '}
            <a href="https://optout.aboutads.info" rel="noopener noreferrer" target="_blank">
              optout.aboutads.info
            </a>{' '}
            or{' '}
            <a href="https://www.youronlinechoices.eu" rel="noopener noreferrer" target="_blank">
              youronlinechoices.eu
            </a>
            .
          </li>
          <li>
            Read how Google uses data from sites that use its services at{' '}
            <a href="https://policies.google.com/technologies/partner-sites" rel="noopener noreferrer" target="_blank">
              policies.google.com/technologies/partner-sites
            </a>
            .
          </li>
          <li>Visitors in the EEA, UK and Switzerland are asked for consent before personalised ads are shown, as the law requires.</li>
          <li>Ads are always labelled and kept apart from the tool, so they are never mistaken for a download button.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'downloads',
    title: 'What happens to the media you download',
    body: (
      <>
        <p>
          We do not store videos, photos or GIFs. When you press download, the file is either sent directly from the original Threads/Instagram content delivery
          network to your browser, or passes through our server in memory while it streams to you and is discarded the moment the transfer ends. Nothing is
          written to disk, and we keep no archive or library of what people save. Download links are short-lived and expire after about thirty minutes.
        </p>
      </>
    ),
  },
  {
    id: 'sharing',
    title: 'Who we share data with',
    body: (
      <>
        <p>We do not sell personal data. The only parties that receive data are:</p>
        <ul>
          <li>Google (Analytics and, if enabled, AdSense), as described above;</li>
          <li>our hosting provider, which stores the activity log on a server we administer;</li>
          <li>authorities, if we are legally required to disclose something or need to protect the service and its users from fraud or attack.</li>
        </ul>
        <p>
          When you look up a link, our server fetches the public Threads page to read the media address. That request comes from our server, so Threads sees our
          server&apos;s address, not yours.
        </p>
      </>
    ),
  },
  {
    id: 'retention',
    title: 'How long we keep data',
    body: (
      <>
        <ul>
          <li>Activity log, including IP addresses and visitor IDs: 90 days, then deleted automatically.</li>
          <li>Rate-limit counters: minutes to hours, stored against a hash rather than your address.</li>
          <li>Blocked addresses: until the administrator removes them.</li>
          <li>Download links: about thirty minutes, held in memory only.</li>
          <li>Google Analytics data: according to the retention period configured in our Analytics account.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'security',
    title: 'Security',
    body: (
      <>
        <p>
          The site is served only over HTTPS. The tool only accepts genuine Threads links, re-checks every redirect it follows and refuses to fetch private or
          internal network addresses. The dashboard sits behind a password with rate-limited sign-in. No system is perfectly secure, but we keep what we store
          deliberately small so there is little to lose.
        </p>
      </>
    ),
  },
  {
    id: 'your-rights',
    title: 'Your rights and choices',
    body: (
      <>
        <p>
          Depending on where you live (for example under the GDPR, the UK GDPR, or California and other US state privacy laws) you may have the right to know what
          we hold about you, to have it corrected or deleted, to object to or restrict processing, and to complain to your data-protection authority. We do not
          sell or share personal information for cross-context behavioural advertising through our own systems, and we do not make decisions about you by automated
          means.
        </p>
        <p>
          To exercise a right, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with the IP address you used and roughly when, so we can find the
          matching log entries. Because the log is keyed to IP address and a one-way hash, we can only act on a request if you can give us that detail. We reply
          within 30 days.
        </p>
      </>
    ),
  },
  {
    id: 'children',
    title: 'Children',
    body: (
      <p>
        The site is a general-audience tool and is not directed at children under 13 (or under 16 where local law sets a higher age). We do not knowingly collect
        personal information from children. If you believe a child has sent us personal data, tell us and we will delete it.
      </p>
    ),
  },
  {
    id: 'international',
    title: 'International visitors',
    body: (
      <p>
        Our servers and the services we use (such as Google) may process data outside the country you live in. Where required, those transfers rely on the
        safeguards that the provider offers, such as standard contractual clauses.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: (
      <p>
        When we change what we collect or how we use it, we update this page and the &ldquo;last updated&rdquo; date at the top. If a change is significant we will
        say so here before it takes effect.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      path={PATH}
      title="Privacy Policy"
      summary="We record your IP address, device type and how you found the site, together with what you did (looked up a link, downloaded a file, hit an error), keep it for 90 days for security and to improve the tool, and never sell it. We do not store the media you download, and we never ask for your Threads login."
      sections={sections}
    />
  );
}
