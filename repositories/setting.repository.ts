// @mosta/settings — SettingRepository
// Author: Dr Hamid MADANI drmdh@msn.com
import { BaseRepository } from '@mostajs/orm'
import { SettingSchema } from '../schemas/setting.schema'
import type { IDialect } from '@mostajs/orm'
import type { SettingDTO } from '../types'

export class SettingRepository extends BaseRepository<SettingDTO> {
  constructor(dialect: IDialect) {
    super(SettingSchema, dialect)
  }

  /** Find a setting by its key */
  async findByKey(key: string): Promise<SettingDTO | null> {
    return this.findOne({ key })
  }

  /** Upsert a setting by key */
  async upsertByKey(key: string, value: unknown): Promise<SettingDTO> {
    return this.upsert({ key }, { key, value })
  }

  /** Find all settings as a key-value map */
  async findAllSettings(): Promise<Record<string, unknown>> {
    const rows = await this.findAll()
    const map: Record<string, unknown> = {}
    for (const row of rows) {
      map[row.key] = row.value
    }
    return map
  }

  /** Delete a setting by key (reset to default) */
  async deleteByKey(key: string): Promise<boolean> {
    const setting = await this.findOne({ key })
    if (setting) {
      await this.delete(setting.id)
      return true
    }
    return false
  }

  /** Batch upsert multiple settings */
  async upsertMany(settings: Record<string, unknown>): Promise<void> {
    for (const [key, value] of Object.entries(settings)) {
      await this.upsertByKey(key, value)
    }
  }
}
