import { Boxes, FileText, Users, Zap } from 'lucide-react'
import type { MetalField } from '../../types/domain'
import { DATA_NOTICE } from '../../lib/copy'

function ProfileItem({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="industrial-card space-y-2 p-4">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
      </div>
      <div className="text-sm leading-relaxed text-muted">{children}</div>
    </div>
  )
}

// 分野別コスト構造（要件 F-002）。
export function FieldCostProfile({ field }: { field: MetalField }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ProfileItem icon={<Boxes className="h-5 w-5" aria-hidden="true" />} title="主要原材料">
          <ul className="list-inside list-disc">
            {field.primaryMaterials.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </ProfileItem>
        <ProfileItem icon={<Zap className="h-5 w-5" aria-hidden="true" />} title="エネルギー消費の特徴">
          {field.energyProfile}
        </ProfileItem>
        <ProfileItem icon={<Users className="h-5 w-5" aria-hidden="true" />} title="労務費・技能要件">
          {field.laborProfile}
        </ProfileItem>
        <ProfileItem
          icon={<FileText className="h-5 w-5" aria-hidden="true" />}
          title="主要消耗品・副資材"
        >
          <ul className="list-inside list-disc">
            {field.consumables.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </ProfileItem>
      </div>

      <div className="industrial-card space-y-2 p-4">
        <h3 className="text-sm font-bold">価格協議で補足するとよい自社資料（任意）</h3>
        <ul className="flex flex-wrap gap-2">
          {field.suggestedOwnDocuments.map((d) => (
            <li key={d} className="rounded-full bg-surface-2 px-3 py-1 text-xs text-muted">
              {d}
            </li>
          ))}
        </ul>
        <p className="text-xs leading-relaxed text-muted">
          ※ 自社資料の添付は任意です。本ツールはアップロードを求めません。{DATA_NOTICE}
        </p>
      </div>
    </div>
  )
}
