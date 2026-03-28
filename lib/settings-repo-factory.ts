// settings-repo-factory.ts — Centralized repository factory for dual ORM/NET mode
// Author: Dr Hamid MADANI drmdh@msn.com

import { isNetMode } from './data-mode.js'
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
// Factory
// ============================================================

let _cached: ISettingRepository | null = null
let _schemaReady = false

export async function getSettingsRepo(): Promise<ISettingRepository> {
  if (_cached) return _cached

  if (isNetMode()) {
    await ensureSchemaNet()
    _cached = createNetRepo()
  } else {
    await ensureSchemaOrm()
    _cached = await createOrmRepo()
  }
  return _cached
}

export function resetSettingsRepo(): void { _cached = null; _schemaReady = false }

// ============================================================
// Schema init
// ============================================================

async function ensureSchemaOrm(): Promise<void> {
  if (_schemaReady) return
  const { registerSchemas } = await import('@mostajs/orm')
  registerSchemas([SettingSchema])
  _schemaReady = true
}

async function ensureSchemaNet(): Promise<void> {
  if (_schemaReady) return
  const { NetClient } = await import('@mostajs/net/client')
  const client = new NetClient({ url: process.env.MOSTA_NET_URL! })
  const result = await client.compareSchema(SettingSchema as any)
  if (!result.exists || !result.compatible) {
    await client.applySchema([SettingSchema as any])
  }
  _schemaReady = true
}

// ============================================================
// ORM mode
// ============================================================

async function createOrmRepo(): Promise<ISettingRepository> {
  const { getDialect } = await import('@mostajs/orm')
  const { SettingRepository } = await import('../repositories/setting.repository.js')
  return new SettingRepository(await getDialect()) as ISettingRepository
}

// ============================================================
// NET mode
// ============================================================

function createNetRepo(): ISettingRepository {
  const clientPromise = import('@mostajs/net/client').then(
    m => new m.NetClient({ url: process.env.MOSTA_NET_URL! })
  )

  return {
    async findByKey(key) {
      const c = await clientPromise
      return c.findOne('settings', { key })
    },

    async upsertByKey(key, value) {
      const c = await clientPromise
      return c.upsert('settings', { key }, { key, value })
    },

    async findAllSettings() {
      const c = await clientPromise
      const rows = await c.findAll<{ key: string; value: unknown }>('settings')
      const map: Record<string, unknown> = {}
      for (const row of rows) map[row.key] = row.value
      return map
    },

    async deleteByKey(key) {
      const c = await clientPromise
      const existing = await c.findOne<{ id: string }>('settings', { key })
      if (existing) {
        await c.delete('settings', existing.id)
        return true
      }
      return false
    },

    async upsertMany(settings) {
      const c = await clientPromise
      for (const [key, value] of Object.entries(settings)) {
        await c.upsert('settings', { key }, { key, value })
      }
    },
  }
}
