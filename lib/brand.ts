// Customer-visible brand configuration — TYPE + DEFAULTS only.
//
// Runtime-brand model (#332 / ADR 0007): the brand is chosen at *container
// start*, not at `next build`. Next.js inlines `NEXT_PUBLIC_*` at build time,
// which would force one image per brand. Instead the brand is read from
// SERVER runtime env (`BRAND_*`, NON-public) in `brand.server.ts` and hydrated
// to the client via `brand-context.tsx`. The result is ONE edition-agnostic
// image whose brand flips purely on `docker run -e BRAND_*`.
//
// This module is intentionally side-effect free (no env reads at import time)
// so it is safe to import from both Server and Client components. The actual
// env read lives in `brand.server.ts` (server-only).
//
// NOTE: This covers site CHROME only (titles, logo, footer). Prose mentions in
// MDX content (~363) are a separate build-time tokenization effort (follow-up).

/** Customer-visible brand strings. Stable shape across server + client. */
export interface Brand {
  /** Full platform name, e.g. "isA Platform" — used as metadata author. */
  name: string
  /** Short brand mark, e.g. "isA" — logo text and title template suffix. */
  short: string
  /** Long documentation title, e.g. "isA Platform Documentation" — default/OG title. */
  longName: string
}

// Defaults reproduce the previous hard-coded isA literals exactly, so behaviour
// is unchanged until the BRAND_* env vars are set at runtime.
export const DEFAULT_BRAND: Brand = {
  name: 'isA Platform',
  short: 'isA',
  longName: 'isA Platform Documentation',
}

/**
 * Resolve a {@link Brand} from a runtime env bag (e.g. `process.env`).
 *
 * Reads NON-public `BRAND_*` vars so values are NOT inlined at build time.
 * Any unset field falls back to the isA default. Pure function — callable from
 * the server reader and from tests.
 */
export function resolveBrand(env: NodeJS.ProcessEnv = process.env): Brand {
  return {
    name: env.BRAND_NAME ?? DEFAULT_BRAND.name,
    short: env.BRAND_SHORT ?? DEFAULT_BRAND.short,
    longName: env.BRAND_LONG_NAME ?? DEFAULT_BRAND.longName,
  }
}
