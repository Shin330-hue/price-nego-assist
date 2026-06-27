import '@testing-library/jest-dom/vitest'

// jsdom は window.scrollTo を実装しないため no-op に差し替える（App の自動スクロール用）。
Object.defineProperty(window, 'scrollTo', {
  value: () => {},
  writable: true,
  configurable: true,
})
