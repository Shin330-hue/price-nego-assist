import { METAL_FIELDS } from '../../data/fields'
import { FieldCard } from './FieldCard'

// 8 分野カードのグリッド（仕様書 7.1: 375px=1列 / 768px=2列 / 1280px=4列）。
export function FieldSelector() {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {METAL_FIELDS.map((field) => (
        <li key={field.id} className="h-full">
          <FieldCard field={field} />
        </li>
      ))}
    </ul>
  )
}
