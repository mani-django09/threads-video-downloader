#!/usr/bin/env bash
# Deploy a new version. Run from the project root on the server after updating the code
# (git pull, or copy the new files over):
#   bash deploy/update.sh
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> Building the new image (the running site keeps serving meanwhile)"
docker compose build app

echo "==> Restarting the app (plus nginx/certbot if COMPOSE_PROFILES=standalone is set in .env)"
docker compose up -d

echo "==> Waiting for the app to become healthy"
for i in $(seq 1 30); do
  status="$(docker inspect --format '{{.State.Health.Status}}' "$(docker compose ps -q app)" 2>/dev/null || echo starting)"
  [ "$status" = "healthy" ] && break
  sleep 2
done
echo "app health: $status"
[ "$status" = "healthy" ] || { docker compose logs --tail=50 app; exit 1; }

docker image prune -f >/dev/null
echo "Deployed."
