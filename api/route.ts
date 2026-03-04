// @mosta/settings — API Route template
// Author: Dr Hamid MADANI drmdh@msn.com
//
// Copy this file to: src/app/api/settings/route.ts
// Then customize the imports for your project.
//
// Usage:
//   import { createSettingsHandlers } from '@mosta/settings/api/route'
//   import { appSettings } from '@/lib/app-settings'
//   import { checkPermission } from '@mosta/auth'
//   export const { GET, PUT } = createSettingsHandlers(appSettings, 'admin:settings')

import { NextResponse } from 'next/server'

type SettingsModule = {
  getSettings: () => Promise<Record<string, any>>
  updateSettings: (updates: Record<string, any>) => Promise<Record<string, any>>
}

type PermissionChecker = (permission: string) => Promise<{
  error: NextResponse | null
  session: any
}>

/**
 * Creates GET and PUT handlers for the settings API.
 * @param settings - The settings module from createSettingsModule()
 * @param permission - The permission required (e.g. 'admin:settings')
 * @param checkPermission - The permission checker function from @mosta/auth
 */
export function createSettingsHandlers(
  settings: SettingsModule,
  permission: string,
  checkPermission: PermissionChecker,
) {
  async function GET() {
    const { error } = await checkPermission(permission)
    if (error) return error

    const data = await settings.getSettings()
    return NextResponse.json({ data })
  }

  async function PUT(req: Request) {
    const { error } = await checkPermission(permission)
    if (error) return error

    const body = await req.json()
    const data = await settings.updateSettings(body)
    return NextResponse.json({ data })
  }

  return { GET, PUT }
}
