import type { DataQuality, OfficialCostIndicator } from '../types/domain'
import { METAL_FIELDS } from '../data/fields'
import { NEGOTIATION_POINTS } from '../data/negotiation-points'
import { LEGAL_BASES } from '../data/legal-bases'
import { OFFICIAL_INDICATORS } from './data-loader'

// =============================================================================
// データ検証（設計書 9.3 / 仕様書 10 章）
// テスト（data-integrity.test.ts）と scripts/validate-data.ts の両方で使用する。
// =============================================================================

export interface ValidationIssue {
  source: string
  message: string
}

const VALID_CATEGORIES = ['material', 'energy', 'labor', 'consumables', 'other']
const VALID_QUALITIES = ['official_verified', 'official_manual', 'sample', 'deprecated']
const VALID_FREQUENCIES = ['monthly', 'quarterly', 'annual']

const REQUIRED_INDICATOR_FIELDS = [
  'id',
  'category',
  'name',
  'description',
  'publisher',
  'sourceName',
  'sourceUrl',
  'seriesName',
  'unit',
  'frequency',
  'publishedAt',
  'retrievedAt',
  'quality',
  'calculationNote',
  'negotiationUse',
] as const

function isIsoDate(value: unknown): boolean {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

/** 単一の指標を検証する。raw は JSON 由来の unknown を想定。 */
export function validateIndicator(raw: unknown, source: string): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const add = (message: string) => issues.push({ source, message })

  if (typeof raw !== 'object' || raw === null) {
    add('指標オブジェクトではありません')
    return issues
  }
  const obj = raw as Record<string, unknown>

  for (const field of REQUIRED_INDICATOR_FIELDS) {
    if (typeof obj[field] !== 'string' || obj[field] === '') {
      add(`必須項目 ${field} が欠落または空です`)
    }
  }

  if (typeof obj.category === 'string' && !VALID_CATEGORIES.includes(obj.category)) {
    add(`category が不正です: ${obj.category}`)
  }
  if (typeof obj.quality === 'string' && !VALID_QUALITIES.includes(obj.quality)) {
    add(`quality が不正です: ${obj.quality}`)
  }
  if (typeof obj.frequency === 'string' && !VALID_FREQUENCIES.includes(obj.frequency)) {
    add(`frequency が不正です: ${obj.frequency}`)
  }
  if (typeof obj.sourceUrl === 'string' && !obj.sourceUrl.startsWith('https://')) {
    add('sourceUrl は https:// で始まる必要があります')
  }
  if (!isIsoDate(obj.publishedAt)) {
    add('publishedAt が ISO 日付（YYYY-MM-DD）ではありません')
  }
  if (!isIsoDate(obj.retrievedAt)) {
    add('retrievedAt が ISO 日付（YYYY-MM-DD）ではありません')
  }

  const values = obj.values
  if (!Array.isArray(values) || values.length === 0) {
    add('values が空です')
  } else {
    let prevPeriod: string | null = null
    values.forEach((point, idx) => {
      if (typeof point !== 'object' || point === null) {
        add(`values[${idx}] が不正です`)
        return
      }
      const p = point as Record<string, unknown>
      if (typeof p.period !== 'string') {
        add(`values[${idx}].period が文字列ではありません`)
      }
      if (typeof p.value !== 'number' || Number.isNaN(p.value)) {
        add(`values[${idx}].value が数値ではありません`)
      }
      if (typeof p.period === 'string') {
        if (prevPeriod !== null && p.period <= prevPeriod) {
          add(`period が昇順ではありません: ${prevPeriod} -> ${p.period}`)
        }
        prevPeriod = p.period
      }
    })
  }

  return issues
}

/** 単一の法令ポイントを検証する。 */
export function validateLegalBasis(raw: unknown, source: string): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const add = (message: string) => issues.push({ source, message })

  if (typeof raw !== 'object' || raw === null) {
    add('法令オブジェクトではありません')
    return issues
  }
  const obj = raw as Record<string, unknown>

  const required = [
    'id',
    'lawName',
    'title',
    'plainSummary',
    'negotiationMeaning',
    'relatedUserAction',
    'sourceType',
    'sourceName',
    'sourceUrl',
    'checkedAt',
    'caution',
  ]
  for (const field of required) {
    if (typeof obj[field] !== 'string' || obj[field] === '') {
      add(`必須項目 ${field} が欠落または空です`)
    }
  }
  if (typeof obj.sourceUrl === 'string' && !obj.sourceUrl.startsWith('https://')) {
    add('sourceUrl は https:// で始まる必要があります')
  }
  if (!isIsoDate(obj.checkedAt)) {
    add('checkedAt が ISO 日付（YYYY-MM-DD）ではありません')
  }

  return issues
}

function countByQuality(indicators: OfficialCostIndicator[]): Record<DataQuality, number> {
  const counts: Record<DataQuality, number> = {
    official_verified: 0,
    official_manual: 0,
    sample: 0,
    deprecated: 0,
  }
  for (const i of indicators) counts[i.quality] += 1
  return counts
}

export function getQualityCounts(): Record<DataQuality, number> {
  return countByQuality(OFFICIAL_INDICATORS)
}

/** 本番ゲート: quality:"sample" の指標を検出する純関数（テスト・スクリプト共用）。 */
export function findSampleGateIssues(indicators: OfficialCostIndicator[]): ValidationIssue[] {
  return indicators
    .filter((i) => i.quality === 'sample')
    .map((i) => ({
      source: `official-indices/${i.id}.json`,
      message: '本番モードで quality:"sample" が残っています（公式データへ差し替えてください）',
    }))
}

/**
 * 全データを検証する。
 * production=true（NODE_ENV=production または VALIDATE_PRODUCTION=true）の場合、
 * quality: "sample" の指標が存在したらエラーとして報告する。
 */
export function validateAllData(options?: { production?: boolean }): ValidationIssue[] {
  const production = options?.production ?? false
  const issues: ValidationIssue[] = []
  const indicatorIds = new Set(OFFICIAL_INDICATORS.map((i) => i.id))

  // 指標個別検証
  for (const indicator of OFFICIAL_INDICATORS) {
    issues.push(...validateIndicator(indicator, `official-indices/${indicator.id}.json`))
    // 再取得性の担保: 日銀系指標は calculationNote に系列コードを持つこと
    if (indicator.publisher.includes('日本銀行') && !/PRCG20_|PRCS20_/.test(indicator.calculationNote)) {
      issues.push({
        source: `official-indices/${indicator.id}.json`,
        message: 'calculationNote に系列コード（PRCG20_/PRCS20_）がありません',
      })
    }
  }

  // 指標 ID 重複
  const seenIndicatorIds = new Set<string>()
  for (const i of OFFICIAL_INDICATORS) {
    if (seenIndicatorIds.has(i.id)) {
      issues.push({ source: 'official-indices', message: `指標 ID が重複しています: ${i.id}` })
    }
    seenIndicatorIds.add(i.id)
  }

  // 分野 ID 重複・参照整合
  const seenFieldIds = new Set<string>()
  for (const field of METAL_FIELDS) {
    if (seenFieldIds.has(field.id)) {
      issues.push({ source: 'fields.ts', message: `分野 ID が重複しています: ${field.id}` })
    }
    seenFieldIds.add(field.id)
    for (const id of field.relatedIndicatorIds) {
      if (!indicatorIds.has(id)) {
        issues.push({ source: 'fields.ts', message: `${field.id} が未知の indicatorId を参照: ${id}` })
      }
    }
  }

  // 交渉ポイントの参照整合
  const fieldIds = new Set(METAL_FIELDS.map((f) => f.id))
  const fieldRelated = new Map(METAL_FIELDS.map((f) => [f.id, new Set(f.relatedIndicatorIds)]))
  for (const point of NEGOTIATION_POINTS) {
    if (!fieldIds.has(point.fieldId)) {
      issues.push({
        source: 'negotiation-points.ts',
        message: `${point.id} が未知の fieldId を参照: ${point.fieldId}`,
      })
    }
    const related = fieldRelated.get(point.fieldId)
    for (const id of point.indicatorIds) {
      if (!indicatorIds.has(id)) {
        issues.push({
          source: 'negotiation-points.ts',
          message: `${point.id} が未知の indicatorId を参照: ${id}`,
        })
      } else if (related && !related.has(id)) {
        // 表示指標（fields.relatedIndicatorIds）と説明・根拠一覧を一致させる
        issues.push({
          source: 'negotiation-points.ts',
          message: `${point.id} の indicatorId ${id} は分野 ${point.fieldId} の relatedIndicatorIds に含まれません（表示指標と不一致）`,
        })
      }
    }
  }

  // 法令検証・重複
  const seenLegalIds = new Set<string>()
  for (const legal of LEGAL_BASES) {
    issues.push(...validateLegalBasis(legal, `legal-bases.ts (${legal.id})`))
    if (seenLegalIds.has(legal.id)) {
      issues.push({ source: 'legal-bases.ts', message: `法令 ID が重複しています: ${legal.id}` })
    }
    seenLegalIds.add(legal.id)
  }

  // 本番ゲート: sample データの検出
  if (production) {
    issues.push(...findSampleGateIssues(OFFICIAL_INDICATORS))
  }

  return issues
}
