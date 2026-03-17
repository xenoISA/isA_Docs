import nextra from 'nextra'

const withNextra = nextra({
  contentDirBasePath: '/content',
  defaultShowCopyCode: true,
})

export default withNextra({
  basePath: '/docs',
  reactStrictMode: true,
  output: 'standalone',
})
