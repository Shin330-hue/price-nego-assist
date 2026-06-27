import { ArrowRight, FileText, LineChart, ListChecks, Sparkles } from 'lucide-react'
import { FieldSelector } from '../components/field/FieldSelector'
import { ExternalLink } from '../components/ui/ExternalLink'
import { OFFICIAL_SOURCE_LINKS } from '../data/source-links'
import {
  APP_TITLE_SHORT,
  CTA,
  HERO_HEADLINE,
  HERO_SUBCOPY,
  LEGAL_NOTICE_SHORT,
  TOOL_POSITIONING,
} from '../lib/copy'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const STEPS = [
  { icon: ListChecks, title: '分野をえらぶ', detail: '自社に近い加工分野を8つから選びます。' },
  {
    icon: LineChart,
    title: '上昇の根拠を見る',
    detail: '原材料費・エネルギー費・労務費の公的指標と取適法関連ポイントを確認します。',
  },
  {
    icon: FileText,
    title: '準備シートを作る',
    detail: '根拠を整理したA4資料を印刷・PDF保存できます。',
  },
]

export function HomePage() {
  useDocumentTitle(`${HERO_HEADLINE} | ${APP_TITLE_SHORT}`)

  return (
    <div className="mx-auto max-w-6xl space-y-14 px-4 py-8 sm:space-y-16 sm:py-10">
      {/* Hero */}
      <section className="relative isolate min-h-[440px] overflow-hidden rounded-lg border border-border bg-surface shadow-xl shadow-teal-900/10 sm:min-h-[480px]">
        <img
          src="/illustrations/hero-factory-comic.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-y-0 left-0 w-full bg-[rgba(255,247,236,0.9)] sm:w-[58%]" />
        <div className="relative flex min-h-[440px] max-w-xl flex-col justify-center px-5 py-8 sm:min-h-[480px] sm:px-10">
          <span className="pop-kicker mb-4 w-fit">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            町工場の価格協議を、根拠から準備
          </span>
          <h1 className="text-3xl font-black leading-tight tracking-normal text-foreground sm:text-5xl">
            {HERO_HEADLINE}
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
            {HERO_SUBCOPY}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#fields"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-teal-900/15 transition hover:-translate-y-0.5 hover:brightness-105"
            >
              {CTA.selectField}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <span className="text-sm font-semibold text-foreground">
              公的データ + 自社資料で、話し合いの材料を整理。
            </span>
          </div>
        </div>
      </section>

      {/* 3 ステップ */}
      <section aria-labelledby="steps-heading" className="space-y-6">
        <h2 id="steps-heading" className="text-xl font-black">
          3ステップで、気まずさを準備に変える
        </h2>
        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {STEPS.map((step, idx) => (
            <li key={step.title} className="industrial-card space-y-2 p-5">
              <div className="flex items-center gap-2 text-primary">
                <step.icon className="h-6 w-6" aria-hidden="true" />
                <span className="data-number text-sm font-bold">STEP {idx + 1}</span>
              </div>
              <h3 className="font-black">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{step.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 分野選択 */}
      <section id="fields" aria-labelledby="fields-heading" className="scroll-mt-20 space-y-6">
        <h2 id="fields-heading" className="text-xl font-black">
          まずは、近い加工分野をえらぶ
        </h2>
        <FieldSelector />
      </section>

      {/* 位置づけ・注意書き */}
      <section className="industrial-card space-y-3 border-l-4 border-l-primary p-5 text-sm leading-relaxed text-muted">
        <p>{TOOL_POSITIONING}</p>
        <p>{LEGAL_NOTICE_SHORT}</p>
      </section>

      {/* 参考リンク */}
      <section aria-labelledby="links-heading" className="space-y-4">
        <h2 id="links-heading" className="text-xl font-black">
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
