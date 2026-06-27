import { Check, X } from 'lucide-react'
import { APP_TITLE, APP_TITLE_SHORT, TOOL_POSITIONING } from '../lib/copy'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { LegalDisclaimer } from '../components/legal/LegalDisclaimer'

const CAN_DO = [
  '公的なコスト指標（原材料費・エネルギー費・労務費）の推移を確認する',
  '取適法に関係するポイントを平易な言葉で確認する',
  '価格協議の進め方を確認する',
  'コピーできる価格協議依頼文テンプレートを使う',
  '価格協議準備シートを印刷・PDF保存する',
]

const CANNOT_DO = [
  '個社の原価計算・採算計算を代行すること',
  '取適法の適用可否や違法性を確定的に判断すること',
  '価格改定が必ず認められると保証すること',
  '個人情報・取引先情報・金額を保存すること',
]

export function AboutPage() {
  useDocumentTitle(`このツールについて | ${APP_TITLE_SHORT}`)

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-10">
      <header className="industrial-card space-y-2 border-l-4 border-l-primary p-5">
        <span className="pop-kicker">話し合いの材料をそろえる道具です</span>
        <h1 className="text-2xl font-black sm:text-3xl">このツールについて</h1>
        <p className="text-sm text-muted">{APP_TITLE}</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-black">目的</h2>
        <p className="leading-relaxed text-muted">
          金属加工業の中小受託事業者が、取引先へ価格協議を申し入れる前に、公的なコスト上昇データ・取適法関連ポイント・協議の進め方・依頼文を整理し、価格協議準備シートを作成するための準備ツールです。価格を必ず上げるための交渉代行ツールではなく、法令の趣旨に沿った正当なルートで価格協議を始めるための準備を支援します。
        </p>
        <p className="leading-relaxed text-muted">{TOOL_POSITIONING}</p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="industrial-card space-y-2 p-5">
          <h2 className="text-lg font-black">できること</h2>
          <ul className="space-y-2 text-sm text-muted">
            {CAN_DO.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="industrial-card space-y-2 p-5">
          <h2 className="text-lg font-black">できないこと</h2>
          <ul className="space-y-2 text-sm text-muted">
            {CANNOT_DO.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-black">データ更新方針</h2>
        <p className="leading-relaxed text-muted">
          公的データは実行時に外部APIへアクセスせず、リポジトリ内のJSONとして保持します。各データには出典URL・公表日・取得日・系列名を付与し、サンプルデータが含まれる場合は警告を表示します。法令情報は公式ソースで確認のうえ、確認日を記録します。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-black">法的注意</h2>
        <LegalDisclaimer />
      </section>
    </div>
  )
}
