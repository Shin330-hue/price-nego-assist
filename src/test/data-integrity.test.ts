import { describe, expect, it } from 'vitest'
import type { OfficialCostIndicator } from '../types/domain'
import { METAL_FIELDS } from '../data/fields'
import { NEGOTIATION_POINTS } from '../data/negotiation-points'
import { LEGAL_BASES } from '../data/legal-bases'
import { OFFICIAL_INDICATORS } from '../lib/data-loader'
import { findSampleGateIssues, validateAllData } from '../lib/data-validation'

const baseIndicator: OfficialCostIndicator = {
  id: 'x',
  category: 'material',
  name: 'n',
  description: '',
  publisher: 'p',
  sourceName: 's',
  sourceUrl: 'https://example.com',
  seriesName: 'sn',
  unit: 'u',
  frequency: 'monthly',
  publishedAt: '2026-01-01',
  retrievedAt: '2026-01-01',
  quality: 'official_manual',
  calculationNote: '',
  negotiationUse: '',
  values: [{ period: '2026-01', value: 1 }],
}

const indicatorIds = new Set(OFFICIAL_INDICATORS.map((i) => i.id))
const fieldIds = new Set(METAL_FIELDS.map((f) => f.id))

describe('データ整合性', () => {
  it('METAL_FIELDS は 8 件', () => {
    expect(METAL_FIELDS).toHaveLength(8)
  })

  it('分野 ID に重複がない', () => {
    expect(new Set(METAL_FIELDS.map((f) => f.id)).size).toBe(METAL_FIELDS.length)
  })

  it('指標 ID に重複がない', () => {
    expect(indicatorIds.size).toBe(OFFICIAL_INDICATORS.length)
  })

  it('法令 ID に重複がない', () => {
    expect(new Set(LEGAL_BASES.map((b) => b.id)).size).toBe(LEGAL_BASES.length)
  })

  it('全 relatedIndicatorIds が存在する指標を参照している', () => {
    for (const field of METAL_FIELDS) {
      for (const id of field.relatedIndicatorIds) {
        expect(indicatorIds.has(id), `${field.id} -> ${id}`).toBe(true)
      }
    }
  })

  it('全 negotiationPoints の fieldId / indicatorIds が存在する', () => {
    for (const point of NEGOTIATION_POINTS) {
      expect(fieldIds.has(point.fieldId), `${point.id} fieldId`).toBe(true)
      for (const id of point.indicatorIds) {
        expect(indicatorIds.has(id), `${point.id} -> ${id}`).toBe(true)
      }
    }
  })

  it('全 LegalBasis に sourceUrl と checkedAt がある', () => {
    for (const b of LEGAL_BASES) {
      expect(b.sourceUrl.startsWith('https://'), `${b.id} sourceUrl`).toBe(true)
      expect(b.checkedAt, `${b.id} checkedAt`).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  it('validateAllData（開発モード）は問題ゼロ', () => {
    const issues = validateAllData({ production: false })
    expect(issues, JSON.stringify(issues, null, 2)).toHaveLength(0)
  })

  it('全指標が official 化され、本番モードでも問題ゼロ', () => {
    const issues = validateAllData({ production: true })
    expect(issues, JSON.stringify(issues, null, 2)).toHaveLength(0)
  })

  it('findSampleGateIssues は sample のみを本番ゲートで検出する', () => {
    const sample: OfficialCostIndicator = { ...baseIndicator, id: 's', quality: 'sample' }
    const official: OfficialCostIndicator = { ...baseIndicator, id: 'o', quality: 'official_manual' }
    expect(findSampleGateIssues([sample, official])).toHaveLength(1)
    expect(findSampleGateIssues([official])).toHaveLength(0)
  })
})
