import { OFFICIAL_INDICATORS, getLegalBases } from '../lib/data-loader'
import { OFFICIAL_SOURCE_LINKS } from '../data/source-links'
import { APP_TITLE_SHORT } from '../lib/copy'
import { formatIsoDate } from '../lib/formatters'
import { STAT_SEARCH_URL, bojApiCsvUrl, bojDataCode } from '../lib/boj'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { ExternalLink } from '../components/ui/ExternalLink'
import { SourceBadge } from '../components/data/SourceBadge'

export function SourcesPage() {
  useDocumentTitle(`出典一覧 | ${APP_TITLE_SHORT}`)
  const legalBases = getLegalBases()

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold sm:text-3xl">出典一覧</h1>
        <p className="text-sm leading-relaxed text-muted">
          本ツールで参照している公的統計データ・法令情報の出典と取得日・確認日です。最新状態は各公式サイトでご確認ください。
        </p>
      </header>

      <section aria-labelledby="data-sources" className="space-y-4">
        <h2 id="data-sources" className="text-xl font-bold">
          公的統計データ
        </h2>
        <ul className="space-y-3">
          {OFFICIAL_INDICATORS.map((i) => (
            <li key={i.id} className="industrial-card space-y-1 p-4">
              <h3 className="font-bold">{i.name}</h3>
              <p className="text-sm text-muted">
                系列名: {i.seriesName} / 単位: {i.unit}
                {i.baseYear ? ` / 基準年: ${i.baseYear}年` : ''}
              </p>
              <p className="text-sm text-muted">公表日: {formatIsoDate(i.publishedAt)}</p>
              {i.seriesCode && (
                <p className="text-sm text-muted">
                  データコード: {bojDataCode(i.seriesCode)}（接頭辞ごと
                  <ExternalLink href={STAT_SEARCH_URL}>日銀検索サイト</ExternalLink>
                  に貼付 / <ExternalLink href={bojApiCsvUrl(i.seriesCode)}>原データCSV</ExternalLink>）
                </p>
              )}
              <ExternalLink href={i.sourceUrl}>
                {i.publisher} / {i.sourceName}
              </ExternalLink>
              <SourceBadge
                publisher={i.publisher}
                sourceName={i.sourceName}
                retrievedAt={i.retrievedAt}
                quality={i.quality}
              />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="legal-sources" className="space-y-4">
        <h2 id="legal-sources" className="text-xl font-bold">
          法令・指針
        </h2>
        <ul className="space-y-3">
          {legalBases.map((b) => (
            <li key={b.id} className="industrial-card space-y-1 p-4">
              <h3 className="font-bold">
                {b.title}
                {b.articleLabel ? `（${b.articleLabel}）` : ''}
              </h3>
              <p className="text-sm text-muted">確認日: {formatIsoDate(b.checkedAt)}</p>
              <ExternalLink href={b.sourceUrl}>{b.sourceName}</ExternalLink>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="ref-links" className="space-y-4">
        <h2 id="ref-links" className="text-xl font-bold">
          公式情報・支援窓口
        </h2>
        <ul className="space-y-2">
          {OFFICIAL_SOURCE_LINKS.map((link) => (
            <li key={link.id}>
              <ExternalLink href={link.url}>{link.label}</ExternalLink>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold">更新方針</h2>
        <p className="text-sm leading-relaxed text-muted">
          公的データはリポジトリ内のJSONとして管理し、手動または更新スクリプトで更新します。各データには出典URL・公表日・取得日・系列名を付与しています。サンプルデータが含まれる場合は警告を表示し、本番公開前に公式データへ差し替えます。
        </p>
      </section>
    </div>
  )
}
