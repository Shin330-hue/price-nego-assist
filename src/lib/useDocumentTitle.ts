import { useEffect } from 'react'

// ページごとのタイトル切替（要件 F-011）。react-helmet を使わず軽量に実装。
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    const previous = document.title
    document.title = title
    return () => {
      document.title = previous
    }
  }, [title])
}
