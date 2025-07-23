# Builder Stage
FROM node:20-slim AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm --filter ws-backend run build


# Runtime Stage
FROM node:20-slim AS runtime

WORKDIR /app

RUN apt-get update && \
    apt-get install -y wget libssl3 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/package.json ./

COPY --from=builder /app/apps/ws-backend ./apps/ws-backend
COPY --from=builder /app/packages ./packages

RUN pnpm install --prod --filter ws-backend...

RUN pnpm --filter @repo/db exec prisma generate

WORKDIR /app/apps/ws-backend

EXPOSE 8080

CMD ["node", "dist/index.js"]