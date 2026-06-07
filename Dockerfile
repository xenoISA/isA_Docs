FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat

# ---------- deps ----------
# Combined pnpm workspace: docs (.) + isA_App_SDK/packages/* (nested by CI).
# Resolves @xenoisa/* SDK packages + their internal workspace:* deps in one
# install. pnpm-workspace.yaml lists both; .npmrc hoists shared SDK build deps.
FROM base AS deps
WORKDIR /app
COPY . .
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate && \
    pnpm install --no-frozen-lockfile

# ---------- build ----------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app ./
ENV NEXT_TELEMETRY_DISABLED=1
# SDK dist/ is gitignored — build the @xenoisa/* packages (topological) before
# next build. Brand-agnostic build (#332/ADR0007): BRAND_* read at runtime.
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate && \
    pnpm -r --filter "./isA_App_SDK/packages/**" run build && \
    npm run build

# ---------- runner ----------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=4300
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 4300
CMD ["node", "server.js"]
