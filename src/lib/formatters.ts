import type { DataFrequency, OfficialCostIndicator } from '../types/domain'
import { getFirstPoint } from './calculations'

// =============================================================================
// 表示用フォーマッタ（ラベル・期間・日付）
// 基準年比 / 表示期間内変化率 のラベルは固定文字列にせず、データから動的生成する。
// =============================================================================

/** period を人が読める形に。"2025-01"→"2025年1月" / "2020"→"2020年"。 */
export function formatPeriod(period: string, frequency: DataFrequency): string {
  if (frequency === 'annual') return `${period}年`
  const m = /^(\d{4})-(\d{2})$/.exec(period)
  if (m) {
    const [, year = '', month = ''] = m
    return `${year}年${Number(month)}月`
  }
  return period
}

/** チャート軸用の短縮ラベル。"2025-01"→"25/1" / 年次はそのまま。 */
export function formatPeriodAxisTick(period: string, frequency: DataFrequency): string {
  if (frequency === 'annual') return period
  const m = /^(\d{4})-(\d{2})$/.exec(period)
  if (m) {
    const [, year = '', month = ''] = m
    return `${year.slice(2)}/${Number(month)}`
  }
  return period
}

/** ISO 日付（YYYY-MM-DD）を "2026年6月27日" に。解析できなければそのまま返す。 */
export function formatIsoDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  if (!m) return iso
  const [, year = '', month = '', day = ''] = m
  return `${year}年${Number(month)}月${Number(day)}日`
}

/** 基準年比のラベル。"2020年平均比" など。 */
export function baseYearChangeLabel(indicator: OfficialCostIndicator): string {
  return indicator.baseYear ? `${indicator.baseYear}年平均比` : '基準年比'
}

/** 表示期間内変化率のラベル。先頭 period から "2025年1月比" のように生成。 */
export function displayPeriodChangeLabel(indicator: OfficialCostIndicator): string {
  const first = getFirstPoint(indicator.values)
  if (!first) return '表示期間内変化率'
  return `${formatPeriod(first.period, indicator.frequency)}比`
}

export const YOY_LABEL = '前年比'
