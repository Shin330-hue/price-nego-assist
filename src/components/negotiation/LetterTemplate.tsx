import { useEffect, useRef, useState } from 'react'
import { Check, ClipboardCopy } from 'lucide-react'
import type { MetalField, OfficialCostIndicator } from '../../types/domain'
import {
  CTA,
  LETTER_PLACEHOLDER_NOTE,
  LETTER_REFERENCE_NOTE,
  LETTER_TEMPLATE_STANDARD,
  LETTER_TEMPLATE_WITH_LAW,
} from '../../lib/copy'
import { copyToClipboard } from '../../lib/clipboard'
import { cn } from '../../lib/cn'
import { Button } from '../ui/Button'
import { ReferenceNote } from '../ui/ReferenceNote'

interface LetterTemplateProps {
  field: MetalField
  indicators: OfficialCostIndicator[]
}

type Version = 'standard' | 'withLaw'
type CopyState = 'idle' | 'copied' | 'error'

export function LetterTemplate({ field, indicators }: LetterTemplateProps) {
  const [version, setVersion] = useState<Version>('standard')
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  const text = version === 'standard' ? LETTER_TEMPLATE_STANDARD : LETTER_TEMPLATE_WITH_LAW

  async function handleCopy() {
    const ok = await copyToClipboard(text)
    setCopyState(ok ? 'copied' : 'error')
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopyState('idle'), 2500)
  }

  return (
    <div className="space-y-3">
      <ReferenceNote>{LETTER_REFERENCE_NOTE}</ReferenceNote>
      <div className="flex flex-wrap items-center gap-2">
        <div
          role="tablist"
          aria-label="依頼文のバージョン"
          className="inline-flex rounded-lg border border-border p-1"
        >
          <button
            role="tab"
            aria-selected={version === 'standard'}
            onClick={() => setVersion('standard')}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm',
              version === 'standard' ? 'bg-primary text-primary-foreground' : 'text-muted',
            )}
          >
            標準版
          </button>
          <button
            role="tab"
            aria-selected={version === 'withLaw'}
            onClick={() => setVersion('withLaw')}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm',
              version === 'withLaw' ? 'bg-primary text-primary-foreground' : 'text-muted',
            )}
          >
            取適法に軽く触れる版
          </button>
        </div>

        <Button onClick={handleCopy} className="ml-auto">
          {copyState === 'copied' ? (
            <Check className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ClipboardCopy className="h-4 w-4" aria-hidden="true" />
          )}
          {CTA.copyLetter}
        </Button>
      </div>

      <p aria-live="polite" className="min-h-[1.25rem] text-sm">
        {copyState === 'copied' && <span className="text-success">コピーしました。</span>}
        {copyState === 'error' && (
          <span className="text-danger">
            コピーできませんでした。本文を選択して手動でコピーしてください。
          </span>
        )}
      </p>

      <pre className="industrial-card max-h-96 overflow-auto whitespace-pre-wrap p-4 text-sm leading-relaxed">
        {text}
      </pre>

      <p className="text-xs leading-relaxed text-muted">{LETTER_PLACEHOLDER_NOTE}</p>
      <p className="text-xs leading-relaxed text-muted">
        ※ この依頼文は固定テンプレートです（AIによる自動生成は行いません）。
        {field.name}で参照できる公的指標（
        {indicators.map((i) => i.name).join('、') || '準備中'}
        ）を整理した資料を添えると、協議がスムーズになります。
      </p>
    </div>
  )
}
