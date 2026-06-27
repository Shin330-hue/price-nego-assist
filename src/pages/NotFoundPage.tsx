import { Link } from 'react-router-dom'
import { ROUTES } from '../lib/routes'
import { APP_TITLE_SHORT } from '../lib/copy'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export function NotFoundPage({ message }: { message?: string }) {
  useDocumentTitle(`ページが見つかりません | ${APP_TITLE_SHORT}`)
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-24 text-center">
      <p className="data-number text-5xl font-bold text-primary">404</p>
      <h1 className="text-xl font-bold">{message ?? 'ページが見つかりませんでした'}</h1>
      <p className="text-sm text-muted">
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <Link
        to={ROUTES.home}
        className="inline-flex items-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110"
      >
        トップへ戻る
      </Link>
    </div>
  )
}
