import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Droplets,
  Factory,
  Flame,
  Layers,
  Scissors,
  Sparkles,
  SquareStack,
  Thermometer,
  type LucideIcon,
} from 'lucide-react'
import type { MetalField } from '../../types/domain'
import { ROUTES } from '../../lib/routes'
import { getIndicatorsByIds } from '../../lib/data-loader'
import { CATEGORY_LABEL } from '../../lib/labels'

const ICONS: Record<string, LucideIcon> = {
  Scissors,
  Flame,
  Sparkles,
  Layers,
  SquareStack,
  Droplets,
  Factory,
  Thermometer,
}

export function FieldCard({ field }: { field: MetalField }) {
  const Icon = ICONS[field.icon] ?? Factory
  // 主な影響コストのタグ＝関連指標のカテゴリ（重複除去）。
  const categories = Array.from(
    new Set(getIndicatorsByIds(field.relatedIndicatorIds).map((i) => i.category)),
  )

  return (
    <Link
      to={ROUTES.field(field.id)}
      className="industrial-card group flex h-full flex-col gap-3 p-5 transition hover:border-primary/60 hover:bg-surface-2"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-2 text-primary">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <ArrowRight className="h-5 w-5 text-muted transition group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-lg font-bold">{field.name}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">{field.description}</p>
      </div>
      <ul className="mt-auto flex flex-wrap gap-1.5 pt-1">
        {categories.map((c) => (
          <li
            key={c}
            className="rounded-full border border-border px-2 py-0.5 text-xs text-muted"
          >
            {CATEGORY_LABEL[c]}
          </li>
        ))}
      </ul>
    </Link>
  )
}
