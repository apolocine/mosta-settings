// @mostajs/settings — Module info (schemas, seeds, metadata)
// Author: Dr Hamid MADANI drmdh@msn.com

import { SettingSchema } from '../schemas/setting.schema.js'

export function getSchemas() {
  return [SettingSchema]
}

export const moduleInfo = {
  name: 'settings',
  version: '2.1.0',
  label: 'Paramètres',
  description: 'Key-value settings with typed defaults',
  schemas: getSchemas,
  seed: async () => {
    // Settings has no default seed — app provides defaults via createSettingsModule()
    return {}
  },
}
