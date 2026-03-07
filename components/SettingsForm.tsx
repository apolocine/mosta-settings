// @mosta/settings — SettingsForm (auto-generated form from definitions)
// Author: Dr Hamid MADANI drmdh@msn.com
'use client'

import React, { useState } from 'react'
import type { SettingDefinition, SettingGroup } from '../types/index'

interface SettingsFormProps {
  /** Current settings values */
  values: Record<string, any>
  /** Setting definitions (type, label, validation) */
  definitions: SettingDefinition[]
  /** Optional grouping */
  groups?: SettingGroup[]
  /** Callback on save */
  onSave: (updates: Record<string, any>) => Promise<void>
  /** Callback on reset a single key */
  onReset?: (key: string) => Promise<void>
  /** Saving state */
  saving?: boolean
}

/**
 * Auto-generated settings form.
 * Renders inputs based on SettingDefinition type.
 *
 * Uses basic HTML inputs — wrap or replace with your UI library (shadcn, etc.)
 */
export function SettingsForm({
  values,
  definitions,
  groups,
  onSave,
  onReset,
  saving = false,
}: SettingsFormProps) {
  const [draft, setDraft] = useState<Record<string, any>>({})
  const [error, setError] = useState<string | null>(null)

  const hasChanges = Object.keys(draft).length > 0

  function getValue(key: string) {
    return key in draft ? draft[key] : values[key]
  }

  function onChange(key: string, value: any) {
    setDraft((prev) => {
      const next = { ...prev, [key]: value }
      // Remove from draft if equal to original
      if (value === values[key]) delete next[key]
      return next
    })
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!hasChanges) return
    try {
      setError(null)
      await onSave(draft)
      setDraft({})
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de sauvegarde')
    }
  }

  function renderField(def: SettingDefinition) {
    const val = getValue(def.key)
    const modified = def.key in draft

    switch (def.type) {
      case 'boolean':
        return (
          <label key={def.key} style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={!!val}
              onChange={(e) => onChange(def.key, e.target.checked)}
            />
            <span>{def.label}</span>
            {def.description && <small style={{ color: '#666' }}>— {def.description}</small>}
            {modified && <span style={{ color: '#f59e0b', fontSize: 12 }}>(modifié)</span>}
          </label>
        )

      case 'number':
        return (
          <div key={def.key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label>
              {def.label}
              {modified && <span style={{ color: '#f59e0b', fontSize: 12 }}> (modifié)</span>}
            </label>
            {def.description && <small style={{ color: '#666' }}>{def.description}</small>}
            <input
              type="number"
              value={val ?? ''}
              min={def.min}
              max={def.max}
              step={def.step}
              onChange={(e) => onChange(def.key, parseFloat(e.target.value))}
            />
          </div>
        )

      case 'select':
        return (
          <div key={def.key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label>
              {def.label}
              {modified && <span style={{ color: '#f59e0b', fontSize: 12 }}> (modifié)</span>}
            </label>
            {def.description && <small style={{ color: '#666' }}>{def.description}</small>}
            <select value={val ?? ''} onChange={(e) => onChange(def.key, e.target.value)}>
              {def.options?.map((opt: { label: string; value: string }) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )

      case 'json':
        return (
          <div key={def.key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label>
              {def.label}
              {modified && <span style={{ color: '#f59e0b', fontSize: 12 }}> (modifié)</span>}
            </label>
            {def.description && <small style={{ color: '#666' }}>{def.description}</small>}
            <textarea
              rows={4}
              value={typeof val === 'string' ? val : JSON.stringify(val, null, 2)}
              onChange={(e) => {
                try { onChange(def.key, JSON.parse(e.target.value)) }
                catch { onChange(def.key, e.target.value) }
              }}
            />
          </div>
        )

      default: // string
        return (
          <div key={def.key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label>
              {def.label}
              {modified && <span style={{ color: '#f59e0b', fontSize: 12 }}> (modifié)</span>}
            </label>
            {def.description && <small style={{ color: '#666' }}>{def.description}</small>}
            <input
              type="text"
              value={val ?? ''}
              placeholder={def.placeholder}
              onChange={(e) => onChange(def.key, e.target.value)}
            />
          </div>
        )
    }
  }

  function renderGroup(group: SettingGroup) {
    const groupDefs = definitions.filter((d) => group.settings.includes(d.key))
    if (groupDefs.length === 0) return null

    return (
      <fieldset key={group.key} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
        <legend style={{ fontWeight: 600 }}>{group.label}</legend>
        {group.description && <p style={{ color: '#666', marginBottom: 12 }}>{group.description}</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {groupDefs.map(renderField)}
        </div>
      </fieldset>
    )
  }

  // Keys already in groups
  const grouped = new Set(groups?.flatMap((g) => g.settings) ?? [])
  const ungrouped = definitions.filter((d) => !grouped.has(d.key))

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {groups?.map(renderGroup)}

      {ungrouped.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ungrouped.map(renderField)}
        </div>
      )}

      {error && <p style={{ color: '#ef4444' }}>{error}</p>}

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={!hasChanges || saving}>
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
        {hasChanges && (
          <button type="button" onClick={() => setDraft({})}>
            Annuler
          </button>
        )}
      </div>
    </form>
  )
}
