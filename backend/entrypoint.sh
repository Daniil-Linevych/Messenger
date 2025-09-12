#!/bin/sh

#.venv/bin/alembic stamp head

#.venv/bin/alembic revision --autogenerate -m "create users table"

.venv/bin/alembic upgrade head

exec "$@"
