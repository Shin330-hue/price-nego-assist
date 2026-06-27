import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// v1.0: 静的SPA。Vercel デプロイ前提のため base は '/'。
// SPA のリロード404対策は vercel.json の rewrites で行う。
export default defineConfig({
  base: '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
})
