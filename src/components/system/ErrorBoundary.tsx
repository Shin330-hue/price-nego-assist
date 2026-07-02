import { Component, type ErrorInfo, type ReactNode } from 'react'
import {
  ERROR_BOUNDARY_BODY,
  ERROR_BOUNDARY_HOME,
  ERROR_BOUNDARY_RELOAD,
  ERROR_BOUNDARY_TITLE,
} from '../../lib/copy'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

// アプリ全体のエラー境界（設計書）。
// lazy チャンクの読み込み失敗や予期しないレンダー例外で白画面になるのを防ぎ、
// ポップUIのトーンを保ったフォールバック（再読み込み／トップへ戻る）を表示する。
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // 原因追跡のためコンソールに記録する（外部送信はしない）。
    console.error('[ErrorBoundary]', error, info)
  }

  private handleReload = (): void => {
    window.location.reload()
  }

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <div className="industrial-card space-y-4 p-6 text-center">
          <h1 className="text-xl font-black">{ERROR_BOUNDARY_TITLE}</h1>
          <p className="text-sm leading-relaxed text-muted">{ERROR_BOUNDARY_BODY}</p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-teal-900/15 transition hover:-translate-y-0.5 hover:brightness-105"
            >
              {ERROR_BOUNDARY_RELOAD}
            </button>
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-bold text-foreground transition hover:border-primary"
            >
              {ERROR_BOUNDARY_HOME}
            </a>
          </div>
        </div>
      </div>
    )
  }
}
