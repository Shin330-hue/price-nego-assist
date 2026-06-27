import type { ReactNode } from 'react'
import { Lightbulb } from 'lucide-react'
import { cn } from '../../lib/cn'

// 「参考」バッジ＋注記。進め方ガイド・依頼文など、実績に基づかない参考情報に付ける。
// データ（公的統計）とは視覚的に区別する（要件 13.2）。
export function ReferenceNote({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'flex items-start gap-2 rounded-lg border border-border bg-surface-2 p-3 text-xs leading-relaxed text-muted',
        className,
      )}
    >
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-surface px-2 py-0.5 font-semibold text-foreground">
        <Lightbulb className="h-3 w-3" aria-hidden="true" />
        参考
      </span>
      <span>{children}</span>
    </div>
  )
}
