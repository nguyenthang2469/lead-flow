# ============================================================
# Stage 1: Turbo prune — tạo pruned workspace chỉ chứa app web
# ============================================================
FROM node:22-alpine AS pruner
WORKDIR /app

RUN npm install -g turbo@^2

COPY . .
RUN turbo prune web --docker

# ============================================================
# Stage 2: Install dependencies từ pruned lockfile
# ============================================================
FROM node:22-alpine AS installer
WORKDIR /app

RUN npm install -g pnpm@10

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

RUN pnpm install --frozen-lockfile

# ============================================================
# Stage 3: Build Next.js
# ============================================================
FROM node:22-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm@10

COPY --from=installer /app .
COPY --from=pruner /app/out/full/ .

# NEXT_PUBLIC_API_URL cần được truyền lúc build (build-time arg)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Tắt Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm --filter web run build

# ============================================================
# Stage 4: Production runner
# ============================================================
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copy Next.js standalone output
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "apps/web/server.js"]
