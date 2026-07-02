// sitemap.xml と robots.txt を生成する（SEO）。
// 公開URLは .env の VITE_SITE_URL を単一情報源とする（Vite の loadEnv で読む）。
// 実行:
//   pnpm gen:sitemap        … 単体生成
//   pnpm build              … ビルド前に自動実行（public/ を vite が dist/ へコピー）
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { loadEnv } from 'vite'
import { METAL_FIELDS } from '../src/data/fields'
import { ROUTES } from '../src/lib/routes'

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const env = loadEnv('production', projectRoot, 'VITE_')
const SITE_URL = (env.VITE_SITE_URL ?? 'https://price-nego-assist.vercel.app').replace(/\/$/, '')

// 収録パス: 静的ページ＋分野ページ（印刷用シートは派生物のため除外）。
const paths: string[] = [ROUTES.home, ROUTES.about, ROUTES.sources]
for (const field of METAL_FIELDS) paths.push(ROUTES.field(field.id))

const urls = paths
  .map((path) => {
    const loc = `${SITE_URL}${path === '/' ? '/' : path}`
    const priority = path === '/' ? '1.0' : '0.7'
    return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>`
  })
  .join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`

const publicDir = join(projectRoot, 'public')
fs.writeFileSync(join(publicDir, 'sitemap.xml'), sitemap)
fs.writeFileSync(join(publicDir, 'robots.txt'), robots)

console.log(`[sitemap] ${paths.length} URL を ${SITE_URL} で生成（sitemap.xml / robots.txt）`)
