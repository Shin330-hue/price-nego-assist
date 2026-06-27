import type { FieldId } from '../types/domain'
import { METAL_FIELDS } from '../data/fields'

// パス生成・fieldId バリデーション（純関数。routes.test.ts で検証）。
// React Router の <Routes> 定義は src/routes.tsx 側で行う。

const FIELD_ID_SET = new Set<string>(METAL_FIELDS.map((f) => f.id))

export const ROUTES = {
  home: '/',
  sources: '/sources',
  about: '/about',
  field: (id: string): string => `/fields/${id}`,
  sheet: (id: string): string => `/fields/${id}/sheet`,
} as const

/** fieldId が存在する分野かどうか。型ガードとして使う。 */
export function isValidFieldId(id: string | undefined | null): id is FieldId {
  return typeof id === 'string' && FIELD_ID_SET.has(id)
}
