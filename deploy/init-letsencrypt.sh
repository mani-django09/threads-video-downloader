#!/usr/bin/env bash
# First-time HTTPS setup: obtains a Let's Encrypt certificate and starts the stack.
# Run from the project root, AFTER DNS for the domain points at this server:
#   bash deploy/init-letsencrypt.sh
#
# nginx cannot start without a certificate, and Let's Encrypt cannot issue one
# unless nginx answers the HTTP challenge. So: create a throwaway certificate,
# start nginx, replace it with the real one, then reload.
set -euo pipefail

cd "$(dirname "$0")/.."

# nginx and certbot live in the "standalone" compose profile (dedicated server only).
export COMPOSE_PROFILES=standalone

DOMAINS=(threadsdl.io www.threadsdl.io)
PRIMARY="${DOMAINS[0]}"
CERT_DIR="deploy/certbot/conf"
WEBROOT_DIR="deploy/certbot/www"

# Contact email for expiry notices (from .env or the environment).
if [ -z "${LETSENCRYPT_EMAIL:-}" ] && [ -f .env ]; then
  LETSENCRYPT_EMAIL="$(grep -E '^LETSENCRYPT_EMAIL=' .env | head -1 | cut -d= -f2- | tr -d '"' || true)"
fi
: "${LETSENCRYPT_EMAIL:?Set LETSENCRYPT_EMAIL in .env or export it, so expiry notices can be sent}"

# STAGING=1 uses Let's Encrypt's test CA (no rate limits) -- use it for a dry run.
STAGING_ARG=""
if [ "${STAGING:-0}" = "1" ]; then
  STAGING_ARG="--staging"
  echo "### STAGING mode: the certificate will NOT be trusted by browsers."
fi

if [ ! -f .env ]; then
  echo "Missing .env -- copy .env.production.example to .env and fill it in first." >&2
  exit 1
fi

if docker compose run --rm --no-deps --entrypoint "test -f /etc/letsencrypt/live/${PRIMARY}/fullchain.pem" certbot >/dev/null 2>&1 \
   && [ "${FORCE:-0}" != "1" ]; then
  echo "A certificate for ${PRIMARY} already exists. Re-run with FORCE=1 to replace it."
  docker compose up -d
  exit 0
fi

echo "### DNS check (both names must resolve to THIS server, or issuance will fail)"
for d in "${DOMAINS[@]}"; do
  printf '  %-20s -> %s\n' "$d" "$(getent hosts "$d" | awk '{print $1}' | head -1 || true)"
done
printf '  this server          -> %s\n' "$(curl -fsS https://api.ipify.org 2>/dev/null || echo unknown)"
read -r -p "Do the addresses match? Continue? [y/N] " answer
[ "$answer" = "y" ] || [ "$answer" = "Y" ] || exit 1

mkdir -p "$CERT_DIR" "$WEBROOT_DIR"

echo "### 1/5 Creating a temporary self-signed certificate so nginx can start"
docker compose run --rm --no-deps --entrypoint "\
  sh -c 'mkdir -p /etc/letsencrypt/live/${PRIMARY} && \
  openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
    -keyout /etc/letsencrypt/live/${PRIMARY}/privkey.pem \
    -out /etc/letsencrypt/live/${PRIMARY}/fullchain.pem \
    -subj /CN=localhost'" certbot

echo "### 2/5 Building and starting app + nginx"
docker compose up -d --build app nginx

echo "### 3/5 Removing the temporary certificate"
docker compose run --rm --no-deps --entrypoint "\
  sh -c 'rm -rf /etc/letsencrypt/live/${PRIMARY} /etc/letsencrypt/archive/${PRIMARY} /etc/letsencrypt/renewal/${PRIMARY}.conf'" certbot

echo "### 4/5 Requesting the real certificate from Let's Encrypt"
domain_args=""
for d in "${DOMAINS[@]}"; do domain_args="$domain_args -d $d"; done
docker compose run --rm --no-deps --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $STAGING_ARG \
    --email ${LETSENCRYPT_EMAIL} --agree-tos --no-eff-email \
    --rsa-key-size 4096 --non-interactive \
    $domain_args" certbot

echo "### 5/5 Reloading nginx and starting the renewal service"
docker compose exec nginx nginx -s reload
docker compose up -d

echo
echo "Done. Check: https://${PRIMARY}/api/health/"
