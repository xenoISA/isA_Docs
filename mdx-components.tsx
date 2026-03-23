import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import {
  FeatureCard,
  FeatureGrid,
  CodeTabs,
  CodeBlock,
  ApiExample,
  FeedbackWidget,
  StatusBadge,
  ServiceStatus,
  ApiPlayground,
  DemoPlayground,
  AISearch,
  ErrorBoundary,
} from './components'

const docsComponents = getDocsMDXComponents()

// Wrap interactive components in error boundaries
function SafeApiPlayground(props: Record<string, unknown>) {
  return <ErrorBoundary><ApiPlayground {...props as any} /></ErrorBoundary>
}
function SafeDemoPlayground(props: Record<string, unknown>) {
  return <ErrorBoundary><DemoPlayground {...props as any} /></ErrorBoundary>
}
function SafeAISearch() {
  return <ErrorBoundary><AISearch /></ErrorBoundary>
}

// Custom components available in all MDX files
const customComponents = {
  // Feature cards with icons
  FeatureCard,
  FeatureGrid,

  // Code examples
  CodeTabs,
  CodeBlock,
  ApiExample,

  // Interactive elements (wrapped in error boundaries)
  ApiPlayground: SafeApiPlayground,
  DemoPlayground: SafeDemoPlayground,
  AISearch: SafeAISearch,

  // Feedback and status
  FeedbackWidget,
  StatusBadge,
  ServiceStatus,

  // Error boundary (available directly in MDX)
  ErrorBoundary,
}

export function useMDXComponents(components?: Record<string, React.ComponentType>) {
  return {
    ...docsComponents,
    ...customComponents,
    ...components,
  }
}
