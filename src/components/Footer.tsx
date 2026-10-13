import Link from 'next/link';

const COLUMNS: Array<{ title: string; links: Array<{ href: string; label: string }> }> = [
  {
    title: 'Tools',
    links: [
      { href: '/threads-video-downloader/', label: 'Threads Video Downloader' },
      { href: '/threads-image-downloader/', label: 'Threads Image Downloader' },
      { href: '/threads-gif-downloader/', label: 'Threads GIF Downloader' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '/how-to-download-threads-videos/', label: 'How to Download Threads Videos' },
      { href: '/threads-video-downloader-android/', label: 'For Android' },
      { href: '/threads-video-downloader-iphone/', label: 'For iPhone' },
      { href: '/faq/', label: 'FAQ' },
    ],
  },
  {
    title: 'Company & legal',
    links: [
      { href: '/about/', label: 'About Us' },
      { href: '/privacy-policy/', label: 'Privacy Policy' },
      { href: '/terms-of-service/', label: 'Terms of Service' },
      { href: '/dmca/', label: 'DMCA & Copyright' },
      { href: '/disclaimer/', label: 'Disclaimer' },
      { href: '/contact/', label: 'Contact Us' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-8 overflow-hidden bg-[#0b0b12] text-white/70">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-accent/25 blur-[100px]"
      />
      <div className="container-app relative py-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <span className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent via-[#7a45f0] to-[#db2777] text-white">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 3v11.5m0 0-4-4m4 4 4-4M5 17.5c0 2 3 3.5 7 3.5s7-1.5 7-3.5"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-[17px] font-extrabold tracking-tight text-white">
                Threads<span className="font-semibold text-white/50">Downloader</span>
              </span>
            </span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
              A free tool for saving publicly accessible Threads videos, photos and GIFs, made to be quick on a phone and
              honest about what it can and can&apos;t do.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/60 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 space-y-2 border-t border-white/10 pt-7 text-xs leading-relaxed text-white/45">
          <p>
            Users are responsible for ensuring that they have the right to download and use the content they
            process.
          </p>
          <p>We do not host or claim ownership of downloaded third-party content.</p>
          <p>
            Threads Downloader is an independent tool and is not affiliated with, endorsed by, or sponsored by Meta
            Platforms, Inc. or the Threads app.
          </p>
          <p>&copy; {new Date().getFullYear()} Threads Downloader. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
