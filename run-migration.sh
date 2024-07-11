#!/bin/sh
set -e

# Wait for Postgres to be ready
./wait-for-it.sh express_postgres:5432 -t 60

# Run migrations
npm run db:generate
npm run db:migrate
