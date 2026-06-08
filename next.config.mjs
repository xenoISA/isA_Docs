import nextra from 'nextra'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import remarkBrand from './lib/remark-brand.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const sdkRootNodeModules = path.resolve(__dirname, '../isA_App_SDK/node_modules')
const sdkUiWebNodeModules = path.resolve(__dirname, '../isA_App_SDK/packages/ui-web/node_modules')

// Two zod majors must coexist in ONE webpack build (#430/#349):
//   - @xenoisa/core needs zod v3 (126x `z.record`, a v4 breaking change)
//   - nextra v4 needs zod v4 (uses `prettifyError`)
// shamefully-hoist lifts ONE zod to the root; whichever wins shadows the other
// (a v4 win breaks core's i18n at RSC render — the prerender failure we hit).
// Resolve BOTH copies at config time and alias deterministically: default zod
// → core's v3 (everything else), nextra-scoped modules → their nested v4.
function resolveZodFrom(fromPackageJson) {
  try {
    const dir = path.dirname(require.resolve(fromPackageJson))
    return path.dirname(require.resolve('zod/package.json', { paths: [dir] }))
  } catch {
    return null
  }
}
const coreZodV3 = resolveZodFrom('@xenoisa/core/package.json')
const nextraZodV4 = resolveZodFrom('nextra/package.json')

const withNextra = nextra({
  contentDirBasePath: '/content',
  defaultShowCopyCode: true,
  // Tokenize the brand word in prose to <BrandShort/> so docs content rebrands
  // at runtime per edition (#332) — keeps one edition-agnostic docs image.
  mdxOptions: {
    remarkPlugins: [remarkBrand],
  },
})

export default withNextra({
  basePath: '/docs',
  reactStrictMode: true,
  output: 'standalone',
  // SDK type-defs (@xenoisa/*) have build-debt gaps; don't block the build.
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    serverMinification: false,
  },
  webpack: (config) => {
    config.resolve.symlinks = false
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      sdkRootNodeModules,
      sdkUiWebNodeModules,
      'node_modules',
    ]
    // Default: pin zod to core's v3 so @xenoisa/core resolves v3 at runtime
    // regardless of what gets hoisted.
    if (coreZodV3) {
      config.resolve.alias = { ...(config.resolve.alias || {}), zod$: coreZodV3 }
    }
    // Override only for nextra's own modules: route them to nextra's nested v4.
    if (nextraZodV4) {
      config.module.rules.push({
        test: /[\\/]node_modules[\\/](\.pnpm[\\/])?nextra(-theme-docs)?[@\\/]/,
        resolve: { alias: { zod$: nextraZodV4 } },
      })
    }
    return config
  },
})
