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
import { APP_TITLE_SHORT, CTA, DATA_TRUST_NOTE } from '../lib/copy'
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
      <h2 id={id} className="text-xl font-bold">
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
        <header className="space-y-2">
          <h1 className="text-2xl font-bold sm:text-3xl">{field.name}</h1>
          <p className="max-w-3xl leading-relaxed text-muted">{field.description}</p>
          <ul className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <li
                key={c}
                className="rounded-full border border-border px-2 py-0.5 text-xs text-muted"
              >
                {CATEGORY_LABEL[c]}
              </li>
            ))}
          </ul>
        </header>
      </div>

      <DataQualityBanner indicators={indicators} />

      <Section id="cost-profile" title="この分野で影響しやすいコスト要因">
        <FieldCostProfile field={field} />
      </Section>

      <Section id="indicators" title="公的コスト指標">
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
        <Section id="points" title="価格協議での説明ポイント">
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
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110"
        >
          {CTA.createSheet}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>

      {sourceSummaries.length > 0 && (
        <Section id="sources" title="出典概要">
          <ul className="space-y-2">
            {sourceSummaries.map((s) => (
              <li key={s.id} className="industrial-card p-3">
                <ExternalLink href={s.sourceUrl}>
                  {s.publisher} / {s.sourceName}
                </ExternalLink>
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
