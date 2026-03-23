'use client'

import React, { useState, useRef, useEffect } from 'react'

// =============================================================================
// CONFIG
// =============================================================================
const SEARCH_API = '/api/search'

// =============================================================================
// TYPES
// =============================================================================
interface SearchResult {
  title: string
  description: string
  href: string
  category?: string
  score: number
}

// =============================================================================
// AI SEARCH COMPONENT
// =============================================================================
export function AISearch() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [answer, setAnswer] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cmd+K shortcut
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
        setTimeout(() => inputRef.current?.focus(), 100)
      }
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  // Click outside to close
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [isOpen])

  // Debounced search handler
  const handleInputChange = (q: string) => {
    setQuery(q)
    setError(null)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (q.length < 2) {
      setResults([])
      setAnswer(null)
      return
    }

    debounceRef.current = setTimeout(() => {
      performSearch(q)
    }, 300)
  }

  // Search API call with graceful error handling
  const performSearch = async (q: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(SEARCH_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, top_k: 5 }),
      })
      if (!res.ok) {
        throw new Error(`Search returned ${res.status}`)
      }
      const data = await res.json()
      setResults(data.results || [])
      setAnswer(data.answer || null)
    } catch (err) {
      console.error('Search failed:', err)
      setResults([])
      setAnswer(null)
      setError('Search is temporarily unavailable. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-subtle bg-surface-muted rounded-lg hover:bg-surface-muted"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline px-1.5 py-0.5 text-xs bg-surface-muted rounded">⌘K</kbd>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div ref={containerRef} className="relative w-full max-w-xl bg-surface rounded-xl shadow-2xl border border-border overflow-hidden">

            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <svg className="w-5 h-5 text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Search documentation..."
                className="flex-1 bg-transparent outline-none text-foreground"
                autoFocus
              />
              {loading && (
                <svg className="w-5 h-5 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
            </div>

            {/* AI Answer */}
            {answer && (
              <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-sm text-blue-700 dark:text-blue-300 border-b border-border">
                ✨ {answer}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 text-sm text-red-700 dark:text-red-300 border-b border-border flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Results */}
            <div className="max-h-80 overflow-y-auto">
              {results.map((r, i) => (
                <a
                  key={i}
                  href={r.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-surface-muted"
                >
                  <svg className="w-4 h-4 text-subtle flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{r.title}</div>
                    <div className="text-xs text-subtle truncate">{r.description}</div>
                  </div>
                  {r.category && (
                    <span className="text-xs px-2 py-0.5 bg-surface-muted text-subtle rounded">
                      {r.category}
                    </span>
                  )}
                </a>
              ))}
              {query.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-subtle">
                  Type to search documentation...
                </div>
              )}
              {query.length > 1 && !loading && results.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-subtle">
                  No results found
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-surface-muted border-t border-border text-xs text-subtle flex justify-between">
              <span>AI Search</span>
              <span>ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
