import type { EvidenceSheetModel, OfficialCostIndicator } from '../../types/domain'
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
import { DATA_NOTICE, LEGAL_DISCLAIMER_FULL } from '../../lib/copy'
import { OFFICIAL_SOURCE_LINKS } from '../../data/source-links'
import { CostTrendChart } from '../data/CostTrendChart'
import { LegalBasisCard } from '../legal/LegalBasisCard'
import { Checklist } from '../negotiation/Checklist'
import { EvidenceSheetHeader } from './EvidenceSheetHeader'
import { EvidenceSheetSources } from './EvidenceSheetSources'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="avoid-break space-y-2">
      <h2 className="border-b border-gray-300 pb-1 text-base font-bold text-gray-900">{title}</h2>
      {children}
    </section>
  )
}

function IndicatorSummary({ indicator }: { indicator: OfficialCostIndicator }) {
  const latest = getLatestPoint(indicator.values)
  const primaryLabel = indicator.baseYear
    ? baseYearChangeLabel(indicator)
    : displayPeriodChangeLabel(indicator)
  const primaryValue = indicator.baseYear
    ? calculateBaseYearChange(indicator)
    : calculateDisplayPeriodChange(indicator)
  const yoy = calculateYoYChange(indicator)

  return (
    <div className="avoid-break rounded border border-gray-300 p-3">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-semibold text-gray-900">{indicator.name}</h3>
        {indicator.quality === 'sample' && (
          <span className="text-xs font-semibold text-red-600">サンプル</span>
        )}
      </div>
      <p className="data-number text-sm text-gray-700">
        <span>
          最新値（{latest ? formatPeriod(latest.period, indicator.frequency) : '—'}）:{' '}
          {latest ? formatValue(latest.value, indicator.unit) : '—'} {indicator.unit}
        </span>
        <span className="ml-3">
          {primaryLabel}: {formatRate(primaryValue, { signed: true })}
        </span>
        <span className="ml-3">
          {YOY_LABEL}: {formatRate(yoy, { signed: true })}
        </span>
      </p>
      <div className="mt-2">
        <CostTrendChart indicator={indicator} compact />
      </div>
      <p className="mt-1 text-xs text-gray-600">{indicator.negotiationUse}</p>
    </div>
  )
}

// 価格協議準備シート（設計書 7.3 / 要件 F-007）。
// 画面ではプレビュー（白背景）、印刷時は .print-sheet が中心になる。
export function EvidenceSheet({ model }: { model: EvidenceSheetModel }) {
  const { field } = model
  return (
    <article className="print-sheet mx-auto max-w-3xl space-y-6 rounded-xl bg-white p-6 text-gray-900 shadow-lg sm:p-8">
      {model.hasSampleData && (
        <div className="rounded border-2 border-red-500 bg-red-50 p-3 text-sm font-semibold text-red-700">
          ⚠
          本資料には開発用サンプルデータが含まれています。実際の価格協議に使用する前に、公式データへ差し替えてください。
        </div>
      )}

      <EvidenceSheetHeader model={model} />

      <Section title="1. 対象分野とコスト構造">
        <p className="text-sm text-gray-700">{field.description}</p>
        <dl className="mt-2 space-y-1 text-sm text-gray-800">
          <div>
            <dt className="inline font-semibold">主要原材料: </dt>
            <dd className="inline">{field.primaryMaterials.join('、')}</dd>
          </div>
          <div>
            <dt className="inline font-semibold">エネルギー: </dt>
            <dd className="inline">{field.energyProfile}</dd>
          </div>
          <div>
            <dt className="inline font-semibold">労務費・技能: </dt>
            <dd className="inline">{field.laborProfile}</dd>
          </div>
          <div>
            <dt className="inline font-semibold">消耗品・副資材: </dt>
            <dd className="inline">{field.consumables.join('、')}</dd>
          </div>
        </dl>
      </Section>

      <Section title="2. 参照した公的データの要約">
        {model.indicators.length === 0 ? (
          <p className="text-sm text-gray-600">関連する公的指標は準備中です。</p>
        ) : (
          <div className="space-y-3">
            {model.indicators.map((i) => (
              <IndicatorSummary key={i.id} indicator={i} />
            ))}
          </div>
        )}
        <p className="text-xs text-gray-600">{DATA_NOTICE}</p>
      </Section>

      {model.negotiationPoints.length > 0 && (
        <Section title="3. 価格協議で伝えるポイント">
          <ul className="space-y-2 text-sm text-gray-800">
            {model.negotiationPoints.map((p) => (
              <li key={p.id} className="avoid-break">
                <span className="font-semibold">{p.title}</span>
                <br />
                {p.howToExplain}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="4. 取適法関連ポイント">
        <div className="space-y-3">
          {model.legalBases.map((b) => (
            <LegalBasisCard key={b.id} legalBasis={b} compact />
          ))}
        </div>
      </Section>

      <Section title="5. 自社で追記・準備する資料チェックリスト">
        <Checklist items={model.checklist} compact />
      </Section>

      <Section title="6. 参考リンク・相談窓口">
        <ul className="space-y-1 text-sm text-gray-800">
          {OFFICIAL_SOURCE_LINKS.map((link) => (
            <li key={link.id}>
              {link.label}
              <br />
              <span className="break-all text-xs text-gray-600">{link.url}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="7. 出典一覧">
        <EvidenceSheetSources model={model} />
      </Section>

      <Section title="8. 注意書き">
        <p className="text-xs leading-relaxed text-gray-600">{LEGAL_DISCLAIMER_FULL}</p>
        <p className="text-xs leading-relaxed text-gray-600">
          ※
          本シートの公的データは出典記載の実データですが、価格協議の進め方・依頼文は一般的な参考であり、特定の成果を保証するものではありません。
        </p>
      </Section>
    </article>
  )
}
