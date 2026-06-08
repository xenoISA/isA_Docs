import Link from 'next/link'
import { getBrand } from '../lib/brand.server'

// Runtime brand (#332 / ADR 0007): server component reads BRAND_* per request so
// the landing prose rebrands per edition without a rebuild. force-dynamic is
// inherited from app/layout.tsx, so getBrand() runs at request time.
export default function HomePage() {
  const brand = getBrand()
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="max-w-[90rem] mx-auto px-6 pt-20 pb-16">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            Build intelligent AI agents
          </h1>
          <p className="mt-6 text-lg text-muted leading-relaxed">
            The {brand.short} platform provides everything you need to build, deploy, and manage AI agents.
            From simple chatbots to complex autonomous systems with tool use, human oversight, and durable execution.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/content/agent-sdk/quickstart"
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] rounded-md transition-colors"
            >
              Get started
            </Link>
            <Link
              href="/content/agent-sdk"
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-foreground bg-surface-muted hover:bg-surface rounded-md transition-colors"
            >
              Read the docs
            </Link>
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="max-w-[90rem] mx-auto px-6 py-12">
        <div className="max-w-3xl">
          <div className="rounded-lg overflow-hidden border border-border bg-surface">
            <div className="bg-surface-muted px-4 py-2 border-b border-border">
              <span className="text-xs text-subtle font-mono">quickstart.py</span>
            </div>
            <pre className="bg-gray-900 p-4 overflow-x-auto">
              <code className="text-sm text-gray-100 font-mono">{`from isa_agent_sdk import query

async for msg in query("Analyze this codebase"):
    if msg.is_text:
        print(msg.content, end="")
    elif msg.is_tool_use:
        print(f"Using {msg.tool_name}...")`}</code>
            </pre>
          </div>
          <p className="mt-4 text-sm text-subtle">
            Install with <code className="px-1.5 py-0.5 bg-surface-muted rounded text-foreground">pip install isa-agent-sdk</code>
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-[90rem] mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            title="Agent SDK"
            description="Build custom agents with Python. Streaming responses, tool execution, skills, and durable workflows."
            href="/content/agent-sdk"
          />
          <FeatureCard
            title="Tools & MCP"
            description="Access tools via Model Context Protocol. Web search, file operations, databases, and custom integrations."
            href="/content/agent-sdk/tools"
          />
          <FeatureCard
            title="Human-in-the-Loop"
            description="Request approvals, collect input, and review outputs. Durable execution survives restarts."
            href="/content/agent-sdk/human-in-the-loop"
          />
          <FeatureCard
            title="Streaming"
            description="Real-time responses with progress updates, tool visibility, and checkpoint handling."
            href="/content/agent-sdk/streaming"
          />
          <FeatureCard
            title="Skills System"
            description="Specialized behaviors via prompt injection. Code review, debugging, refactoring, and custom skills."
            href="/content/agent-sdk/skills"
          />
          <FeatureCard
            title="Cloud Deployment"
            description="Deploy agents to isolated VMs with auto-scaling, credential injection, and session management."
            href="/content/agent-sdk/deployment-guide"
          />
        </div>
      </section>

      {/* Documentation Links */}
      <section className="max-w-[90rem] mx-auto px-6 py-16 border-t border-border">
        <h2 className="text-xl font-semibold text-foreground mb-8">
          Documentation
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DocSection
            title="Getting Started"
            links={[
              { label: 'Quickstart', href: '/content/agent-sdk/quickstart' },
              { label: 'Configuration', href: '/content/agent-sdk/options' },
              { label: 'Streaming', href: '/content/agent-sdk/streaming' },
            ]}
          />
          <DocSection
            title="Core Concepts"
            links={[
              { label: 'Tools & MCP', href: '/content/agent-sdk/tools' },
              { label: 'Messages', href: '/content/agent-sdk/messages' },
              { label: 'Skills', href: '/content/agent-sdk/skills' },
            ]}
          />
          <DocSection
            title="Advanced"
            links={[
              { label: 'Human-in-the-Loop', href: '/content/agent-sdk/human-in-the-loop' },
              { label: 'Checkpointing', href: '/content/agent-sdk/checkpointing' },
              { label: 'Triggers', href: '/content/agent-sdk/triggers' },
            ]}
          />
          <DocSection
            title="Deployment"
            links={[
              { label: 'Deployment Guide', href: '/content/agent-sdk/deployment-guide' },
              { label: 'Testing', href: '/content/agent-sdk/testing' },
            ]}
          />
        </div>
      </section>

    </div>
  )
}

function FeatureCard({ title, description, href }: {
  title: string
  description: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="group block p-6 rounded-lg border border-border bg-surface hover:border-[var(--color-primary-600)] transition-colors"
    >
      <h3 className="text-base font-semibold text-foreground group-hover:text-[var(--color-primary-600)] transition-colors">
        {title}
      </h3>
      <p className="mt-2 text-sm text-muted leading-relaxed">
        {description}
      </p>
    </Link>
  )
}

function DocSection({ title, links }: {
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-3">
        {title}
      </h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-muted hover:text-[var(--color-primary-600)] transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
