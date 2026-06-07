/**
 * Surface URL configuration — env-driven cross-surface routing.
 *
 * Follows the same pattern as @xenoisa/core's gatewayConfig: every external
 * URL that the docs shell references is resolved from an env var with a
 * sensible default so `npm run dev` works out of the box.
 *
 * All env vars use the NEXT_PUBLIC_ prefix so they're available in both
 * server components and client components.
 *
 * @see https://github.com/xenoISA/isA_App_SDK/blob/main/packages/core/src/config/gatewayConfig.ts
 */

/** isA platform surface URLs */
export const surfaces = {
  /** REST / WebSocket API gateway */
  api: process.env.NEXT_PUBLIC_API_URL || 'https://api.isa.io',

  /** Status page */
  status: process.env.NEXT_PUBLIC_STATUS_URL || 'https://status.isa.io',

  /** Console dashboard */
  console: process.env.NEXT_PUBLIC_CONSOLE_URL || 'https://console.isa.io',

  /** Main web app */
  app: process.env.NEXT_PUBLIC_APP_URL || 'https://app.isa.io',

  /** Docs site (self) */
  docs: process.env.NEXT_PUBLIC_DOCS_URL || 'https://docs.isa.io',
} as const

/** Community & external links */
export const community = {
  github: process.env.NEXT_PUBLIC_GITHUB_ORG_URL || 'https://github.com/xenoISA',
  discord: process.env.NEXT_PUBLIC_DISCORD_URL || 'https://discord.gg/isa',
  twitter: process.env.NEXT_PUBLIC_TWITTER_URL || 'https://twitter.com/isA_platform',
} as const

// Customer-visible brand chrome moved to runtime config (#332 / ADR 0007):
// see `lib/brand.ts` (pure type + defaults + resolveBrand), `lib/brand.server.ts`
// (server runtime reader), and `lib/brand-context.tsx` (client hydration). The
// brand is now read from NON-public `BRAND_*` server env at request time so one
// edition-agnostic image can be rebranded at container start, instead of being
// inlined from `NEXT_PUBLIC_BRAND_*` at build time.

/** Docs-specific repo config */
export const docsRepo = {
  /** GitHub repo URL for "Edit this page" links */
  base: process.env.NEXT_PUBLIC_DOCS_REPO || 'https://github.com/xenoISA/isA_Docs',
  /** Content directory path within the repo */
  contentPath: 'tree/main/content',
} as const

/** Build the docsRepositoryBase URL used by Nextra's edit link */
export function getDocsRepositoryBase() {
  return `${docsRepo.base}/${docsRepo.contentPath}`
}
