// @mosta/settings — Barrel exports
// Author: Dr Hamid MADANI drmdh@msn.com

// Factory
export { createSettingsModule } from './lib/settings-factory'

// Repository & Schema
export { SettingRepository } from './repositories/setting.repository'
export { SettingSchema } from './schemas/setting.schema'

// Components
export { SettingsProvider } from './components/SettingsProvider'
export { SettingsForm } from './components/SettingsForm'

// Hooks
export { useSettings } from './hooks/useSettings'

// API helpers
export { createSettingsHandlers } from './api/route'

// Types
export type {
  MostaSettingsConfig,
  SettingGroup,
  SettingDefinition,
  SettingDTO,
} from './types'
