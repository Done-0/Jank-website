FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.6.3 --activate
ENV NEXT_TELEMETRY_DISABLED=1 NODE_ENV=production

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3000 NEXT_TELEMETRY_DISABLED=1

RUN corepack enable && corepack prepare pnpm@10.6.3 --activate && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/package.json /app/next.config.ts ./
RUN mkdir -p .next/static public && \
    pnpm install --prod --frozen-lockfile && \
    chown -R 1001:1001 /app

USER nextjs
EXPOSE 3000
CMD ["pnpm", "start"]
