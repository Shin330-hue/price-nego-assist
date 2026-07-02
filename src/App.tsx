import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
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
      {/* アクセス解析（Cookieレス・個人情報を集めない）。dev では no-op。
          データ収集には Vercel 側でプロジェクトの Analytics を有効化する必要がある。 */}
      <Analytics />
    </div>
  )
}
