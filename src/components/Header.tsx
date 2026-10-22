'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const NAV_LINKS = [
  { href: '/threads-to-mp4/', label: 'Threads to MP4' },
  { href: '/threads-to-mp3/', label: 'Threads to MP3' },
  { href: '/threads-image-downloader/', label: 'Image Downloader' },
  { href: '/how-to-download-threads-videos/', label: 'How It Works' },
  { href: '/faq/', label: 'FAQ' },
];

function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="Threads Downloader home">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent via-[#7a45f0] to-[#db2777] text-white shadow-pop transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
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
      <span className="text-[17px] font-extrabold tracking-tight text-ink">
        Threads<span className="font-semibold text-ink-3">Downloader</span>
      </span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) => pathname === href || pathname === href.replace(/\/$/, '');

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled || open
          ? 'border-b border-line/80 bg-white/80 shadow-[0_8px_30px_-18px_rgba(16,16,28,0.25)] backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="container-app flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                isActive(link.href) ? 'bg-ink text-white' : 'text-ink-2 hover:bg-ink/5 hover:text-ink'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link href="/" className="btn-primary px-4 py-2 text-xs">
            Download
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white/80 md:hidden"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="animate-fadeUp border-t border-line bg-white/95 backdrop-blur-xl md:hidden">
          <nav className="container-app flex flex-col gap-1 py-3" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                  isActive(link.href) ? 'bg-ink text-white' : 'text-ink-2 hover:bg-brand-soft'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/" className="btn-cta mt-2 w-full py-2.5 text-sm">
              Download
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
