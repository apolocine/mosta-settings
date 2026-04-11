// @mostajs/settings — Runtime module registration
// Author: Dr Hamid MADANI drmdh@msn.com

import type { ModuleRegistration } from '@mostajs/socle'
import { SettingSchema } from './schemas/setting.schema.js'
import { SettingRepository } from './repositories/setting.repository.js'
import { settingsMenuContribution } from './lib/menu.js'

export function register(registry: { register(r: ModuleRegistration): void }): void {
  registry.register({
    manifest: {
      name: 'settings',
      package: '@mostajs/settings',
      version: '2.0.0',
      type: 'core',
      priority: 5,
      dependencies: ['auth'],
      displayName: 'Settings',
      description: 'Application settings — key-value store with typed access',
      icon: 'Settings',
      register: './dist/register.js',
    },

    schemas: [
      { name: 'Setting', schema: SettingSchema },
    ],

    repositories: {
      settingRepo: (dialect: unknown) => new SettingRepository(dialect as never),
    },

    permissions: {
      permissions: { ADMIN_SETTINGS: 'admin:settings' },
      definitions: [
        { code: 'admin:settings', name: 'admin:settings', description: 'Gérer les paramètres système', category: 'admin' },
      ],
      categories: [],
    },

    menu: settingsMenuContribution,
  })
}
