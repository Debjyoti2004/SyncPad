# Stage 1: Build
FROM node:20-slim AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY apps ./apps
COPY packages ./packages

RUN pnpm install
RUN pnpm --filter web build

# Stage 2: Run
FROM node:20-slim AS runner

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./

COPY --from=builder /app/apps/frontend/.next ./apps/frontend/.next
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public
COPY --from=builder /app/apps/frontend/package.json ./apps/frontend/package.json
COPY --from=builder /app/packages ./packages

RUN pnpm install --filter web...

EXPOSE 3000

WORKDIR /app/apps/frontend

CMD ["pnpm", "--filter", "web", "start"]
