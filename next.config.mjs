import nextra from 'nextra'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const sdkRootNodeModules = path.resolve(__dirname, '../isA_App_SDK/node_modules')
const sdkUiWebNodeModules = path.resolve(__dirname, '../isA_App_SDK/packages/ui-web/node_modules')

const withNextra = nextra({
  contentDirBasePath: '/content',
  defaultShowCopyCode: true,
})

export default withNextra({
  basePath: '/docs',
  reactStrictMode: true,
  output: 'standalone',
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
    return config
  },
})
