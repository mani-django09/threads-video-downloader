# Threads Video Downloader

**Live site: [threadsdl.io](https://threadsdl.io/)** · [Threads to MP4](https://threadsdl.io/threads-to-mp4/) · [Threads to MP3](https://threadsdl.io/threads-to-mp3/) · [Image downloader](https://threadsdl.io/threads-image-downloader/) · [GIF downloader](https://threadsdl.io/threads-gif-downloader/) · [How it works](https://threadsdl.io/how-to-download-threads-videos/)

Free online tool to save videos, photos and GIFs from public Threads posts. Paste a post link, preview the media and download the original file, with no app to install and no Threads login. This repository is the full source of the site.

A production-ready Next.js 14 (App Router, TypeScript, Tailwind) application for downloading publicly accessible
Threads videos, images, and GIFs. Built with a pluggable provider architecture so additional platforms
(Pinterest, X/Twitter, Facebook, Instagram) can be added without touching the frontend or API layer.

## Production domain

The site is configured for **https://threadsdl.io** (`NEXT_PUBLIC_SITE_URL`, `nginx.conf`, `docker-compose.yml`,
contact email). Canonicals, the sitemap and internal links all use the trailing-slash form (`trailingSlash: true`
in `next.config.js`), so `/faq/` is the real URL and `/faq` redirects to it.

Before going live set `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` (32+ random characters) in the production
environment, and verify the domain in Google Search Console via `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.

## What this does — and does not — do

- Only processes Threads posts that are already publicly viewable without logging in.
- Never asks for or stores a Threads username/password.
- Never permanently stores downloaded media — files are redirected or streamed straight through, never written to disk.
- Does **not** bypass private accounts, authentication, DRM, paywalls, or CAPTCHAs. If a post can't be reached without logging in, the tool reports it as private/restricted rather than attempting to work around it.

## Stack

- **Frontend**: Next.js 14 App Router, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js Route Handlers (Node.js runtime), Cheerio for HTML parsing
- **Database**: SQLite via Prisma (operational analytics only: a `DownloadEvent` activity log kept for 90 days, never any media)
- **Deploy**: Docker + docker-compose + Nginx reverse proxy reference config

## Getting Started

```bash
npm install
cp .env.example .env   # fill in ADMIN_PASSWORD and ADMIN_SESSION_SECRET at minimum
npx prisma db push     # creates the local SQLite database
npm run dev
```

Visit http://localhost:3000.

## Project Structure

```
src/
  app/                  # Routes (App Router) — pages, API routes, sitemap/robots/manifest
  components/           # Header, Footer, Downloader, AdSlot, FaqSection, LoadingState, ErrorState, ...
  lib/                  # validation, security (SSRF guards), rate limiting, db, admin auth, analytics
  providers/            # Platform-specific downloader modules
    types.ts            # Shared DownloaderProvider interface
    threads/             # Threads implementation (URL resolution, HTML parsing, caching)
```

### Supported Threads URL formats

- Canonical: `https://www.threads.net/@username/post/ABC123`
- Mobile app share link: `https://www.threads.net/share/G5xxxxxxx`
- Shortlink: `https://www.threads.net/t/ABC123`

Share links and shortlinks are resolved by following Threads' own server-side redirect to the canonical post URL
(`src/providers/threads/resolve.ts`). Verified against live posts during development: Threads serves a broken,
non-redirecting page with no Open Graph tags to these links for at least one desktop Chrome/Windows User-Agent, so
the fetcher deliberately uses only Apple-platform UAs (confirmed reliable) and retries once with a known-good UA if
a canonical URL isn't reached on the first attempt.

### Adding a new platform

Create `src/providers/<platform>/index.ts` exporting an object that satisfies `DownloaderProvider`
(`matches(url)` + `resolve(url)`), then register it in `src/providers/index.ts`. The API routes and
frontend components are platform-agnostic and require no changes.

## Security

- SSRF guards: hostname allowlists for both "pages we'll fetch from" and "hosts we'll redirect/proxy downloads to", plus DNS-resolution checks against private/loopback IP ranges before every outbound request.
- Rate limiting: per-route sliding-window limits plus a global abuse/ban tracker (in-memory — see the note in `src/lib/rateLimit.ts` about multi-instance deployments).
- Admin auth: stateless HMAC-signed session cookie (works correctly across multiple server instances, no shared session store required), timing-safe password comparison.
- Security headers (CSP, X-Frame-Options, etc.) set in `next.config.js`; the CSP's `'unsafe-eval'` allowance is dropped automatically outside development (it's only required by Next.js dev-mode hot reload).
- IP addresses and user agents are salted-hashed before being persisted; raw values are never stored.

## Known limitations

- **Video extraction depends on what Threads serves to logged-out visitors.** This tool reads the public,
  server-rendered `og:video`/`og:image` meta tags and scans inline JSON for CDN media URLs — the same class of
  technique used for public link-preview generation. In testing against live posts, image extraction was reliable;
  posts that are natively video may not always expose a working `og:video` tag to unauthenticated requests, in
  which case the tool correctly reports "no downloadable public media" rather than guessing.
- **In-memory rate limiting and caching are per-process.** If you scale this app to multiple instances/containers,
  effective per-IP limits become proportionally looser. For strict cross-instance limits, back `src/lib/rateLimit.ts`
  with Redis.
- **`npm audit` flags Next.js 14.x advisories** that are largely fixed only by upgrading to Next 15/16 (a breaking
  change out of scope here). The app is pinned to the latest patched 14.2.x release.

## Deployment (VPS + Docker + HTTPS)

The full runbook is in **[DEPLOY.md](DEPLOY.md)**. In short: point DNS at the VPS, run `deploy/setup-vps.sh`,
create `.env` from `.env.production.example`, then `deploy/init-letsencrypt.sh` issues the certificate and starts
the stack (nginx + app + auto-renewing certbot). Updates: `deploy/update.sh`. Backups: `deploy/backup.sh`.

Locally, `docker compose up --build` also works once `.env` has `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`,
but nginx expects the Let's Encrypt certificate, so use `npm run dev` for local development.

## Health check

`GET /api/health` returns `200 {"status":"ok"}` when the app and database are reachable, `503` otherwise. Used by
the Docker healthcheck and suitable for load balancer probes.
