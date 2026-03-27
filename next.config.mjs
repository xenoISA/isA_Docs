import nextra from 'nextra'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const sdkUiWebPath = path.resolve(__dirname, '../isA_App_SDK/packages/ui-web/dist')

const withNextra = nextra({
  contentDirBasePath: '/content',
  defaultShowCopyCode: true,
})

export default withNextra({
  basePath: '/docs',
  reactStrictMode: true,
  output: 'standalone',
  eslint: {
    dirs: ['app', 'components', 'lib'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@isa/ui-web': sdkUiWebPath,
    }
    config.resolve.symlinks = false
    return config
  },
})
