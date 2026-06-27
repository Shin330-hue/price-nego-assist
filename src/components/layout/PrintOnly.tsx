import type { ReactNode } from 'react'

// 画面では非表示、印刷時のみ表示する領域（index.css の .print-only / @media print）。
export function PrintOnly({ children }: { children: ReactNode }) {
  return <div className="print-only">{children}</div>
}
