import type { DataQuality } from '../../types/domain'
import { formatIsoDate } from '../../lib/formatters'
import { cn } from '../../lib/cn'
import { ExternalLink } from '../ui/ExternalLink'

interface SourceBadgeProps {
  publisher: string
  sourceName: string
  retrievedAt: string
  quality: DataQuality
  /** 指定すると sourceName を控えめな外部リンクで表示する（出典リンク方針 要件 13.3） */
  sourceUrl?: string
  className?: string
}

const QUALITY_LABEL: Record<DataQuality, string> = {
  official_verified: '公式確認済み',
  official_manual: '公式（手動更新）',
  sample: 'サンプルデータ',
  deprecated: '更新停止データ',
}

const QUALITY_CLASS: Record<DataQuality, string> = {
  official_verified: 'text-success',
  official_manual: 'text-success',
  sample: 'text-danger font-semibold',
  deprecated: 'text-[#b45309] font-semibold',
}

// 出典・真正性の小バッジ（仕様書 8.2）。
export function SourceBadge({
  publisher,
  sourceName,
  retrievedAt,
  quality,
  sourceUrl,
  className,
}: SourceBadgeProps) {
  return (
    <p className={cn('text-xs text-muted', className)}>
      <span>{publisher}</span>
      <span aria-hidden="true"> / </span>
      {sourceUrl ? (
        <ExternalLink href={sourceUrl} className="text-muted hover:text-primary">
          {sourceName}
        </ExternalLink>
      ) : (
        <span>{sourceName}</span>
      )}
      <span aria-hidden="true"> / </span>
      <span>取得日: {formatIsoDate(retrievedAt)}</span>
      <span aria-hidden="true"> / </span>
      <span className={QUALITY_CLASS[quality]}>{QUALITY_LABEL[quality]}</span>
    </p>
  )
}
