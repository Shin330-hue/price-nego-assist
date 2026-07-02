// =============================================================================
// 公的データ更新スクリプト（決定論的・捏造なし）。設計書 15.1 / docs/DATA_UPDATE.md。
//
// 各指標JSONの calculationNote から日銀の系列コード（PRCG20_/PRCS20_）を取り出し、
// 日銀 時系列 REST API（getDataCode, CSV）から最新値を取得して values / publishedAt /
// retrievedAt を更新する。API が返した実数のみを書き込み、値の推測・生成は一切しない。
//
// 使い方:
//   pnpm update:data              … 取得して JSON を更新（変更があった指標のみ書き込み）
//   pnpm update:data --dry-run    … 取得のみ。差分を表示し、ファイルは書き換えない
//
// 更新後は必ず `git diff` を人がレビュー → `pnpm validate:data` → コミットする。
// 系列コードを持たない指標（例: 最低賃金 = 厚労省・API 無）は skip し、手動更新を促す。
// =============================================================================
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import type { CostDataPoint, OfficialCostIndicator } from '../src/types/domain'
import { bojApiCsvUrl, extractSeriesCode } from '../src/lib/boj'

const dryRun = process.argv.includes('--dry-run')
const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const dataDir = join(projectRoot, 'src', 'data', 'official-indices')

function today(): string {
  // 実行日（ISO）。決定論的な CI 実行で retrievedAt に用いる。
  return new Date().toISOString().slice(0, 10)
}

/** YYYYMM(6桁) → YYYY-MM。 */
function toPeriod(yyyymm: string): string {
  return `${yyyymm.slice(0, 4)}-${yyyymm.slice(4, 6)}`
}

/** YYYYMMDD(8桁) → YYYY-MM-DD。 */
function toIsoDate(yyyymmdd: string): string {
  return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`
}

interface ParsedSeries {
  values: CostDataPoint[]
  lastUpdate: string | undefined // YYYYMMDD
}

/**
 * 日銀 getDataCode の long 形式 CSV を解析する。
 * データ行は末尾3フィールドが常に `…,LAST_UPDATE(8桁),SURVEY_DATE(6桁),VALUE` の順で ASCII。
 * 系列名に読点が含まれても壊れないよう右側から取り出す。
 */
function parseBojCsv(text: string, seriesCode: string): ParsedSeries {
  const values: CostDataPoint[] = []
  let lastUpdate: string | undefined
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line.startsWith(`${seriesCode},`)) continue
    const cols = line.split(',')
    if (cols.length < 3) continue
    const value = Number.parseFloat(cols[cols.length - 1] ?? '')
    const surveyDate = (cols[cols.length - 2] ?? '').trim()
    const luRaw = (cols[cols.length - 3] ?? '').trim()
    if (!/^\d{6}$/.test(surveyDate) || Number.isNaN(value)) continue
    if (/^\d{8}$/.test(luRaw)) lastUpdate = luRaw
    values.push({ period: toPeriod(surveyDate), value })
  }
  return { values, lastUpdate }
}

async function fetchCsv(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  // 値・日付・期間は ASCII。系列名の日本語は使わないため latin1 で安全に取り出す。
  return Buffer.from(await res.arrayBuffer()).toString('latin1')
}

interface Outcome {
  id: string
  status: 'updated' | 'unchanged' | 'skipped'
  detail: string
}

async function processFile(file: string): Promise<Outcome> {
  const path = join(dataDir, file)
  const indicator = JSON.parse(fs.readFileSync(path, 'utf8')) as OfficialCostIndicator
  const id = indicator.id

  const seriesCode = extractSeriesCode(indicator.calculationNote)
  if (!seriesCode) {
    return { id, status: 'skipped', detail: '系列コードなし（手動更新: 例 最低賃金＝厚労省）' }
  }
  const existing = indicator.values
  if (!Array.isArray(existing) || existing.length === 0) {
    return { id, status: 'skipped', detail: '既存 values が空（要手動確認）' }
  }

  // 取得窓は既存の開始月に固定（キュレーターが選んだ期間を尊重）。
  const startYyyymm = (existing[0]?.period ?? '').replace('-', '')
  const url = `${bojApiCsvUrl(seriesCode)}&startDate=${startYyyymm}`

  let parsed: ParsedSeries
  try {
    parsed = parseBojCsv(await fetchCsv(url), seriesCode)
  } catch (err) {
    return { id, status: 'skipped', detail: `取得失敗（${(err as Error).message}）` }
  }

  const next = parsed.values.filter((p) => p.period >= (existing[0]?.period ?? ''))

  // 健全性ガード: 非空・昇順・既存件数以上（部分取得を弾く）。
  if (next.length === 0) return { id, status: 'skipped', detail: 'API 応答が空（要確認）' }
  for (let i = 1; i < next.length; i += 1) {
    if ((next[i]?.period ?? '') <= (next[i - 1]?.period ?? '')) {
      return { id, status: 'skipped', detail: 'period が昇順でない（要確認）' }
    }
  }
  if (next.length < existing.length) {
    return {
      id,
      status: 'skipped',
      detail: `取得件数 ${next.length} < 既存 ${existing.length}（部分取得の疑い・要確認）`,
    }
  }

  const nextPublishedAt = parsed.lastUpdate ? toIsoDate(parsed.lastUpdate) : indicator.publishedAt
  const valuesChanged = JSON.stringify(existing) !== JSON.stringify(next)
  const publishedChanged = indicator.publishedAt !== nextPublishedAt
  if (!valuesChanged && !publishedChanged) {
    return { id, status: 'unchanged', detail: `${next.length} 点・最新 ${next[next.length - 1]?.period}` }
  }

  const addedMonths = next.length - existing.length
  const detail =
    `${existing.length}→${next.length} 点` +
    (addedMonths > 0 ? `（+${addedMonths}ヶ月）` : '（改定あり）') +
    ` publishedAt ${indicator.publishedAt}→${nextPublishedAt}`

  if (!dryRun) {
    indicator.values = next
    indicator.publishedAt = nextPublishedAt
    indicator.retrievedAt = today()
    fs.writeFileSync(path, `${JSON.stringify(indicator, null, 2)}\n`)
  }
  return { id, status: 'updated', detail }
}

async function main(): Promise<void> {
  const files = fs
    .readdirSync(dataDir)
    .filter((f) => f.endsWith('.json'))
    .sort()
  console.log(`[update:data] ${files.length} 指標を処理${dryRun ? '（--dry-run: 書き込みなし）' : ''}`)

  const outcomes: Outcome[] = []
  for (const file of files) {
    // 逐次実行（API への同時大量アクセスを避ける）。
    outcomes.push(await processFile(file))
  }

  for (const o of outcomes) {
    const mark = o.status === 'updated' ? '✎' : o.status === 'unchanged' ? '·' : '⚠'
    console.log(`  ${mark} ${o.status.padEnd(9)} ${o.id.padEnd(32)} ${o.detail}`)
  }

  const n = (s: Outcome['status']): number => outcomes.filter((o) => o.status === s).length
  console.log(
    `[update:data] 完了: updated=${n('updated')} unchanged=${n('unchanged')} skipped=${n('skipped')}`,
  )
  if (!dryRun && n('updated') > 0) {
    console.log('[update:data] 次の手順: `git diff` を確認 → `pnpm validate:data` → コミット')
  }
}

main().catch((err: unknown) => {
  console.error(err)
  process.exitCode = 1
})
