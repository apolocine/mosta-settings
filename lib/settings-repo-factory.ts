// settings-repo-factory.ts — Centralized repository factory
// Uses @mostajs/octoswitcher to get the right dialect (ORM or NET)
// Author: Dr Hamid MADANI drmdh@msn.com

import { SettingSchema } from '../schemas/setting.schema.js'
import type { SettingDTO } from '../types/index.js'

// ============================================================
// Repository interface
// ============================================================

export interface ISettingRepository {
  findByKey(key: string): Promise<SettingDTO | null>
  upsertByKey(key: string, value: unknown): Promise<SettingDTO>
  findAllSettings(): Promise<Record<string, unknown>>
  deleteByKey(key: string): Promise<boolean>
  upsertMany(settings: Record<string, unknown>): Promise<void>
}

// ============================================================
// Factory — dialect resolved by octoswitcher
// ============================================================

let _cached: ISettingRepository | null = null

/** Get settings repository — dialect resolved by octoswitcher (ORM or NET) */
export async function getSettingsRepo(): Promise<ISettingRepository> {
  if (_cached) return _cached

  const { getDialect } = await import('@mostajs/octoswitcher')
  const { registerSchemas } = await import('@mostajs/orm')
  const { SettingRepository } = await import('../repositories/setting.repository.js')

  registerSchemas([SettingSchema])
  const dialect = await getDialect()
  if (typeof (dialect as any).initSchema === 'function') {
    const { getAllSchemas } = await import('@mostajs/orm')
    await (dialect as any).initSchema(getAllSchemas())
  }
  _cached = new SettingRepository(dialect as any) as ISettingRepository
  return _cached
}

export function resetSettingsRepo(): void { _cached = null }
