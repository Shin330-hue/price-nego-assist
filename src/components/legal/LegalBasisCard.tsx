import { Scale } from 'lucide-react'
import type { LegalBasis } from '../../types/domain'
import { formatIsoDate } from '../../lib/formatters'
import { ExternalLink } from '../ui/ExternalLink'
import { cn } from '../../lib/cn'

interface LegalBasisCardProps {
  legalBasis: LegalBasis
  /** 印刷シート向けの白背景・簡素表示 */
  compact?: boolean
}

// 取適法関連ポイント（設計書 8.3 / 仕様書 F-005）。
// 断定を避け、平易な言葉で「協議に応じること」等を中心に説明する。
export function LegalBasisCard({ legalBasis, compact = false }: LegalBasisCardProps) {
  const b = legalBasis
  return (
    <article
      className={cn(
        'avoid-break space-y-3 rounded-xl border p-4',
        compact ? 'border-gray-300 bg-white text-gray-800' : 'industrial-card',
      )}
    >
      <header className="flex items-start gap-2">
        {!compact && <Scale className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />}
        <div>
          <h3 className="font-bold">{b.title}</h3>
          {b.articleLabel && (
            <p className={cn('text-xs', compact ? 'text-gray-500' : 'text-muted')}>
              {b.lawName.includes('取適法') ? '取適法 ' : ''}
              {b.articleLabel}
            </p>
          )}
        </div>
      </header>

      <p className="text-sm leading-relaxed">{b.plainSummary}</p>

      <div className={cn('rounded-lg p-3 text-sm', compact ? 'bg-gray-50' : 'bg-surface-2')}>
        <p className={cn('mb-1 text-xs font-semibold', compact ? 'text-gray-600' : 'text-primary')}>
          価格協議での意味
        </p>
        <p className="leading-relaxed">{b.negotiationMeaning}</p>
      </div>

      <p className={cn('text-sm leading-relaxed', compact ? 'text-gray-700' : 'text-muted')}>
        <span className="font-semibold">できる行動: </span>
        {b.relatedUserAction}
      </p>

      <p className={cn('text-xs leading-relaxed', compact ? 'text-gray-500' : 'text-muted')}>
        ⚠ {b.caution}
      </p>

      <p className={cn('text-xs', compact ? 'text-gray-500' : 'text-muted')}>
        出典:{' '}
        {compact ? (
          <span>{b.sourceName}</span>
        ) : (
          <ExternalLink href={b.sourceUrl}>{b.sourceName}</ExternalLink>
        )}
        <span aria-hidden="true"> / </span>
        確認日: {formatIsoDate(b.checkedAt)}
      </p>
    </article>
  )
}
