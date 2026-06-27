import { Info } from 'lucide-react'
import { LEGAL_DISCLAIMER_FULL } from '../../lib/copy'
import { cn } from '../../lib/cn'

interface LegalDisclaimerProps {
  /** 印刷シート向けに白背景・簡素表示にする */
  compact?: boolean
  className?: string
}

// 法的注意書き（全文）。FieldPage 法令付近 / SheetPage 末尾 / AboutPage に表示（仕様書 8.4）。
export function LegalDisclaimer({ compact = false, className }: LegalDisclaimerProps) {
  return (
    <aside
      role="note"
      aria-label="法的注意書き"
      className={cn(
        'flex gap-3 rounded-xl border p-4 text-sm leading-relaxed',
        compact
          ? 'border-gray-400 bg-white text-gray-800'
          : 'border-border bg-surface-2 text-muted',
        className,
      )}
    >
      <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
      <p>{LEGAL_DISCLAIMER_FULL}</p>
    </aside>
  )
}
