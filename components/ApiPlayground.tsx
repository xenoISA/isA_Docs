'use client'

import React, { useState } from 'react'
import { surfaces } from '../lib/surfaces'

interface ApiPlaygroundProps {
  endpoint: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  defaultBody?: string
  defaultHeaders?: Record<string, string>
  baseUrl?: string
}

export function ApiPlayground({
  endpoint,
  method = 'POST',
  defaultBody = '{\n  "message": "Hello, world!"\n}',
  defaultHeaders = { 'Content-Type': 'application/json' },
  baseUrl = surfaces.api
}: ApiPlaygroundProps) {
  const [body, setBody] = useState(defaultBody)
  const [response, setResponse] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [responseTime, setResponseTime] = useState<number | null>(null)
  const [statusCode, setStatusCode] = useState<number | null>(null)

  const handleSubmit = async () => {
    if (!apiKey) {
      setError('Please enter your API key')
      return
    }

    setLoading(true)
    setError(null)
    setResponse(null)
    setResponseTime(null)
    setStatusCode(null)

    const startTime = performance.now()

    try {
      const res = await fetch(`${baseUrl}${endpoint}`, {
        method,
        headers: {
          ...defaultHeaders,
          'Authorization': `Bearer ${apiKey}`,
        },
        body: method !== 'GET' ? body : undefined,
      })

      const endTime = performance.now()
      setResponseTime(Math.round(endTime - startTime))
      setStatusCode(res.status)

      const data = await res.json()
      setResponse(JSON.stringify(data, null, 2))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  const methodColors: Record<string, string> = {
    GET: 'bg-green-500',
    POST: 'bg-blue-500',
    PUT: 'bg-yellow-500',
    DELETE: 'bg-red-500',
    PATCH: 'bg-purple-500',
  }

  return (
    <div className="my-6 border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-surface-muted border-b border-border">
        <span className={`px-2 py-1 text-xs font-bold text-white rounded ${methodColors[method]}`}>
          {method}
        </span>
        <code className="text-sm text-muted">{baseUrl}{endpoint}</code>
      </div>

      {/* API Key Input */}
      <div className="px-4 py-3 border-b border-border">
        <label className="block text-sm font-medium text-muted mb-2">
          API Key
        </label>
        <div className="relative">
          <input
            type={showApiKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full px-3 py-2 pr-20 text-sm border border-border-strong rounded-lg bg-surface focus:ring-2 focus:ring-focus-ring focus:border-transparent font-mono"
          />
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-subtle hover:text-muted"
          >
            {showApiKey ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      {/* Request Body */}
      {method !== 'GET' && (
        <div className="px-4 py-3 border-b border-border">
          <label className="block text-sm font-medium text-muted mb-2">
            Request Body
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border-strong rounded-lg bg-surface focus:ring-2 focus:ring-focus-ring focus:border-transparent font-mono"
            rows={8}
          />
        </div>
      )}

      {/* Submit Button */}
      <div className="px-4 py-3 border-b border-border bg-surface-muted">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Sending...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              Send Request
            </>
          )}
        </button>
      </div>

      {/* Response */}
      {(response || error) && (
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted">Response</span>
            {statusCode && responseTime && (
              <div className="flex items-center gap-3 text-xs">
                <span className={`px-2 py-0.5 rounded ${
                  statusCode >= 200 && statusCode < 300
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {statusCode}
                </span>
                <span className="text-subtle">{responseTime}ms</span>
              </div>
            )}
          </div>
          {error ? (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          ) : (
            <pre className="p-3 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-sm">
              <code>{response}</code>
            </pre>
          )}
        </div>
      )}
    </div>
  )
}

// Simulated playground for demo purposes (doesn't make real requests)
export function DemoPlayground({
  endpoint,
  method = 'POST',
  defaultBody = '{\n  "message": "Hello, world!"\n}',
  sampleResponse = '{\n  "status": "success",\n  "data": {\n    "id": "123",\n    "message": "Hello, world!"\n  }\n}',
}: {
  endpoint: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  defaultBody?: string
  sampleResponse?: string
}) {
  const [body, setBody] = useState(defaultBody)
  const [showResponse, setShowResponse] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDemo = () => {
    setLoading(true)
    setTimeout(() => {
      setShowResponse(true)
      setLoading(false)
    }, 800)
  }

  const methodColors: Record<string, string> = {
    GET: 'bg-green-500',
    POST: 'bg-blue-500',
    PUT: 'bg-yellow-500',
    DELETE: 'bg-red-500',
    PATCH: 'bg-purple-500',
  }

  return (
    <div className="my-6 border border-border rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 bg-surface-muted border-b border-border">
        <span className={`px-2 py-1 text-xs font-bold text-white rounded ${methodColors[method]}`}>
          {method}
        </span>
        <code className="text-sm text-muted">{surfaces.api}{endpoint}</code>
        <span className="ml-auto text-xs px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded">
          Demo Mode
        </span>
      </div>

      {method !== 'GET' && (
        <div className="px-4 py-3 border-b border-border">
          <label className="block text-sm font-medium text-muted mb-2">
            Request Body
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border-strong rounded-lg bg-surface focus:ring-2 focus:ring-focus-ring focus:border-transparent font-mono"
            rows={6}
          />
        </div>
      )}

      <div className="px-4 py-3 border-b border-border bg-surface-muted">
        <button
          onClick={handleDemo}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent-hover disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {loading ? 'Sending...' : 'Try It'}
        </button>
      </div>

      {showResponse && (
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted">Response</span>
            <div className="flex items-center gap-3 text-xs">
              <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                200
              </span>
              <span className="text-subtle">142ms</span>
            </div>
          </div>
          <pre className="p-3 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-sm">
            <code>{sampleResponse}</code>
          </pre>
        </div>
      )}
    </div>
  )
}
