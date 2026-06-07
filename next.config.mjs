import nextra from 'nextra'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const sdkRootNodeModules = path.resolve(__dirname, '../isA_App_SDK/node_modules')
const sdkUiWebNodeModules = path.resolve(__dirname, '../isA_App_SDK/packages/ui-web/node_modules')

// nextra v4 needs zod v4 (uses `prettifyError`), but @xenoisa/core needs zod v3
// (126x `z.record`, a v4 breaking change). The combined workspace hoists ONE
// zod (v3) to the root, which would shadow nextra's nested v4. Resolve nextra's
// OWN nested zod and alias it only for nextra-scoped modules (#430/#349).
let nextraZodDir = null
try {
  const nextraDir = path.dirname(require.resolve('nextra/package.json'))
  nextraZodDir = path.dirname(require.resolve('zod/package.json', { paths: [nextraDir] }))
} catch {
  // If nextra's nested zod can't be resolved at config time, fall back to the
  // default resolution (build will surface the real error).
}

const withNextra = nextra({
  contentDirBasePath: '/content',
  defaultShowCopyCode: true,
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
    // Scope nextra's zod to its own v4 copy so the hoisted v3 (for @xenoisa/core)
    // doesn't shadow it. Per-rule resolve overrides the global resolve.modules.
    if (nextraZodDir) {
      config.module.rules.push({
        test: /[\\/]node_modules[\\/](\.pnpm[\\/])?nextra(-theme-docs)?[@\\/]/,
        resolve: { alias: { zod$: nextraZodDir } },
      })
    }
    return config
  },
})
