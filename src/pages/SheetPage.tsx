import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { isValidFieldId, ROUTES } from '../lib/routes'
import { buildEvidenceSheetModel, getFieldById } from '../lib/data-loader'
import { APP_TITLE_SHORT } from '../lib/copy'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { EvidenceSheet } from '../components/sheet/EvidenceSheet'
import { PrintButton } from '../components/sheet/PrintButton'
import { NotFoundPage } from './NotFoundPage'

export function SheetPage() {
  const { fieldId } = useParams()
  const field = isValidFieldId(fieldId) ? getFieldById(fieldId) : undefined

  useDocumentTitle(
    field
      ? `${field.name} 価格協議準備シート | ${APP_TITLE_SHORT}`
      : `価格協議準備シート | ${APP_TITLE_SHORT}`,
  )

  if (!field) {
    return <NotFoundPage message="存在しない加工分野です" />
  }

  const createdAt = new Date().toISOString().slice(0, 10)
  const model = buildEvidenceSheetModel(field, createdAt)

  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-6">
      {/* 操作バー。印刷時は非表示。 */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <Link
          to={ROUTES.field(field.id)}
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {field.name}のページへ戻る
        </Link>
        <PrintButton />
      </div>

      <EvidenceSheet model={model} />
    </div>
  )
}
