import type { EvidenceSheetModel } from '../../types/domain'
import { formatIsoDate } from '../../lib/formatters'
import { bojDataCode } from '../../lib/boj'

// 印刷シート用の出典一覧。URL は印刷されるよう文字列で表示する。
export function EvidenceSheetSources({ model }: { model: EvidenceSheetModel }) {
  return (
    <div className="space-y-3 text-sm text-gray-800">
      <div>
        <h3 className="font-semibold text-gray-900">公的統計データ</h3>
        <ul className="mt-1 space-y-1">
          {model.sourceSummaries.map((s) => (
            <li key={s.id}>
              <span className="font-medium text-gray-900">{s.label}</span> — {s.publisher} /{' '}
              {s.sourceName}
              {s.seriesCode ? ` / データコード ${bojDataCode(s.seriesCode)}` : ''}（取得日:{' '}
              {formatIsoDate(s.retrievedAt)}）
              <br />
              <span className="break-all text-xs text-gray-600">{s.sourceUrl}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">法令・指針</h3>
        <ul className="mt-1 space-y-1">
          {model.legalBases.map((b) => (
            <li key={b.id}>
              {b.title}
              {b.articleLabel ? `（${b.articleLabel}）` : ''} — {b.sourceName}（確認日:{' '}
              {formatIsoDate(b.checkedAt)}）
              <br />
              <span className="break-all text-xs text-gray-600">{b.sourceUrl}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
