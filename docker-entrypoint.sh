#!/bin/sh
set -e

# Create/upgrade the SQLite schema. Deliberately not "|| true": if this fails the
# container should stop and restart loudly rather than serve with a broken DB.
if [ -n "$DATABASE_URL" ]; then
  echo "Applying database schema..."
  node ./node_modules/prisma/build/index.js db push --skip-generate
fi

# exec so node becomes PID 1's child via tini (compose "init: true") and receives
# SIGTERM directly for graceful shutdown.
exec node server.js
