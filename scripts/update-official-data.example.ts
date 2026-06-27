// =============================================================================
// 公的データ更新スクリプトの「雛形（例）」。設計書 15.1。
// v1.0 では使用しない。将来、公式ソースから JSON 草案を生成する際の出発点。
//
// 重要: スクレイピングや PDF/Excel 抽出の結果は、必ず人間がレビューしてから
//       コミットする（数値の捏造・誤転記を防ぐため）。
//
// 実行例（実装後）:
//   tsx scripts/update-official-data.example.ts
// =============================================================================
import type { OfficialCostIndicator } from '../src/types/domain'

interface FetchPlan {
  indicatorId: string
  sourceUrl: string
  /** 取得したレスポンスから values を抽出する関数（人手で実装） */
  parse: (raw: string) => OfficialCostIndicator['values']
}

// 取得計画。実際の抽出ロジックは公式フォーマット確認後に実装する。
const PLANS: FetchPlan[] = [
  // {
  //   indicatorId: 'minimum-wage-national-average',
  //   sourceUrl: 'https://www.mhlw.go.jp/.../minimumichiran/...',
  //   parse: (raw) => parseMinimumWage(raw),
  // },
]

async function fetchSource(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`fetch failed: ${res.status} ${url}`)
  return res.text()
}

async function main(): Promise<void> {
  if (PLANS.length === 0) {
    console.log('更新計画(PLANS)が未定義です。公式フォーマット確認後に実装してください。')
    return
  }
  for (const plan of PLANS) {
    const raw = await fetchSource(plan.sourceUrl)
    const values = plan.parse(raw)
    // 生成した values は JSON 草案として出力し、人間がレビュー→quality を
    // official_manual に更新→コミットする。
    console.log(`[draft] ${plan.indicatorId}: ${values.length} 件の値を抽出（要レビュー）`)
  }
}

main().catch((err: unknown) => {
  console.error(err)
  process.exitCode = 1
})
