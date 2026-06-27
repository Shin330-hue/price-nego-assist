import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { AppHeader } from './components/layout/AppHeader'
import { AppFooter } from './components/layout/AppFooter'
import { AppRoutes } from './routes'

// ルート遷移時にトップへスクロール（アンカー指定がある場合は除く）。
function useScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])
}

export default function App() {
  useScrollToTop()
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1">
        <AppRoutes />
      </main>
      <AppFooter />
    </div>
  )
}
