import { AlertTriangle } from 'lucide-react'
import type { OfficialCostIndicator } from '../../types/domain'
import {
  calculateBaseYearChange,
  calculateDisplayPeriodChange,
  calculateYoYChange,
  formatRate,
  formatValue,
  getLatestPoint,
} from '../../lib/calculations'
import {
  baseYearChangeLabel,
  displayPeriodChangeLabel,
  formatPeriod,
  YOY_LABEL,
} from '../../lib/formatters'
import { CATEGORY_LABEL } from '../../lib/labels'
import { STAT_SEARCH_URL, bojApiCsvUrl, bojDataCode } from '../../lib/boj'
import { CostTrendChart } from './CostTrendChart'
import { SourceBadge } from './SourceBadge'
import { ExternalLink } from '../ui/ExternalLink'

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface-2 px-3 py-2">
      <div className="text-xs text-muted">{label}</div>
      <div className="data-number text-lg font-semibold">{value}</div>
    </div>
  )
}

export function CostIndicatorCard({ indicator }: { indicator: OfficialCostIndicator }) {
  const latest = getLatestPoint(indicator.values)
  const baseYearChange = calculateBaseYearChange(indicator)
  const displayChange = calculateDisplayPeriodChange(indicator)
  const yoy = calculateYoYChange(indicator)
  const isSample = indicator.quality === 'sample'

  // 基準年がある指標は基準年比、ない指標は表示期間内変化率を主指標にする。
  const primaryLabel = indicator.baseYear
    ? baseYearChangeLabel(indicator)
    : displayPeriodChangeLabel(indicator)
  const primaryValue = indicator.baseYear ? baseYearChange : displayChange

  return (
    <article className="industrial-card avoid-break space-y-3 p-4">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-bold">{indicator.name}</h3>
          <p className="mt-0.5 text-xs text-muted">{CATEGORY_LABEL[indicator.category]}</p>
        </div>
        {isSample && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#fff0ec] px-2 py-1 text-xs font-semibold text-danger">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
            サンプル
          </span>
        )}
      </header>

      <div className="grid grid-cols-3 gap-2">
        <Stat
          label={latest ? `最新値（${formatPeriod(latest.period, indicator.frequency)}）` : '最新値'}
          value={latest ? formatValue(latest.value, indicator.unit) : '—'}
        />
        <Stat label={primaryLabel} value={formatRate(primaryValue, { signed: true })} />
        <Stat label={YOY_LABEL} value={formatRate(yoy, { signed: true })} />
      </div>

      <CostTrendChart indicator={indicator} />

      <div className="rounded-lg border border-border bg-surface-2 p-3 text-sm">
        <p className="mb-1 text-xs font-semibold text-primary">交渉での使い方</p>
        <p className="leading-relaxed text-muted">{indicator.negotiationUse}</p>
      </div>

      <details className="text-xs text-muted">
        <summary className="cursor-pointer select-none hover:text-foreground">
          出典・計算メモを表示
        </summary>
        <dl className="mt-2 space-y-1">
          <div>
            <dt className="inline font-semibold">系列名: </dt>
            <dd className="inline">{indicator.seriesName}</dd>
          </div>
          <div>
            <dt className="inline font-semibold">単位: </dt>
            <dd className="inline">{indicator.unit}</dd>
          </div>
          {indicator.baseYear && (
            <div>
              <dt className="inline font-semibold">基準年: </dt>
              <dd className="inline">{indicator.baseYear}年</dd>
            </div>
          )}
          <div>
            <dt className="inline font-semibold">公表日: </dt>
            <dd className="inline">{indicator.publishedAt}</dd>
          </div>
          <div>
            <dt className="inline font-semibold">計算メモ: </dt>
            <dd className="inline">{indicator.calculationNote}</dd>
          </div>
          <div>
            <dt className="inline font-semibold">出典: </dt>
            <dd className="inline">
              <ExternalLink href={indicator.sourceUrl}>{indicator.sourceName}</ExternalLink>
            </dd>
          </div>
          {indicator.seriesCode && (
            <div>
              <dt className="inline font-semibold">データコード: </dt>
              <dd className="inline">
                {bojDataCode(indicator.seriesCode)}（先頭の接頭辞ごと
                <ExternalLink href={STAT_SEARCH_URL}>日銀検索サイト</ExternalLink>
                に貼付、または
                <ExternalLink href={bojApiCsvUrl(indicator.seriesCode)}>原データCSV</ExternalLink>
                ）
              </dd>
            </div>
          )}
        </dl>
      </details>

      <SourceBadge
        publisher={indicator.publisher}
        sourceName={indicator.sourceName}
        retrievedAt={indicator.retrievedAt}
        quality={indicator.quality}
        sourceUrl={indicator.sourceUrl}
      />
    </article>
  )
}
