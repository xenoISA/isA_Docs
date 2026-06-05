# ── Stage 1: Install dependencies ────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# ── Stage 2: Build ───────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── Stage 3: Production runtime ──────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=4300

# Runtime brand (#332 / ADR 0007): the brand is NOT baked into the image. The
# site chrome reads NON-public BRAND_* env on the server at request time, so this
# single edition-agnostic image is rebranded purely at container start:
#   docker run -e BRAND_NAME=SN \
#              -e BRAND_SHORT=SN \
#              -e BRAND_LONG_NAME="SN Platform Documentation" ...
# Unset = isA defaults (see lib/brand.ts). No NEXT_PUBLIC_BRAND_* build args.

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output + static assets
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 4300

CMD ["node", "server.js"]
