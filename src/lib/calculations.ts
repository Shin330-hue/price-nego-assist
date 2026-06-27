import type { CostDataPoint, OfficialCostIndicator, DataFrequency } from '../types/domain'

// =============================================================================
// 計算ユーティリティ（仕様書 6 章 / 設計書 6 章）
//
// 重要:
// - 基準年比・表示期間内変化率・前年比を混同しない。
// - 前年比は frequency に応じた前年同期と比較する。「5データポイント前」固定比較は禁止。
// =============================================================================

/** values は昇順ソート済みを前提とする（順序はテストで検証）。 */
export function getLatestPoint(values: CostDataPoint[]): CostDataPoint | null {
  return values.at(-1) ?? null
}

export function getFirstPoint(values: CostDataPoint[]): CostDataPoint | null {
  return values.at(0) ?? null
}

/**
 * 基準年比。baseYear（例 "2020", 基準=100）がある場合のみ。
 * 計算式: ((latest - 100) / 100) * 100
 */
export function calculateBaseYearChange(indicator: OfficialCostIndicator): number | null {
  if (!indicator.baseYear) return null
  const latest = getLatestPoint(indicator.values)
  if (!latest) return null
  return ((latest.value - 100) / 100) * 100
}

/**
 * 表示期間内変化率。データ配列の先頭値から最新値への変化。
 * 計算式: ((latest - first) / first) * 100。先頭値が 0 の場合は null。
 */
export function calculateDisplayPeriodChange(indicator: OfficialCostIndicator): number | null {
  const first = getFirstPoint(indicator.values)
  const latest = getLatestPoint(indicator.values)
  if (!first || !latest) return null
  if (first.value === 0) return null
  return ((latest.value - first.value) / first.value) * 100
}

/** period 文字列の先頭4桁（年）を1つ減らす。"2026-05"→"2025-05" / "2026"→"2025"。 */
function previousYearPeriod(period: string): string | null {
  const match = /^(\d{4})(.*)$/.exec(period)
  if (!match) return null
  const year = Number(match[1])
  const suffix = match[2] ?? ''
  if (!Number.isFinite(year)) return null
  return `${year - 1}${suffix}`
}

const FREQUENCY_STEP: Record<DataFrequency, number> = {
  monthly: 12,
  quarterly: 4,
  annual: 1,
}

/**
 * 前年比。frequency に応じた前年同期を探す。
 * 見つからない場合は frequency 相当（月次12・四半期4・年次1）件前にフォールバック。
 * 比較先がない、または比較先値が 0 の場合は null。
 */
export function calculateYoYChange(indicator: OfficialCostIndicator): number | null {
  const { values, frequency } = indicator
  const latest = getLatestPoint(values)
  if (!latest) return null

  // 1) 前年同期を period 一致で探す
  const priorPeriod = previousYearPeriod(latest.period)
  let prior: CostDataPoint | undefined
  if (priorPeriod) {
    prior = values.find((p) => p.period === priorPeriod)
  }

  // 2) フォールバック: frequency 相当の件数前
  if (!prior) {
    const step = FREQUENCY_STEP[frequency]
    const priorIndex = values.length - 1 - step
    if (priorIndex < 0) return null
    prior = values[priorIndex]
  }

  if (!prior || prior.value === 0) return null
  return ((latest.value - prior.value) / prior.value) * 100
}

/** 公的確認済み（official_verified / official_manual）以外のデータが含まれるか。 */
export function hasNonOfficialData(indicators: OfficialCostIndicator[]): boolean {
  return indicators.some(
    (i) => i.quality !== 'official_verified' && i.quality !== 'official_manual',
  )
}

/** サンプルデータ（quality: "sample"）が含まれるか。 */
export function hasSampleData(indicators: OfficialCostIndicator[]): boolean {
  return indicators.some((i) => i.quality === 'sample')
}

/** 変化率を「±X.X%」形式で表示。null は "—"。signed=true で正値に + を付ける。 */
export function formatRate(value: number | null, options?: { signed?: boolean }): string {
  if (value === null || Number.isNaN(value)) return '—'
  const sign = options?.signed && value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}

/** 指標値を表示用に整形。円は整数＋桁区切り、指数は小数1桁（原則）。 */
export function formatValue(value: number, unit: string): string {
  const isInteger = Number.isInteger(value)
  const isYen = unit.includes('円')
  const decimals = isYen || isInteger ? 0 : 1
  return value.toLocaleString('ja-JP', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}
