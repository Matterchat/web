# Prune the monorepo using Turborepo
FROM node:22-alpine AS pruner

WORKDIR /app
RUN npm install -g turbo
COPY . .

# Extracts only the dependencies and source files needed
RUN turbo prune --scope=web --out-dir=out --docker

# Install dependencies
FROM node:22-alpine AS installer

WORKDIR /app
ENV CI=true

RUN corepack enable && corepack prepare pnpm@latest-11 --activate

# Copy only the pruned lockfile and package.json
COPY --from=pruner /app/out/json/ ./
COPY --from=pruner /app/out/pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# Build 
FROM node:22-alpine AS builder

WORKDIR /app
ENV CI=true

RUN corepack enable && corepack prepare pnpm@latest-11 --activate

# Copy node_modules and dependencies structure
COPY --from=installer /app ./
# Copy pruned source files
COPY --from=pruner /app/out/full/ ./

RUN pnpm turbo run db:generate
RUN pnpm turbo run build --filter=web

# Production runner
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public* ./apps/web/public

EXPOSE 3000

CMD ["node", "apps/web/server.js"]