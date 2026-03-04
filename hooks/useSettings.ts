// @mosta/settings — useSettings hook
// Author: Dr Hamid MADANI drmdh@msn.com
'use client'

import { createContext, useContext } from 'react'

export interface SettingsContextValue<T = Record<string, any>> {
  settings: T
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  update: (updates: Partial<T>) => Promise<void>
}

export const SettingsContext = createContext<SettingsContextValue | null>(null)

/**
 * Access app settings from React context.
 * Must be wrapped in <SettingsProvider>.
 */
export function useSettings<T = Record<string, any>>(): SettingsContextValue<T> {
  const ctx = useContext(SettingsContext)
  if (!ctx) {
    throw new Error('useSettings must be used within a <SettingsProvider>')
  }
  return ctx as SettingsContextValue<T>
}
