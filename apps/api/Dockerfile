# ============================================================
# Stage 1: Turbo prune — tạo pruned workspace chỉ chứa app api
# ============================================================
FROM node:22-alpine AS pruner
WORKDIR /app

RUN npm install -g turbo@^2

COPY . .
RUN turbo prune api --docker

# ============================================================
# Stage 2: Install dependencies từ pruned lockfile
# ============================================================
FROM node:22-alpine AS installer
WORKDIR /app

RUN npm install -g pnpm@10

# Copy pruned lockfile & workspace manifests (không có source code)
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

RUN pnpm install --frozen-lockfile

# ============================================================
# Stage 3: Build
# ============================================================
FROM node:22-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm@10

COPY --from=installer /app .

# Copy full source sau khi deps đã được install
COPY --from=pruner /app/out/full/ .

# Generate Prisma client & build NestJS
RUN pnpm --filter api exec prisma generate
RUN pnpm --filter api run build

# ============================================================
# Stage 4: Production runner — image nhỏ nhất có thể
# ============================================================
FROM node:22-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nestjs

# Chỉ copy những gì cần để chạy production
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/node_modules ./apps/api/node_modules

USER nestjs

EXPOSE 3001

# Chạy migrate + start trong production
CMD ["sh", "-c", "node node_modules/.bin/prisma migrate deploy --schema=./prisma/schema.prisma && node dist/main"]
