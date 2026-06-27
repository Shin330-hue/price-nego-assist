import { AlertTriangle } from 'lucide-react'
import type { OfficialCostIndicator } from '../../types/domain'
import { SAMPLE_DATA_WARNING } from '../../lib/copy'
import { cn } from '../../lib/cn'

interface DataQualityBannerProps {
  indicators: OfficialCostIndicator[]
  className?: string
}

// サンプル・未確認データの警告（仕様書 8.1 / 要件 F-012）。
// 色だけに依存せず、アイコン＋テキストで明示する（アクセシビリティ 8.3）。
export function DataQualityBanner({ indicators, className }: DataQualityBannerProps) {
  const hasSample = indicators.some((i) => i.quality === 'sample')
  const hasDeprecated = indicators.some((i) => i.quality === 'deprecated')

  if (!hasSample && !hasDeprecated) return null

  const isError = hasSample

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 rounded-xl border p-4 text-sm',
        isError
          ? 'border-danger/60 bg-danger/10 text-foreground'
          : 'border-warning/60 bg-warning/10 text-foreground',
        className,
      )}
    >
      <AlertTriangle
        className={cn('mt-0.5 h-5 w-5 shrink-0', isError ? 'text-danger' : 'text-warning')}
        aria-hidden="true"
      />
      <div className="space-y-1">
        <p className="font-semibold">
          {isError ? 'サンプルデータの警告' : 'データ品質に関する注意'}
        </p>
        <p className="leading-relaxed">
          {hasSample
            ? SAMPLE_DATA_WARNING
            : '更新が停止した古いデータ（deprecated）が含まれています。最新の公式データをご確認ください。'}
        </p>
      </div>
    </div>
  )
}
