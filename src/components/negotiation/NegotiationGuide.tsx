import { GUIDE_REFERENCE_NOTE, NEGOTIATION_GUIDE_STEPS } from '../../lib/copy'
import { CONSULTATION_LINKS } from '../../data/source-links'
import { ExternalLink } from '../ui/ExternalLink'
import { ReferenceNote } from '../ui/ReferenceNote'

// 価格協議の進め方ガイド（要件 F-006）。分野共通で表示。実績に基づかない「参考」。
export function NegotiationGuide() {
  return (
    <div className="space-y-4">
      <ReferenceNote>{GUIDE_REFERENCE_NOTE}</ReferenceNote>
      <ol className="space-y-3">
        {NEGOTIATION_GUIDE_STEPS.map((step, idx) => (
          <li key={step.title} className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {idx + 1}
            </span>
            <div>
              <p className="font-semibold">{step.title}</p>
              <p className="text-sm leading-relaxed text-muted">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="industrial-card space-y-2 p-4">
        <h3 className="text-sm font-bold">相談窓口</h3>
        <ul className="space-y-1 text-sm">
          {CONSULTATION_LINKS.map((link) => (
            <li key={link.id}>
              <ExternalLink href={link.url}>{link.label}</ExternalLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
