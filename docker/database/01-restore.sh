#!/bin/sh
set -eu

echo "Restaurando la base Northwind"
pg_restore \
  --username "$POSTGRES_USER" \
  --dbname "$POSTGRES_DB" \
  --no-owner \
  --no-privileges \
  --exit-on-error \
  /docker-entrypoint-initdb.d/Northwind.backup

