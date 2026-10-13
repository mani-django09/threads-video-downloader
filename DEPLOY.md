# Deploying threadsdl.io (VPS + Docker + HTTPS)

There are two ways to run this, depending on the server:

- **Shared server** (one that already runs nginx + certbot for other sites): only the `app` container runs, bound
  to `127.0.0.1:3150`; the host's nginx terminates TLS. This is how the production server is set up; see
  [Shared server](#shared-server-host-nginx) below.
- **Dedicated server** (nothing else on it): the compose `standalone` profile adds an nginx container and an
  auto-renewing certbot container; sections 0 to 6 below describe this.

> **Do not run the dedicated-server scripts on a shared server.** `deploy/setup-vps.sh` changes the firewall and
> `deploy/init-letsencrypt.sh` takes over ports 80/443; on a server that hosts other sites that would take them
> down. Never `systemctl disable nginx` there.

## Shared server (host nginx)

What is installed on the production server (`/var/www/threadsdl`):

1. Code in `/var/www/threadsdl`, plus a `.env` (mode 600, generated secrets, `APP_HOST_PORT=3150`).
2. `docker compose up -d --build` starts only the `app` container (nginx/certbot are in the `standalone` profile).
3. `deploy/nginx/host-limits.conf` → `/etc/nginx/conf.d/threadsdl-limits.conf` (rate-limit zones).
4. `deploy/nginx/host-site.conf` → `/etc/nginx/sites-enabled/threadsdl.io` (TLS, www→apex redirect, proxy to 3150).
5. Certificate: `certbot certonly --nginx -d threadsdl.io -d www.threadsdl.io`, renewed by the host's certbot.

Always run `nginx -t` before `systemctl reload nginx`: a broken config would affect every site on the host.

Update the site: copy the new code to `/var/www/threadsdl` (keep `.env`), then `bash deploy/update.sh`.
The admin password is in `/var/www/threadsdl/.env` (`ADMIN_PASSWORD`).

---

## Dedicated server

Stack on the server: **nginx** (TLS, rate limits) → **app** (Next.js standalone, SQLite in a Docker volume)
+ **certbot** (Let's Encrypt, auto-renewing). Only ports 22, 80 and 443 are open; the app container is
not reachable from outside.

## 0. What you need

- A VPS running **Ubuntu 22.04 or 24.04**, 1 vCPU / 2 GB RAM or more (the setup script adds 2 GB swap so the
  Next.js build does not run out of memory).
- The domain **threadsdl.io** with access to its DNS.
- A mailbox for `support@threadsdl.io` (the DMCA and contact pages point to it).

## 1. DNS

Create two records at your domain registrar, both pointing to the VPS public IP:

| Type | Name  | Value           |
|------|-------|-----------------|
| A    | `@`   | `<VPS IPv4>`    |
| A    | `www` | `<VPS IPv4>`    |

(If the VPS has IPv6, add matching `AAAA` records, or leave IPv6 out entirely. A half-configured `AAAA`
record makes certificate issuance fail.) Wait until `nslookup threadsdl.io` returns the VPS IP.

## 2. Prepare the server (once)

```bash
ssh root@<VPS IP>
git clone <your-repo-url> /opt/threads-downloader      # or copy the folder with scp/rsync
cd /opt/threads-downloader
sudo bash deploy/setup-vps.sh
```

The script installs Docker, enables the firewall (SSH/80/443 only), fail2ban and automatic security updates.

> No git remote yet? From your PC: `scp -r threads-downloader root@<VPS IP>:/opt/` (skip `node_modules`
> and `.next`; `.dockerignore` keeps them out of the image anyway, but they make the copy slow).

## 3. Configure secrets

```bash
cd /opt/threads-downloader
cp .env.production.example .env
nano .env
```

Fill in `LETSENCRYPT_EMAIL`, `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`. Generate the last two with
`openssl rand -base64 32`. Do **not** reuse the development values. `docker compose` refuses to start without them.

## 4. Get the HTTPS certificate and start everything

Dry run first (uses Let's Encrypt's test CA, so a mistake cannot hit rate limits):

```bash
STAGING=1 bash deploy/init-letsencrypt.sh
```

If that finishes without errors, run it for real (the staging certificate is replaced):

```bash
FORCE=1 bash deploy/init-letsencrypt.sh
```

This builds the image (a few minutes the first time), starts nginx and the app, obtains the certificate for
`threadsdl.io` and `www.threadsdl.io`, and starts the auto-renewal service.

## 5. Verify

```bash
docker compose ps                         # app: healthy, nginx: healthy, certbot: running
curl -I https://threadsdl.io/             # 200, Strict-Transport-Security header present
curl -I http://threadsdl.io/              # 301 -> https://threadsdl.io/
curl -I https://www.threadsdl.io/         # 301 -> https://threadsdl.io/
curl https://threadsdl.io/api/health/     # {"status":"ok",...}
```

Then in a browser: paste a public Threads post link, and sign in at `https://threadsdl.io/admin/login/`.
Test the certificate at <https://www.ssllabs.com/ssltest/>.

## 6. Search Console

Add the property `https://threadsdl.io`, copy the verification token into `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
in `.env`, run `bash deploy/update.sh` (that value is baked in at build time), verify, then submit
`https://threadsdl.io/sitemap.xml`.

## Day-to-day

| Task | Command |
|------|---------|
| Deploy a new version | update the code (`git pull`), then `bash deploy/update.sh` |
| App logs | `docker compose logs -f app` |
| nginx logs | `docker compose logs -f nginx` |
| Restart | `docker compose restart app` |
| Stop everything | `docker compose down` (data volume is kept) |
| Backup the database | `bash deploy/backup.sh` |
| Renewal check | `docker compose run --rm --entrypoint "certbot renew --dry-run" certbot` |

Daily backup via cron (`crontab -e`):

```
15 3 * * * cd /opt/threads-downloader && bash deploy/backup.sh >> backups/backup.log 2>&1
```

Backups land in `backups/` on the same server. Copy them off the machine now and then (`scp`, rclone).
The database only holds anonymised analytics (hashed IPs, event counts), never any downloaded media.

## Notes and limits

- **Rate limiting** is per container and in memory (plus nginx limits per IP). Running several app replicas
  makes the app-level limits looser; a single container is what this setup assumes.
- **`NEXT_PUBLIC_*` values** (GA, GTM, AdSense, Search Console token, site URL) are compiled into the
  build. After changing them, run `bash deploy/update.sh`, not just `docker compose restart`.
- **Certificates** renew automatically (checked twice a day, renewed within 30 days of expiry; nginx reloads
  every 6 hours to pick them up). Keep port 80 open: renewal uses it.
- **Graceful shutdown**: containers run with `init: true` and a 20 s stop grace period, so `docker compose
  stop` lets in-flight requests finish.
- **Logs** are rotated by Docker (5 files of 10 MB per container).
- The Dockerfile and compose file were validated by reading and by running the same startup steps outside
  Docker. They were not built with Docker on the development machine, so expect to read the first
  `docker compose build` output once.
