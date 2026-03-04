# @mostajs/settings

> Reusable key-value settings module with typed factory, React provider, and auto-generated form.

[![npm version](https://img.shields.io/npm/v/@mostajs/settings.svg)](https://www.npmjs.com/package/@mostajs/settings)
[![license](https://img.shields.io/npm/l/@mostajs/settings.svg)](LICENSE)

Part of the [@mosta suite](https://mostajs.dev).

---

## Installation

```bash
npm install @mostajs/settings @mostajs/orm
```

## Quick Start

### 1. Register schema and create settings module

```typescript
import { registerSchema } from '@mostajs/orm'
import { SettingSchema, createSettingsModule } from '@mostajs/settings'

registerSchema(SettingSchema)

const DEFAULTS = {
  siteName: 'MyApp',
  maintenanceMode: false,
  theme: 'system' as 'light' | 'dark' | 'system',
}

export const { getSettings, updateSettings } = createSettingsModule({ defaults: DEFAULTS })
```

### 2. Use in API routes

```typescript
const settings = await getSettings()
console.log(settings.siteName) // fully typed

await updateSettings({ maintenanceMode: true })
```

### 3. React provider & hook

```tsx
import { SettingsProvider } from '@mostajs/settings/components/SettingsProvider'
import { useSettings } from '@mostajs/settings/hooks/useSettings'

// In layout:
<SettingsProvider defaults={DEFAULTS}>
  {children}
</SettingsProvider>

// In component:
const { settings, update } = useSettings()
```

### 4. Auto-generated admin form

```tsx
import { SettingsForm } from '@mostajs/settings/components/SettingsForm'

<SettingsForm
  settings={settings}
  definitions={[
    { key: 'siteName', type: 'string', label: 'Site Name' },
    { key: 'maintenanceMode', type: 'boolean', label: 'Maintenance Mode' },
    { key: 'theme', type: 'select', label: 'Theme', options: ['light', 'dark', 'system'] },
  ]}
  onSave={handleSave}
/>
```

## API Reference

| Export | Description |
|--------|-------------|
| `createSettingsModule(config)` | Factory returning typed `getSettings()` / `updateSettings()` |
| `SettingRepository` | Repository with `findByKey()`, `upsertByKey()`, `upsertMany()` |
| `SettingSchema` | Entity schema for registration |
| `createSettingsHandlers()` | API route factory (GET/PUT) |
| `SettingsProvider` | React context provider |
| `SettingsForm` | Auto-generated settings form component |
| `useSettings()` | React hook for settings context |

## Related Packages

- [@mostajs/orm](https://www.npmjs.com/package/@mostajs/orm) — Multi-dialect ORM (required)

## License

MIT — © 2025 Dr Hamid MADANI <drmdh@msn.com>
