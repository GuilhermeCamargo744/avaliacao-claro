#!/bin/sh
set -eu

echo "Aplicando migrations..."
./node_modules/.bin/prisma db migrate

echo "Subindo a API..."
exec node dist/main.js
