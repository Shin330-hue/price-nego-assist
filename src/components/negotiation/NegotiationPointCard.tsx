import type { NegotiationPoint } from '../../types/domain'
import { getIndicatorsByIds } from '../../lib/data-loader'
import { CATEGORY_LABEL } from '../../lib/labels'

export function NegotiationPointCard({ point }: { point: NegotiationPoint }) {
  const indicators = getIndicatorsByIds(point.indicatorIds)

  return (
    <article className="industrial-card avoid-break space-y-3 p-4">
      <header className="flex items-start justify-between gap-2">
        <h3 className="font-bold">{point.title}</h3>
        <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-xs text-muted">
          {CATEGORY_LABEL[point.category]}
        </span>
      </header>

      <p className="text-sm leading-relaxed text-muted">{point.description}</p>

      <div className="rounded-lg bg-surface-2 p-3 text-sm">
        <p className="mb-1 text-xs font-semibold text-primary">説明のしかた</p>
        <p className="leading-relaxed">{point.howToExplain}</p>
      </div>

      {indicators.length > 0 && (
        <div className="text-xs text-muted">
          <span className="font-semibold">関連する公的指標: </span>
          {indicators.map((i) => i.name).join('、')}
        </div>
      )}

      <div className="text-xs text-muted">
        <span className="font-semibold">補足するとよい自社資料: </span>
        {point.suggestedOwnDocuments.join('、')}
      </div>
    </article>
  )
}
