// @mosta/settings — Types
// Author: Dr Hamid MADANI drmdh@msn.com

export interface MostaSettingsConfig<T extends Record<string, any> = Record<string, any>> {
  /** Default values — source of truth for types */
  defaults: T
  /** Optional per-key validators */
  validators?: Partial<Record<keyof T, (value: any) => boolean>>
  /** UI groups for the settings form */
  groups?: SettingGroup[]
}

export interface SettingGroup {
  key: string
  label: string
  description?: string
  icon?: string
  settings: string[]
}

export interface SettingDefinition {
  key: string
  label: string
  description?: string
  type: 'boolean' | 'number' | 'string' | 'select' | 'json'
  options?: { label: string; value: string }[]
  min?: number
  max?: number
  step?: number
  placeholder?: string
}

export interface SettingDTO {
  id: string
  key: string
  value: unknown
  createdAt: string
  updatedAt: string
}
