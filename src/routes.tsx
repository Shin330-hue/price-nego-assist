import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'

// 重い依存（Recharts 等）を含むページは遅延読込し、初回ロードを軽くする（NFR 8.2）。
const FieldPage = lazy(() => import('./pages/FieldPage').then((m) => ({ default: m.FieldPage })))
const SheetPage = lazy(() => import('./pages/SheetPage').then((m) => ({ default: m.SheetPage })))
const SourcesPage = lazy(() =>
  import('./pages/SourcesPage').then((m) => ({ default: m.SourcesPage })),
)
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })))

function PageFallback() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 text-sm text-muted" role="status">
      読み込み中…
    </div>
  )
}

// React Router の <Routes> 定義（パス生成ヘルパは lib/routes.ts）。
export function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/fields/:fieldId" element={<FieldPage />} />
        <Route path="/fields/:fieldId/sheet" element={<SheetPage />} />
        <Route path="/sources" element={<SourcesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
