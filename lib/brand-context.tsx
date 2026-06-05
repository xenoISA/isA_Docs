'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { DEFAULT_BRAND, type Brand } from './brand'

// CLIENT brand context (#332 / ADR 0007).
//
// The brand is resolved on the SERVER from runtime env (`brand.server.ts`) and
// handed to this provider as a plain serializable prop by the root layout. The
// client never reads `process.env.BRAND_*` itself — those are NON-public and
// would be `undefined` in the browser. Passing the server value down as a prop
// keeps server and client in agreement, so there is no hydration mismatch.

const BrandContext = createContext<Brand>(DEFAULT_BRAND)

/**
 * Provides the server-resolved brand to Client Components.
 *
 * @param brand - Brand resolved on the server via `getBrand()`. Passed as a
 *   prop (not read from env on the client) so SSR and hydration agree.
 */
export function BrandProvider({
  brand,
  children,
}: {
  brand: Brand
  children: ReactNode
}) {
  return (
    <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>
  )
}

/** Read the active runtime brand inside a Client Component. */
export function useBrand(): Brand {
  return useContext(BrandContext)
}
