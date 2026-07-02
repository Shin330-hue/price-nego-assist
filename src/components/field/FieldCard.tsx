import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { MetalField } from '../../types/domain'
import { ROUTES } from '../../lib/routes'
import { CATEGORY_LABEL } from '../../lib/labels'
import { FIELD_PRESENTATION } from '../../data/ui-presentation'

export function FieldCard({ field }: { field: MetalField }) {
  const presentation = FIELD_PRESENTATION[field.id]
  // 主な影響コストのタグ＝関連指標のカテゴリ（fields.ts に事前計算・重複除去済み）。
  // 指標データ本体を初期バンドルへ引き込まないよう field.categories を参照する。
  const categories = field.categories

  return (
    <Link
      to={ROUTES.field(field.id)}
      className="industrial-card group flex h-full flex-col gap-4 overflow-hidden p-4 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-xl"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="sticker-frame aspect-square w-24 shrink-0 overflow-hidden sm:w-28 xl:w-32">
          <picture>
            <source srcSet={presentation.imageSrc.replace(/\.png$/, '.webp')} type="image/webp" />
            <img
              src={presentation.imageSrc}
              alt={presentation.imageAlt}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </picture>
        </div>
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-primary transition group-hover:translate-x-0.5">
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <div>
        <p className="mb-2 text-xs font-bold text-primary">{presentation.tagline}</p>
        <h3 className="text-lg font-black">{field.name}</h3>
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
