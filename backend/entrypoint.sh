#!/bin/sh
set -e

echo "Waiting for database..."
while ! nc -z db 5432; do
  echo "Database not ready, waiting..."
  sleep 2
done

echo "Database is ready!"

echo "Running migrations..."
.venv/bin/alembic upgrade head

echo "Starting application..."
exec "$@"