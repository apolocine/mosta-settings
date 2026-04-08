// @mostajs/settings — Scoped settings (global vs per-project)
// Author: Dr Hamid MADANI drmdh@msn.com

/**
 * Create a scoped settings module that supports both global and per-project settings.
 * Global settings have scope = 'global'.
 * Per-project settings have scope = projectId.
 * Per-project settings override global settings.
 */
export interface ScopedSettingsConfig<T extends Record<string, any>> {
  defaults: T
  validators?: Partial<Record<keyof T, (value: any) => boolean>>
  groups?: any[]
}

export function createScopedKey(key: string, scope: string): string {
  if (scope === 'global') return key
  return `${scope}::${key}`
}

export function parseScopedKey(scopedKey: string): { key: string; scope: string } {
  const idx = scopedKey.indexOf('::')
  if (idx === -1) return { key: scopedKey, scope: 'global' }
  return { key: scopedKey.slice(idx + 2), scope: scopedKey.slice(0, idx) }
}

/**
 * Resolve settings for a given scope.
 * Merges: defaults → global DB settings → scoped DB settings
 */
export async function resolveScopedSettings<T extends Record<string, any>>(
  repo: any,
  defaults: T,
  scope: string,
): Promise<T> {
  // Start with defaults
  const result = { ...defaults }

  // Load all settings from DB
  const allSettings = await repo.findAllSettings()

  // Apply global settings
  for (const [key, value] of Object.entries(allSettings)) {
    const parsed = parseScopedKey(key)
    if (parsed.scope === 'global' && parsed.key in result) {
      (result as any)[parsed.key] = value
    }
  }

  // Apply scoped settings (override global)
  if (scope !== 'global') {
    for (const [key, value] of Object.entries(allSettings)) {
      const parsed = parseScopedKey(key)
      if (parsed.scope === scope && parsed.key in result) {
        (result as any)[parsed.key] = value
      }
    }
  }

  return result
}

/**
 * Update a setting for a specific scope.
 */
export async function updateScopedSetting(
  repo: any,
  key: string,
  value: any,
  scope: string = 'global',
): Promise<void> {
  const scopedKey = createScopedKey(key, scope)
  await repo.upsertByKey(scopedKey, value)
}

/**
 * Delete a scoped setting (reset to global/default).
 */
export async function deleteScopedSetting(
  repo: any,
  key: string,
  scope: string,
): Promise<boolean> {
  if (scope === 'global') return false  // can't delete global via this
  const scopedKey = createScopedKey(key, scope)
  return repo.deleteByKey(scopedKey)
}
