import { ArrowRight, FileText, LineChart, ListChecks } from 'lucide-react'
import { FieldSelector } from '../components/field/FieldSelector'
import { ExternalLink } from '../components/ui/ExternalLink'
import { OFFICIAL_SOURCE_LINKS } from '../data/source-links'
import {
  APP_TITLE,
  CTA,
  HERO_HEADLINE,
  HERO_SUBCOPY,
  LEGAL_NOTICE_SHORT,
  TOOL_POSITIONING,
} from '../lib/copy'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const STEPS = [
  { icon: ListChecks, title: '分野を選ぶ', detail: '自社に近い加工分野を8つから選びます。' },
  {
    icon: LineChart,
    title: '公的データと法令ポイントを見る',
    detail: '原材料費・エネルギー費・労務費の公的指標と取適法関連ポイントを確認します。',
  },
  {
    icon: FileText,
    title: '価格協議準備シートを作る',
    detail: '根拠を整理したA4資料を印刷・PDF保存できます。',
  },
]

export function HomePage() {
  useDocumentTitle(APP_TITLE)

  return (
    <div className="mx-auto max-w-6xl space-y-16 px-4 py-10">
      {/* Hero */}
      <section className="space-y-5">
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{HERO_HEADLINE}</h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted">{HERO_SUBCOPY}</p>
        <a
          href="#fields"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110"
        >
          {CTA.selectField}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </section>

      {/* 3 ステップ */}
      <section aria-labelledby="steps-heading" className="space-y-6">
        <h2 id="steps-heading" className="text-xl font-bold">
          3ステップで価格協議の準備
        </h2>
        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {STEPS.map((step, idx) => (
            <li key={step.title} className="industrial-card space-y-2 p-5">
              <div className="flex items-center gap-2 text-primary">
                <step.icon className="h-6 w-6" aria-hidden="true" />
                <span className="data-number text-sm font-bold">STEP {idx + 1}</span>
              </div>
              <h3 className="font-bold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{step.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 分野選択 */}
      <section id="fields" aria-labelledby="fields-heading" className="scroll-mt-20 space-y-6">
        <h2 id="fields-heading" className="text-xl font-bold">
          加工分野を選ぶ
        </h2>
        <FieldSelector />
      </section>

      {/* 位置づけ・注意書き */}
      <section className="industrial-card space-y-3 p-5 text-sm leading-relaxed text-muted">
        <p>{TOOL_POSITIONING}</p>
        <p>{LEGAL_NOTICE_SHORT}</p>
      </section>

      {/* 参考リンク */}
      <section aria-labelledby="links-heading" className="space-y-4">
        <h2 id="links-heading" className="text-xl font-bold">
          参考リンク・公式情報
        </h2>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {OFFICIAL_SOURCE_LINKS.map((link) => (
            <li key={link.id}>
              <ExternalLink href={link.url}>{link.label}</ExternalLink>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
