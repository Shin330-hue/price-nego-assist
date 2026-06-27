import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { CostDataPoint, OfficialCostIndicator } from '../../types/domain'
import { formatPeriod, formatPeriodAxisTick } from '../../lib/formatters'
import { formatValue } from '../../lib/calculations'

// 月次データを年平均へ間引く（印刷で点が多すぎる場合の可読性確保用）。
function toAnnualAverages(values: CostDataPoint[]): CostDataPoint[] {
  const byYear = new Map<string, { sum: number; n: number }>()
  for (const v of values) {
    const year = v.period.slice(0, 4)
    const cur = byYear.get(year) ?? { sum: 0, n: 0 }
    cur.sum += v.value
    cur.n += 1
    byYear.set(year, cur)
  }
  return [...byYear.entries()].map(([year, { sum, n }]) => ({
    period: year,
    value: Math.round((sum / n) * 10) / 10,
  }))
}

interface CostTrendChartProps {
  indicator: OfficialCostIndicator
  /** 印刷用。ResponsiveContainer を使わず固定サイズ・濃色で描画する。 */
  compact?: boolean
  height?: number
}

// 折れ線グラフ（設計書 8.1 / 仕様書 8.3）。
// 画面: ResponsiveContainer + 軸ラベル間引きでスマホ横スクロールを避ける。
// 印刷(compact): 固定 px・濃色 stroke で window.print() 時に確実に描画。
export function CostTrendChart({ indicator, compact = false, height }: CostTrendChartProps) {
  const rawData = indicator.values
  if (rawData.length === 0) {
    return <p className="text-sm text-muted">表示できるデータがありません。</p>
  }
  // 印刷(compact)で月次の点が多い場合は年平均へ間引く（画面はそのまま全点表示）。
  const data =
    compact && indicator.frequency === 'monthly' && rawData.length > 36
      ? toAnnualAverages(rawData)
      : rawData

  const stroke = compact ? '#b45309' : '#128f8b'
  const axisColor = compact ? '#444' : '#65757a'
  const gridColor = compact ? '#ddd' : 'rgba(22,49,58,0.12)'
  const chartHeight = height ?? (compact ? 180 : 240)

  const chart = (
    <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: -12 }}>
      <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
      <XAxis
        dataKey="period"
        tickFormatter={(p: string) => formatPeriodAxisTick(p, indicator.frequency)}
        interval="preserveStartEnd"
        minTickGap={24}
        tick={{ fontSize: 11, fill: axisColor }}
        stroke={axisColor}
      />
      <YAxis
        tick={{ fontSize: 11, fill: axisColor }}
        stroke={axisColor}
        width={44}
        domain={['auto', 'auto']}
      />
      {indicator.baseYear && (
        <ReferenceLine
          y={100}
          stroke={axisColor}
          strokeDasharray="4 4"
          label={{ value: '基準=100', position: 'insideTopLeft', fontSize: 10, fill: axisColor }}
        />
      )}
      {!compact && (
        <Tooltip
          formatter={(value: number | string) => [
            formatValue(Number(value), indicator.unit),
            indicator.seriesName,
          ]}
          labelFormatter={(label: string) => formatPeriod(String(label), indicator.frequency)}
          contentStyle={{
            background: '#fffaf1',
            border: '1px solid rgba(22,49,58,0.16)',
            borderRadius: 8,
            color: '#16313a',
            fontSize: 12,
          }}
        />
      )}
      <Line
        type="monotone"
        dataKey="value"
        stroke={stroke}
        strokeWidth={2}
        dot={false}
        isAnimationActive={!compact}
      />
    </LineChart>
  )

  // 印刷(compact)も親幅に追従させ、A4の余白・カード余白内に確実に収める
  // （固定幅だと右端が見切れるため width="100%"）。点数が多い場合は年平均へ間引き済み。
  if (compact) {
    return (
      <div className="w-full" style={{ maxWidth: 560 }}>
        <ResponsiveContainer width="100%" height={chartHeight}>
          {chart}
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden">
      <ResponsiveContainer width="100%" height={chartHeight}>
        {chart}
      </ResponsiveContainer>
    </div>
  )
}
