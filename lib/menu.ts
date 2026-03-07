// @mostajs/settings — Menu contribution
// Author: Dr Hamid MADANI drmdh@msn.com

import { Settings } from 'lucide-react'
import type { ModuleMenuContribution } from '@mostajs/menu'

export const settingsMenuContribution: ModuleMenuContribution = {
  moduleKey: 'settings',
  mergeIntoGroup: 'Administration',
  order: 90,
  items: [
    {
      label: 'settings.title',
      href: '/dashboard/settings',
      icon: Settings,
      permission: 'admin:settings',
    },
  ],
}
