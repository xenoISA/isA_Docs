'use client'

import React, { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="my-4 rounded-lg border border-border bg-surface-muted px-4 py-6 text-center">
          <p className="text-sm font-medium text-foreground">
            Something went wrong
          </p>
          <p className="mt-1 text-xs text-muted">
            This component failed to render.
          </p>
          <button
            onClick={this.handleRetry}
            className="mt-3 inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] rounded-md transition-colors"
          >
            Retry
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
