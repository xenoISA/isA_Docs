import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import './globals.css'
import { AISearch } from '../components/AISearch'
import { ThemeToggle } from '../components/ThemeToggle'
import { community, getDocsRepositoryBase } from '../lib/surfaces'

export const metadata = {
  title: {
    default: 'isA Platform Documentation',
    template: '%s | isA Docs'
  },
  description: 'Build, deploy, and scale intelligent AI agents with the complete isA platform. Agent SDK, 89+ MCP tools, Model gateway, and production-ready infrastructure.',
  keywords: ['AI agents', 'LLM', 'Agent SDK', 'MCP', 'Kubernetes', 'AI platform'],
  authors: [{ name: 'isA Platform' }],
  openGraph: {
    title: 'isA Platform Documentation',
    description: 'Build, deploy, and scale intelligent AI agents',
    type: 'website',
  },
}

const Logo = () => (
  <span className="flex items-center gap-2 font-bold">
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="text-current"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
    <span>isA</span>
  </span>
)

const FooterContent = () => (
  <div className="w-full bg-background">
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-4">
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted">
          © {new Date().getFullYear()} isA Platform. Open Source.
        </span>
      </div>
      <div className="flex items-center gap-6">
        <a
          href={community.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted hover:text-foreground"
        >
          GitHub
        </a>
        <a
          href={community.discord}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted hover:text-foreground"
        >
          Discord
        </a>
        <a
          href={community.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted hover:text-foreground"
        >
          Twitter
        </a>
      </div>
    </div>
  </div>
)

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pageMap = await getPageMap()

  return (
    <html lang="en" suppressHydrationWarning>
      <Head faviconGlyph="+" />
      <body>
        <Layout
          navbar={
            <Navbar
              logo={<Logo />}
              projectLink={community.github}
            >
              <ThemeToggle />
            </Navbar>
          }
          footer={<Footer><FooterContent /></Footer>}
          pageMap={pageMap}
          docsRepositoryBase={getDocsRepositoryBase()}
          editLink="Edit this page on GitHub"
          search={<AISearch />}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
