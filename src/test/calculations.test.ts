import { describe, expect, it } from 'vitest'
import type { CostDataPoint, OfficialCostIndicator } from '../types/domain'
import {
  calculateBaseYearChange,
  calculateDisplayPeriodChange,
  calculateYoYChange,
  formatRate,
  formatValue,
  getFirstPoint,
  getLatestPoint,
  hasNonOfficialData,
} from '../lib/calculations'

function makeIndicator(overrides: Partial<OfficialCostIndicator>): OfficialCostIndicator {
  return {
    id: 'test',
    category: 'material',
    name: 'テスト指標',
    description: '',
    publisher: 'test',
    sourceName: 'test',
    sourceUrl: 'https://example.com',
    seriesName: 'test',
    unit: '指数（2020年平均=100）',
    frequency: 'monthly',
    publishedAt: '2026-01-01',
    retrievedAt: '2026-01-01',
    quality: 'sample',
    calculationNote: '',
    negotiationUse: '',
    values: [],
    ...overrides,
  }
}

const monthly = (entries: [string, number][]): CostDataPoint[] =>
  entries.map(([period, value]) => ({ period, value }))

describe('getLatestPoint / getFirstPoint', () => {
  it('空配列なら null を返す', () => {
    expect(getLatestPoint([])).toBeNull()
    expect(getFirstPoint([])).toBeNull()
  })

  it('最後・最初の要素を返す', () => {
    const values = monthly([
      ['2025-01', 100],
      ['2025-02', 110],
    ])
    expect(getLatestPoint(values)?.value).toBe(110)
    expect(getFirstPoint(values)?.value).toBe(100)
  })
})

describe('calculateBaseYearChange', () => {
  it('baseYear ありで基準年比が正しい（(125-100)/100*100=25）', () => {
    const indicator = makeIndicator({
      baseYear: '2020',
      values: monthly([
        ['2025-01', 120],
        ['2026-01', 125],
      ]),
    })
    expect(calculateBaseYearChange(indicator)).toBeCloseTo(25)
  })

  it('baseYear なしで null', () => {
    const indicator = makeIndicator({
      values: monthly([['2026-01', 125]]),
    })
    expect(calculateBaseYearChange(indicator)).toBeNull()
  })
})

describe('calculateDisplayPeriodChange', () => {
  it('先頭→最新の変化率が正しい（(110-100)/100*100=10）', () => {
    const indicator = makeIndicator({
      values: monthly([
        ['2025-01', 100],
        ['2026-01', 110],
      ]),
    })
    expect(calculateDisplayPeriodChange(indicator)).toBeCloseTo(10)
  })

  it('先頭値が 0 なら null', () => {
    const indicator = makeIndicator({
      values: monthly([
        ['2025-01', 0],
        ['2026-01', 110],
      ]),
    })
    expect(calculateDisplayPeriodChange(indicator)).toBeNull()
  })
})

describe('calculateYoYChange', () => {
  it('月次: 前年同月と比較する（12件前ではなく period 一致）', () => {
    // 12件前ではなく「同月の前年」を探すことを確認するため、件数を不規則にする。
    const indicator = makeIndicator({
      frequency: 'monthly',
      values: monthly([
        ['2025-05', 100],
        ['2025-08', 102],
        ['2025-11', 104],
        ['2026-02', 106],
        ['2026-05', 120],
      ]),
    })
    // 2026-05 vs 2025-05 = (120-100)/100*100 = 20
    expect(calculateYoYChange(indicator)).toBeCloseTo(20)
  })

  it('年次: 前年と比較する', () => {
    const indicator = makeIndicator({
      frequency: 'annual',
      unit: '円',
      values: [
        { period: '2024', value: 1000 },
        { period: '2025', value: 1100 },
      ],
    })
    expect(calculateYoYChange(indicator)).toBeCloseTo(10)
  })

  it('比較先がない場合は null', () => {
    const indicator = makeIndicator({
      frequency: 'monthly',
      values: monthly([['2026-05', 120]]),
    })
    expect(calculateYoYChange(indicator)).toBeNull()
  })

  it('比較先の値が 0 の場合は null', () => {
    const indicator = makeIndicator({
      frequency: 'annual',
      values: [
        { period: '2024', value: 0 },
        { period: '2025', value: 1100 },
      ],
    })
    expect(calculateYoYChange(indicator)).toBeNull()
  })
})

describe('formatRate / formatValue', () => {
  it('null は "—"', () => {
    expect(formatRate(null)).toBe('—')
  })

  it('小数1桁・signed で正値に + を付ける', () => {
    expect(formatRate(12.34)).toBe('12.3%')
    expect(formatRate(12.34, { signed: true })).toBe('+12.3%')
    expect(formatRate(-5, { signed: true })).toBe('-5.0%')
  })

  it('formatValue は円を整数・指数を1桁で整形', () => {
    expect(formatValue(1055, '円（時間額）')).toBe('1,055')
    expect(formatValue(128, '指数（2020年平均=100）')).toBe('128')
    expect(formatValue(128.4, '指数（2020年平均=100）')).toBe('128.4')
  })
})

describe('hasNonOfficialData', () => {
  it('sample を含むと true', () => {
    expect(hasNonOfficialData([makeIndicator({ quality: 'sample' })])).toBe(true)
  })

  it('official のみなら false', () => {
    expect(hasNonOfficialData([makeIndicator({ quality: 'official_verified' })])).toBe(false)
  })
})
