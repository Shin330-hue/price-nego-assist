import { Link, NavLink } from 'react-router-dom'
import { Gauge } from 'lucide-react'
import { ROUTES } from '../../lib/routes'
import { APP_TITLE_SHORT } from '../../lib/copy'
import { cn } from '../../lib/cn'

const NAV = [
  { to: ROUTES.sources, label: '出典一覧' },
  { to: ROUTES.about, label: 'このツールについて' },
]

// グローバルヘッダー。印刷時は no-print で非表示。
export function AppHeader() {
  return (
    <header className="no-print sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to={ROUTES.home} className="flex items-center gap-2 font-bold">
          <Gauge className="h-6 w-6 text-primary" aria-hidden="true" />
          <span className="text-sm sm:text-base">{APP_TITLE_SHORT}</span>
        </Link>
        <nav aria-label="メインナビゲーション">
          <ul className="flex items-center gap-1 text-sm">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'rounded-lg px-3 py-2 hover:bg-surface-2',
                      isActive ? 'text-primary' : 'text-muted',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
