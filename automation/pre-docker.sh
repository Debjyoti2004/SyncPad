#!/bin/bash

set -e

echo "Running pnpm install..."
pnpm install

echo "Running Prisma generate..."
cd packages/db
npx prisma generate
cd ../../

echo "Building monorepo..."
pnpm build

echo "✅ Pre-docker steps completed. You can now run your Dockerfile or docker-compose."
