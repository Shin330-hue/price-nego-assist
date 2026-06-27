interface ChecklistProps {
  items: string[]
  /** 印刷シート向け（白背景・チェックボックス枠のみ） */
  compact?: boolean
}

// 自社で追記・準備する資料チェックリスト（要件 F-007）。
export function Checklist({ items, compact = false }: ChecklistProps) {
  return (
    <ul className="space-y-2">
      {items.map((item, idx) => {
        const id = `checklist-${idx}`
        return (
          <li key={item} className="flex items-start gap-2">
            {compact ? (
              <span
                aria-hidden="true"
                className="mt-0.5 inline-block h-4 w-4 shrink-0 rounded border border-gray-500"
              />
            ) : (
              <input
                id={id}
                type="checkbox"
                className="mt-1 h-4 w-4 shrink-0 accent-[var(--primary)]"
              />
            )}
            <label htmlFor={compact ? undefined : id} className="text-sm leading-relaxed">
              {item}
            </label>
          </li>
        )
      })}
    </ul>
  )
}
