// 日銀 時系列統計データの出典特定ヘルパー。
// 系列コード（CGPI=PRCG20_… / SPPI=PRCS20_…）で原系列を一意に特定できる。

export const STAT_SEARCH_URL = 'https://www.stat-search.boj.or.jp/'

/** calculationNote 等のテキストから系列コードを取り出す。 */
export function extractSeriesCode(text: string | undefined): string | undefined {
  if (!text) return undefined
  const m = /(PRC[GS]20_\d+)/.exec(text)
  return m?.[1]
}

/** 日銀の系列コードから DB 名（CGPI=PR01 / SPPI=PR02）を判定する。 */
function dbOf(seriesCode: string): 'PR01' | 'PR02' {
  return seriesCode.startsWith('PRCS') ? 'PR02' : 'PR01'
}

/**
 * 日銀「時系列データ検索」サイトの「データコード直接入力」に貼り付ける形式。
 * フォームは統計コード接頭辞付き（例 `PR01'PRCG20_2200950007`）でないと検索できない。
 * API の code パラメータ（裸コード）とは別物。
 */
export function bojDataCode(seriesCode: string): string {
  return `${dbOf(seriesCode)}'${seriesCode}`
}

/** 当該系列だけを返す日銀 REST API（CSV）URL。クリックで原データを確認できる。 */
export function bojApiCsvUrl(seriesCode: string): string {
  return `https://www.stat-search.boj.or.jp/api/v1/getDataCode?format=csv&lang=jp&db=${dbOf(seriesCode)}&code=${seriesCode}`
}
