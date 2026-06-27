import type { ReactNode } from 'react'
import { ExternalLink as ExternalLinkIcon } from 'lucide-react'
import { cn } from '../../lib/cn'

interface ExternalLinkProps {
  href: string
  children: ReactNode
  className?: string
  /** アイコンを表示するか（既定 true） */
  showIcon?: boolean
}

// 外部リンクは必ず別タブ + rel="noopener noreferrer"（要件 8.4 / F-010）。
export function ExternalLink({ href, children, className, showIcon = true }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-1 text-primary underline underline-offset-2 hover:brightness-110',
        className,
      )}
    >
      <span>{children}</span>
      {showIcon && <ExternalLinkIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
      <span className="sr-only">（外部サイト・新しいタブで開きます）</span>
    </a>
  )
}
