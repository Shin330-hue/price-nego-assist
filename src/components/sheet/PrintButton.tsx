import { Printer } from 'lucide-react'
import { CTA } from '../../lib/copy'
import { Button } from '../ui/Button'

interface PrintButtonProps {
  label?: string
}

// window.print() を呼ぶ（要件 F-009）。
export function PrintButton({ label = CTA.printPdf }: PrintButtonProps) {
  return (
    <Button onClick={() => window.print()}>
      <Printer className="h-4 w-4" aria-hidden="true" />
      {label}
    </Button>
  )
}
