import type { CostCategory } from '../types/domain'

export const CATEGORY_LABEL: Record<CostCategory, string> = {
  material: '材料費',
  energy: 'エネルギー費',
  labor: '労務費',
  consumables: '消耗品',
  other: 'その他',
}
