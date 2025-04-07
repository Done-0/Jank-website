# 构建阶段
FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1 NODE_ENV=production

# 安装pnpm
RUN corepack enable && corepack prepare pnpm@10.6.3 --activate

# 安装依赖
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 复制源代码并构建
COPY . .
RUN apk add --no-cache libc6-compat curl && \
    NEXT_SKIP_BAIL=1 pnpm run build && \
    pnpm prune --prod

# 运行阶段
FROM node:22-alpine
WORKDIR /app

# 复制必要文件
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./
RUN chmod -R 755 .next

# 启动服务
EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]