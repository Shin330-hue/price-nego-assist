import type { EvidenceSheetModel } from '../../types/domain'
import { formatIsoDate } from '../../lib/formatters'

export function EvidenceSheetHeader({ model }: { model: EvidenceSheetModel }) {
  return (
    <header className="border-b border-gray-300 pb-4">
      <p className="text-xs tracking-wide text-gray-500">価格協議準備シート</p>
      <h1 className="mt-1 text-xl font-bold text-gray-900">
        {model.field.name}の価格協議 準備資料
      </h1>
      <p className="mt-1 text-sm text-gray-600">作成日: {formatIsoDate(model.createdAt)}</p>
    </header>
  )
}
