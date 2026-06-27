import { Link } from 'react-router-dom'
import { ROUTES } from '../../lib/routes'
import { LEGAL_NOTICE_SHORT } from '../../lib/copy'

// グローバルフッター。法的注意書き（短縮版）を全画面に表示。印刷時は no-print。
export function AppFooter() {
  return (
    <footer className="no-print mt-16 border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-8 text-sm text-muted">
        <p className="leading-relaxed">{LEGAL_NOTICE_SHORT}</p>
        <nav aria-label="フッターナビゲーション">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li>
              <Link to={ROUTES.home} className="hover:text-primary">
                トップ
              </Link>
            </li>
            <li>
              <Link to={ROUTES.sources} className="hover:text-primary">
                出典一覧
              </Link>
            </li>
            <li>
              <Link to={ROUTES.about} className="hover:text-primary">
                このツールについて
              </Link>
            </li>
          </ul>
        </nav>
        <p className="text-xs text-muted">
          公的データ・法令情報は出典・確認日を明示しています。最新状態は各公式サイトでご確認ください。
        </p>
      </div>
    </footer>
  )
}
