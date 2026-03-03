'use client'

import React, { useState, useEffect } from 'react'
import { surfaces } from '../lib/surfaces'

type StatusType = 'operational' | 'degraded' | 'outage' | 'maintenance' | 'loading'

interface StatusBadgeProps {
  statusUrl?: string
  service?: string
}

const statusConfig: Record<StatusType, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  operational: {
    label: 'All Systems Operational',
    color: 'text-green-700 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
  },
  degraded: {
    label: 'Degraded Performance',
    color: 'text-yellow-700 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
  },
  outage: {
    label: 'Service Outage',
    color: 'text-red-700 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
  },
  maintenance: {
    label: 'Under Maintenance',
    color: 'text-blue-700 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
      </svg>
    ),
  },
  loading: {
    label: 'Checking Status...',
    color: 'text-subtle',
    bgColor: 'bg-surface-muted',
    icon: (
      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    ),
  },
}

export function StatusBadge({ statusUrl, service }: StatusBadgeProps) {
  const [status, setStatus] = useState<StatusType>('loading')

  useEffect(() => {
    // In production, fetch from your status page API
    // For demo, simulate operational status after brief loading
    const timer = setTimeout(() => {
      setStatus('operational')
    }, 1000)

    return () => clearTimeout(timer)
  }, [statusUrl])

  const config = statusConfig[status]

  return (
    <a
      href={statusUrl || surfaces.status}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${config.bgColor} ${config.color} hover:opacity-80 transition-opacity`}
    >
      {config.icon}
      <span>{service ? `${service}: ` : ''}{config.label}</span>
    </a>
  )
}

// Individual service status for status page
interface ServiceStatusProps {
  name: string
  status: StatusType
  uptime?: string
  responseTime?: string
}

export function ServiceStatus({ name, status, uptime, responseTime }: ServiceStatusProps) {
  const config = statusConfig[status]

  return (
    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`p-1 rounded-full ${config.bgColor}`}>
          {config.icon}
        </div>
        <div>
          <p className="font-medium text-foreground">{name}</p>
          <p className={`text-sm ${config.color}`}>{config.label}</p>
        </div>
      </div>
      {(uptime || responseTime) && (
        <div className="text-right text-sm text-subtle">
          {uptime && <p>Uptime: {uptime}</p>}
          {responseTime && <p>Response: {responseTime}</p>}
        </div>
      )}
    </div>
  )
}
