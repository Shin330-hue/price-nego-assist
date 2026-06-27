import { Link, NavLink } from 'react-router-dom'
import { Factory } from 'lucide-react'
import { ROUTES } from '../../lib/routes'
import { APP_TITLE_SHORT } from '../../lib/copy'
import { cn } from '../../lib/cn'

const NAV = [
  { to: ROUTES.sources, label: '出典一覧', mobileLabel: '出典' },
  { to: ROUTES.about, label: 'このツールについて', mobileLabel: '概要' },
]

// グローバルヘッダー。印刷時は no-print で非表示。
export function AppHeader() {
  return (
    <header className="no-print sticky top-0 z-20 border-b border-border bg-surface backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to={ROUTES.home} className="flex items-center gap-2 font-bold">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2 text-primary">
            <Factory className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="whitespace-nowrap text-sm font-black sm:text-base">
            {APP_TITLE_SHORT}
          </span>
        </Link>
        <nav aria-label="メインナビゲーション">
          <ul className="flex items-center gap-1 text-sm">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'rounded-lg px-3 py-2 font-semibold hover:bg-surface-2',
                      isActive ? 'bg-surface-2 text-primary' : 'text-muted',
                    )
                  }
                >
                  <span className="sm:hidden">{item.mobileLabel}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
