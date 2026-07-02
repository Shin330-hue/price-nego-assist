// =============================================================================
// ドメイン型（仕様書 4.2 / 設計書 4 章）
// アプリ全体で使う型をここに一元管理する。
// =============================================================================

export type FieldId =
  | 'cutting'
  | 'welding'
  | 'grinding'
  | 'pressing'
  | 'sheet-metal'
  | 'plating'
  | 'casting'
  | 'heat-treatment'

export type CostCategory = 'material' | 'energy' | 'labor' | 'consumables' | 'other'

export type DataQuality = 'official_verified' | 'official_manual' | 'sample' | 'deprecated'

export type DataFrequency = 'monthly' | 'quarterly' | 'annual'

/** 加工分野（src/data/fields.ts） */
export interface MetalField {
  id: FieldId
  name: string
  shortName: string
  description: string
  icon: string
  primaryMaterials: string[]
  energyProfile: string
  laborProfile: string
  consumables: string[]
  relatedIndicatorIds: string[]
  /**
   * 主な影響コストのカテゴリ（relatedIndicatorIds のカテゴリ集合＝初出順・重複除去）。
   * 分野カードのタグ表示に使う。指標データ本体を初期バンドルへ引き込まないよう静的に保持し、
   * relatedIndicatorIds との整合は validate:data が検証する。
   */
  categories: CostCategory[]
  suggestedOwnDocuments: string[]
}

/** 時系列データ点。period は monthly=YYYY-MM / quarterly=YYYY-MM / annual=YYYY。 */
export interface CostDataPoint {
  period: string
  value: number
  label?: string
}

/** 公的コスト指標（src/data/official-indices/*.json） */
export interface OfficialCostIndicator {
  id: string
  category: CostCategory
  name: string
  description: string
  publisher: string
  sourceName: string
  sourceUrl: string
  sourceDocumentUrl?: string
  seriesName: string
  unit: string
  baseYear?: string
  frequency: DataFrequency
  publishedAt: string // 出典の公表日（ISO）
  retrievedAt: string // 取得・確認日（ISO）
  quality: DataQuality
  calculationNote: string
  negotiationUse: string
  values: CostDataPoint[]
  /** 出典の系列コード（日銀: PRCG20_/PRCS20_）。data-loader が calculationNote から補完する。 */
  seriesCode?: string
}

/** 取適法・指針などの法令ポイント（src/data/legal-bases.ts） */
export interface LegalBasis {
  id: string
  lawName: string
  articleLabel?: string
  title: string
  plainSummary: string
  negotiationMeaning: string
  relatedUserAction: string
  sourceType: 'jftc' | 'egov' | 'gov-online' | 'sme-agency' | 'other-public'
  sourceName: string
  sourceUrl: string
  checkedAt: string // 確認日（ISO）
  caution: string
}

/** 分野別の価格協議ポイント（src/data/negotiation-points.ts） */
export interface NegotiationPoint {
  id: string
  fieldId: FieldId
  category: CostCategory
  title: string
  description: string
  indicatorIds: string[]
  suggestedOwnDocuments: string[]
  howToExplain: string
}

/** 出典サマリ（出典一覧・印刷シート用） */
export interface SourceSummary {
  id: string
  label: string
  publisher: string
  sourceName: string
  sourceUrl: string
  retrievedAt: string
  quality: DataQuality
  seriesCode?: string
}

/**
 * 価格協議準備シートの派生モデル。
 * 表示時に data-loader で生成する。DB保存はしない（設計書 4.6）。
 */
export interface EvidenceSheetModel {
  createdAt: string
  field: MetalField
  indicators: OfficialCostIndicator[]
  negotiationPoints: NegotiationPoint[]
  legalBases: LegalBasis[]
  checklist: string[]
  sourceSummaries: SourceSummary[]
  hasSampleData: boolean
}

/** 外部公式リンク（src/data/source-links.ts） */
export interface OfficialSourceLink {
  id: string
  label: string
  url: string
}
