// @mosta/settings — SettingsProvider
// Author: Dr Hamid MADANI drmdh@msn.com
'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { SettingsContext, type SettingsContextValue } from '../hooks/useSettings'

interface SettingsProviderProps<T extends Record<string, any>> {
  children: React.ReactNode
  /** Default values (client-safe, no DB import) */
  defaults: T
  /** API endpoint path (default: '/api/settings') */
  apiPath?: string
  /** Auto-refresh interval in ms (0 = disabled, default: 0) */
  refreshInterval?: number
}

export function SettingsProvider<T extends Record<string, any>>({
  children,
  defaults,
  apiPath = '/api/settings',
  refreshInterval = 0,
}: SettingsProviderProps<T>) {
  const [settings, setSettings] = useState<T>(defaults)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(apiPath)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setSettings({ ...defaults, ...json.data })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings')
      setSettings(defaults)
    } finally {
      setLoading(false)
    }
  }, [apiPath, defaults])

  const update = useCallback(async (updates: Partial<T>) => {
    try {
      setError(null)
      const res = await fetch(apiPath, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setSettings({ ...defaults, ...json.data })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings')
      throw err
    }
  }, [apiPath, defaults])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    if (refreshInterval > 0) {
      const id = setInterval(refresh, refreshInterval)
      return () => clearInterval(id)
    }
  }, [refresh, refreshInterval])

  const value: SettingsContextValue<T> = {
    settings,
    loading,
    error,
    refresh,
    update,
  }

  return (
    <SettingsContext.Provider value={value as any}>
      {children}
    </SettingsContext.Provider>
  )
}
