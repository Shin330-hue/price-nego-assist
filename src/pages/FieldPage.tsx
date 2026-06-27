import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react'
import { isValidFieldId, ROUTES } from '../lib/routes'
import {
  getFieldById,
  getLegalBases,
  getNegotiationPointsByFieldId,
  getRelatedIndicators,
  getSourceSummaries,
} from '../lib/data-loader'
import { CATEGORY_LABEL } from '../lib/labels'
import { STAT_SEARCH_URL, bojApiCsvUrl, bojDataCode } from '../lib/boj'
import { APP_TITLE_SHORT, CTA, DATA_TRUST_NOTE } from '../lib/copy'
import { FIELD_PRESENTATION } from '../data/ui-presentation'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { DataQualityBanner } from '../components/data/DataQualityBanner'
import { CostIndicatorCard } from '../components/data/CostIndicatorCard'
import { FieldCostProfile } from '../components/field/FieldCostProfile'
import { NegotiationPointCard } from '../components/negotiation/NegotiationPointCard'
import { NegotiationGuide } from '../components/negotiation/NegotiationGuide'
import { LetterTemplate } from '../components/negotiation/LetterTemplate'
import { LegalBasisCard } from '../components/legal/LegalBasisCard'
import { LegalDisclaimer } from '../components/legal/LegalDisclaimer'
import { ExternalLink } from '../components/ui/ExternalLink'
import { SourceBadge } from '../components/data/SourceBadge'
import { NotFoundPage } from './NotFoundPage'

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="space-y-4">
      <h2 id={id} className="text-xl font-black">
        {title}
      </h2>
      {children}
    </section>
  )
}

export function FieldPage() {
  const { fieldId } = useParams()

  if (!isValidFieldId(fieldId)) {
    return <NotFoundPage message="存在しない加工分野です" />
  }
  const field = getFieldById(fieldId)
  if (!field) {
    return <NotFoundPage message="存在しない加工分野です" />
  }

  const indicators = getRelatedIndicators(field)
  const negotiationPoints = getNegotiationPointsByFieldId(field.id)
  const legalBases = getLegalBases()
  const sourceSummaries = getSourceSummaries(indicators)
  const categories = Array.from(new Set(indicators.map((i) => i.category)))
  const presentation = FIELD_PRESENTATION[field.id]

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-8">
      <FieldPageTitle fieldName={field.name} />

      {/* 戻る + 分野ヘッダー */}
      <div className="space-y-4">
        <Link
          to={ROUTES.home}
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          分野選択へ戻る
        </Link>
        <header className="industrial-card overflow-hidden p-4 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="sticker-frame aspect-square w-32 shrink-0 overflow-hidden sm:w-40">
              <img
                src={presentation.imageSrc}
                alt={presentation.imageAlt}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-3">
              <span className="pop-kicker">{presentation.tagline}</span>
              <div>
                <h1 className="text-2xl font-black sm:text-4xl">{field.name}</h1>
                <p className="mt-2 max-w-3xl leading-relaxed text-muted">{field.description}</p>
              </div>
              <ul className="flex flex-wrap gap-1.5">
                {categories.map((c) => (
                  <li
                    key={c}
                    className="rounded-full border border-border bg-surface-2 px-2 py-0.5 text-xs font-semibold text-muted"
                  >
                    {CATEGORY_LABEL[c]}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </header>
      </div>

      <DataQualityBanner indicators={indicators} />

      <Section id="cost-profile" title="このコスト、上がってませんか？">
        <FieldCostProfile field={field} />
      </Section>

      <Section id="indicators" title="公的データで見てみる">
        <p className="flex items-center gap-1.5 text-xs text-muted">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
          {DATA_TRUST_NOTE}
        </p>
        {indicators.length === 0 ? (
          <p className="industrial-card p-4 text-sm text-muted">
            この分野の公的指標は準備中です。
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {indicators.map((indicator) => (
              <CostIndicatorCard key={indicator.id} indicator={indicator} />
            ))}
          </div>
        )}
      </Section>

      {negotiationPoints.length > 0 && (
        <Section id="points" title="交渉で使える説明ポイント">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {negotiationPoints.map((point) => (
              <NegotiationPointCard key={point.id} point={point} />
            ))}
          </div>
        </Section>
      )}

      <Section id="legal" title="取適法関連ポイント">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {legalBases.map((b) => (
            <LegalBasisCard key={b.id} legalBasis={b} />
          ))}
        </div>
        <LegalDisclaimer />
      </Section>

      <Section id="guide" title="価格協議の進め方（参考）">
        <NegotiationGuide />
      </Section>

      <Section id="letter" title="価格協議依頼文テンプレート（参考）">
        <LetterTemplate field={field} indicators={indicators} />
      </Section>

      {/* シートCTA */}
      <section className="industrial-card flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold">価格協議準備シートを作成</h2>
          <p className="text-sm text-muted">根拠を整理したA4資料を印刷・PDF保存できます。</p>
        </div>
        <Link
          to={ROUTES.sheet(field.id)}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:-translate-y-0.5 hover:brightness-105"
        >
          {CTA.createSheet}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>

      {sourceSummaries.length > 0 && (
        <Section id="sources" title="出典概要">
          <ul className="space-y-2">
            {sourceSummaries.map((s) => (
              <li key={s.id} className="industrial-card space-y-1 p-3">
                <p className="font-semibold">{s.label}</p>
                <ExternalLink href={s.sourceUrl}>
                  {s.publisher} / {s.sourceName}
                </ExternalLink>
                {s.seriesCode && (
                  <p className="text-xs text-muted">
                    データコード: {bojDataCode(s.seriesCode)}（
                    <ExternalLink href={STAT_SEARCH_URL}>日銀検索</ExternalLink>
                    {' / '}
                    <ExternalLink href={bojApiCsvUrl(s.seriesCode)}>原データCSV</ExternalLink>）
                  </p>
                )}
                <SourceBadge
                  publisher={s.publisher}
                  sourceName={s.sourceName}
                  retrievedAt={s.retrievedAt}
                  quality={s.quality}
                  className="mt-1"
                />
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  )
}

function FieldPageTitle({ fieldName }: { fieldName: string }) {
  useDocumentTitle(`${fieldName} | ${APP_TITLE_SHORT}`)
  return null
}
