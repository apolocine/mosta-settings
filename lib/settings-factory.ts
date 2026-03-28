// @mosta/settings — Factory for typed settings module
// Author: Dr Hamid MADANI drmdh@msn.com

import { getSettingsRepo } from './settings-repo-factory.js'
import type { MostaSettingsConfig } from '../types/index.js'

/**
 * Creates a fully typed settings module from your defaults.
 *
 * Usage:
 *   const appSettings = createSettingsModule({ defaults: { dark: false, maxSize: 10 } })
 *   const s = await appSettings.getSettings() // { dark: boolean, maxSize: number }
 */
export function createSettingsModule<T extends Record<string, any>>(config: MostaSettingsConfig<T>) {
  type Settings = T

  /**
   * Load settings from DB merged over defaults.
   * Always returns a complete object (every key present).
   * Falls back to defaults on DB error.
   */
  async function getSettings(): Promise<Settings> {
    try {
      const r = await getSettingsRepo()
      const db = await r.findAllSettings()
      const result = { ...config.defaults } as any
      for (const key of Object.keys(config.defaults)) {
        if (key in db && db[key] !== undefined) {
          result[key] = db[key]
        }
      }
      return result as Settings
    } catch {
      return { ...config.defaults }
    }
  }

  /**
   * Update one or more settings.
   * Validates values if validators are configured.
   * Returns the full settings object after update.
   */
  async function updateSettings(updates: Partial<Settings>): Promise<Settings> {
    const r = await getSettingsRepo()
    for (const [key, value] of Object.entries(updates)) {
      if (!(key in config.defaults)) continue
      const validator = config.validators?.[key as keyof T]
      if (validator && !validator(value)) {
        throw new Error(`Invalid value for setting "${key}"`)
      }
      await r.upsertByKey(key, value)
    }
    return getSettings()
  }

  /** Reset a single setting to its default value */
  async function resetSetting(key: keyof Settings): Promise<void> {
    const r = await getSettingsRepo()
    await r.deleteByKey(key as string)
  }

  /** Reset ALL settings to defaults */
  async function resetAll(): Promise<void> {
    const r = await getSettingsRepo()
    for (const key of Object.keys(config.defaults)) {
      await r.deleteByKey(key)
    }
  }

  return {
    getSettings,
    updateSettings,
    resetSetting,
    resetAll,
    defaults: config.defaults,
    config,
  }
}
