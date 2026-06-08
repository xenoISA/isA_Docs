'use client'

import { useBrand } from '../lib/brand-context'

/**
 * Renders the active brand's short mark at runtime (e.g. "isA" or "SN").
 *
 * The remark-brand plugin replaces literal "isA" in MDX prose with <BrandShort/>
 * at build time, so the compiled docs are brand-neutral; this component resolves
 * the real brand from the runtime BrandProvider (#332 edition model). That keeps
 * ONE edition-agnostic docs image whose content rebrands by config.
 */
export function BrandShort() {
  return <>{useBrand().short}</>
}
