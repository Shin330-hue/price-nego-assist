// データ検証スクリプト（仕様書 10 章）。
// 使い方:
//   pnpm validate:data                       … 開発時。sample データは許容。
//   VALIDATE_PRODUCTION=true pnpm validate:data … 本番ゲート。sample があれば失敗。
import { getQualityCounts, validateAllData } from '../src/lib/data-validation'

const production =
  process.env.NODE_ENV === 'production' || process.env.VALIDATE_PRODUCTION === 'true'

const issues = validateAllData({ production })
const counts = getQualityCounts()

console.log(
  `[data-validation] mode=${production ? 'production' : 'development'} ` +
    `quality: official_verified=${counts.official_verified} official_manual=${counts.official_manual} ` +
    `sample=${counts.sample} deprecated=${counts.deprecated}`,
)

if (issues.length > 0) {
  for (const issue of issues) {
    console.error(`[data-validation] ${issue.source}: ${issue.message}`)
  }
  console.error(`\n[data-validation] FAILED: ${issues.length} 件の問題が見つかりました。`)
  process.exit(1)
}

if (!production && counts.sample > 0) {
  console.warn(
    `[data-validation] 注意: sample データが ${counts.sample} 件あります。` +
      ' 本番公開前に公式データへ差し替えてください（VALIDATE_PRODUCTION=true で検出されます）。',
  )
}

console.log('[data-validation] OK')
