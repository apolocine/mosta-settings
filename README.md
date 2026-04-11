# @mostajs/settings

> Typed key-value settings with React provider and auto-generated form.
> Author: Dr Hamid MADANI drmdh@msn.com

## Install

```bash
npm install @mostajs/settings @mostajs/orm
```

## How to Use

### 1. Create Settings Module

```typescript
import { createSettingsModule } from '@mostajs/settings'

const appSettings = createSettingsModule({
  defaults: { darkMode: false, maxUploadSize: 10, companyName: 'Acme' },
  validators: { maxUploadSize: (v) => v > 0 && v < 100 },
})

const settings = await appSettings.getSettings() // { darkMode: false, maxUploadSize: 10, companyName: 'Acme' }
await appSettings.updateSettings({ darkMode: true })
await appSettings.resetSetting('darkMode')
```

### 2. React Components

```tsx
import { SettingsProvider, SettingsForm, useSettings } from '@mostajs/settings'

<SettingsProvider defaults={defaults} apiPath="/api/settings">
  <SettingsForm values={settings} definitions={fields} onSave={save} />
</SettingsProvider>
```

### 3. API Handler

```typescript
import { createSettingsHandlers } from '@mostajs/settings'
export const { GET, PUT } = createSettingsHandlers(settingsModule, 'admin:settings', checkPermission)
```

### 4. Module Info (for @mostajs/setup)

```typescript
import { getSchemas } from '@mostajs/settings/lib/module-info'
const schemas = getSchemas() // [SettingSchema]
```
