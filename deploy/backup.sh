#!/usr/bin/env bash
# Consistent backup of the analytics SQLite database (uses SQLite's online backup,
# so it is safe while the app is running). Keeps the newest 14 copies.
#
# Cron example (daily 03:15):
#   15 3 * * * cd /opt/threads-downloader && bash deploy/backup.sh >> backups/backup.log 2>&1
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p backups

VOLUME="$(docker compose config --volumes | grep -x app_data || true)"
PROJECT="$(docker compose config --format json | sed -n 's/.*"name": *"\([^"]*\)".*/\1/p' | head -1)"
VOLUME_NAME="${PROJECT:-threadsdl}_app_data"
STAMP="$(date +%F_%H%M)"

docker run --rm \
  -v "${VOLUME_NAME}:/data:ro" \
  -v "$(pwd)/backups:/backup" \
  alpine:3.20 sh -c "apk add --no-cache sqlite >/dev/null && sqlite3 /data/app.db \".backup '/backup/app-${STAMP}.db'\""

ls -1t backups/app-*.db | tail -n +15 | xargs -r rm --
echo "Backup written: backups/app-${STAMP}.db"
