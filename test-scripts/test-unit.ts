// @mostajs/settings — Tests unitaires (no DB needed)
// Author: Dr Hamid MADANI drmdh@msn.com

import {
  createScopedKey,
  parseScopedKey,
} from '../lib/scoped-settings.js'

import { moduleInfo } from '../lib/module-info.js'

let passed = 0
let failed = 0

function assert(condition: boolean, label: string) {
  if (condition) { passed++; console.log('  ✅', label) }
  else { failed++; console.error('  ❌', label) }
}

async function run() {
  // ── T1 — Scoped keys ──
  console.log('T1 — Scoped keys')
  assert(createScopedKey('theme', 'global') === 'theme', 'global scope → plain key')
  assert(createScopedKey('theme', 'proj1') === 'proj1::theme', 'proj1 scope → proj1::theme')
  assert(createScopedKey('db_host', 'abc123') === 'abc123::db_host', 'abc123 scope → abc123::db_host')
  console.log('')

  // ── T2 — Parse scoped keys ──
  console.log('T2 — Parse scoped keys')
  const p1 = parseScopedKey('theme')
  assert(p1.key === 'theme' && p1.scope === 'global', 'plain key → scope global')

  const p2 = parseScopedKey('proj1::theme')
  assert(p2.key === 'theme' && p2.scope === 'proj1', 'proj1::theme → scope proj1, key theme')

  const p3 = parseScopedKey('abc::x::y')
  assert(p3.scope === 'abc' && p3.key === 'x::y', 'abc::x::y → scope abc, key x::y')
  console.log('')

  // ── T3 — Module info ──
  console.log('T3 — Module info')
  assert(moduleInfo.version === '2.1.0', 'moduleInfo.version === 2.1.0')
  assert(moduleInfo.name === 'settings', 'moduleInfo.name === settings')
  console.log('')

  // ── Summary ──
  console.log('════════════════════════════════════════')
  console.log(`  Resultats: ${passed} passed, ${failed} failed`)
  console.log('════════════════════════════════════════')
  if (failed > 0) process.exit(1)
}

run().catch(e => { console.error('❌ Fatal:', e.message); process.exit(1) })
