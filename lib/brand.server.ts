import 'server-only'

import { resolveBrand, type Brand } from './brand'

// SERVER-ONLY runtime brand reader (#332 / ADR 0007).
//
// Reads NON-public `BRAND_*` env at REQUEST/RENDER time on the server, so the
// value is picked up from the container's runtime environment rather than being
// inlined at `next build`. The `import 'server-only'` guard makes the build
// fail loudly if this module is ever pulled into a Client Component bundle —
// that would both leak server env handling and silently break the runtime flip.
//
// Runtime env (set at container start, NON-public — NOT NEXT_PUBLIC_*):
//   BRAND_NAME       — full platform name (default "isA Platform")
//   BRAND_SHORT      — short brand mark   (default "isA")
//   BRAND_LONG_NAME  — long docs title    (default "isA Platform Documentation")
//
// Server Components call `getBrand()` directly. The root layout passes the
// resolved value into `<BrandProvider>` so Client Components can read the same
// runtime value via `useBrand()` (see brand-context.tsx).

/** Read the active brand from server runtime env (`BRAND_*`). */
export function getBrand(): Brand {
  return resolveBrand(process.env)
}
