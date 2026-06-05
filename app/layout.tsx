import type { Metadata } from 'next'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import './globals.css'
import { AISearch } from '../components/AISearch'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { I18nWrapper } from '../components/I18nWrapper'
import { PlatformNavBar } from '../components/PlatformNavBar'
import { ThemeToggle } from '../components/ThemeToggle'
import { BrandProvider } from '../lib/brand-context'
import { getBrand } from '../lib/brand.server'
import type { Brand } from '../lib/brand'
import { community, getDocsRepositoryBase } from '../lib/surfaces'

// Runtime brand (#332 / ADR 0007): read from server env per request so a single
// image can be rebranded at container start. generateMetadata() (not a static
// metadata export) ensures the title/template/author/OG reflect the runtime value.
export function generateMetadata(): Metadata {
  const brand = getBrand()
  return {
    title: {
      default: brand.longName,
      template: `%s | ${brand.short} Docs`,
    },
    description:
      'Build, deploy, and scale intelligent AI agents with the complete isA platform. Agent SDK, 190+ MCP tools, Model gateway, and production-ready infrastructure.',
    keywords: ['AI agents', 'LLM', 'Agent SDK', 'MCP', 'Kubernetes', 'AI platform'],
    authors: [{ name: brand.name }],
    openGraph: {
      title: brand.longName,
      description: 'Build, deploy, and scale intelligent AI agents',
      type: 'website',
    },
  }
}

const Logo = ({ brand }: { brand: Brand }) => (
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
    <span>{brand.short}</span>
  </span>
)

const FooterContent = ({ brand }: { brand: Brand }) => (
  <div className="w-full bg-background">
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-4">
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted">
          © {new Date().getFullYear()} {brand.name}. Open Source.
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
  // Runtime brand resolved on the server; passed as a prop into the client
  // BrandProvider so SSR and hydration agree (no process.env read on the client).
  const brand = getBrand()

  return (
    <html lang="en" suppressHydrationWarning>
      <Head faviconGlyph="+" />
      <body>
        <BrandProvider brand={brand}>
          <I18nWrapper>
          <PlatformNavBar />
          <Layout
            navbar={
              <Navbar
                logo={<Logo brand={brand} />}
                projectLink={community.github}
              >
                <ThemeToggle />
              </Navbar>
            }
            footer={<Footer><FooterContent brand={brand} /></Footer>}
            pageMap={pageMap}
            docsRepositoryBase={getDocsRepositoryBase()}
            editLink="Edit this page on GitHub"
            search={<ErrorBoundary><AISearch /></ErrorBoundary>}
          >
            {children}
          </Layout>
          </I18nWrapper>
        </BrandProvider>
      </body>
    </html>
  )
}
