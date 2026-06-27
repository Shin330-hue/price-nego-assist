import type {
  EvidenceSheetModel,
  FieldId,
  LegalBasis,
  MetalField,
  NegotiationPoint,
  OfficialCostIndicator,
  SourceSummary,
} from '../types/domain'
import { METAL_FIELDS } from '../data/fields'
import { NEGOTIATION_POINTS } from '../data/negotiation-points'
import { LEGAL_BASES } from '../data/legal-bases'
import { EVIDENCE_CHECKLIST } from './copy'
import { hasSampleData } from './calculations'
import { extractSeriesCode } from './boj'

// JSON 指標の読み込み。strict 環境ではリテラル型に合致しないため unknown 経由でキャストする。
// 値の妥当性は data-validation / validate-data スクリプトで担保する。
import cgpiSteel from '../data/official-indices/cgpi-steel.json'
import cgpiNonferrous from '../data/official-indices/cgpi-nonferrous.json'
import cgpiElectricity from '../data/official-indices/cgpi-electricity.json'
import cgpiGas from '../data/official-indices/cgpi-gas.json'
import minimumWage from '../data/official-indices/minimum-wage-national-average.json'
import toolSteel from '../data/official-indices/cgpi-tool-steel.json'
import cuttingTool from '../data/official-indices/cgpi-cutting-tool.json'
import weldingRod from '../data/official-indices/cgpi-welding-rod.json'
import abrasive from '../data/official-indices/cgpi-abrasive.json'
import lubricant from '../data/official-indices/cgpi-lubricant.json'
import dieMold from '../data/official-indices/cgpi-die-mold.json'
import industrialGas from '../data/official-indices/cgpi-industrial-gas.json'
import paint from '../data/official-indices/cgpi-paint.json'
import pigIronCastings from '../data/official-indices/cgpi-pig-iron-castings.json'
import aluminumIngot from '../data/official-indices/cgpi-aluminum-ingot.json'
import refractory from '../data/official-indices/cgpi-refractory.json'
import stainlessSheet from '../data/official-indices/cgpi-stainless-sheet.json'
import coatedSteelSheet from '../data/official-indices/cgpi-coated-steel-sheet.json'
import cementedCarbideTools from '../data/official-indices/cgpi-cemented-carbide-tools.json'
import lpg from '../data/official-indices/cgpi-lpg.json'
import water from '../data/official-indices/cgpi-water.json'
import wasteDisposal from '../data/official-indices/sppi-industrial-waste-disposal.json'
import heavyOilA from '../data/official-indices/cgpi-heavy-oil-a.json'
import heavyOilBc from '../data/official-indices/cgpi-heavy-oil-bc.json'
import coalCoke from '../data/official-indices/cgpi-coal-coke.json'
import copper from '../data/official-indices/cgpi-copper.json'
import brass from '../data/official-indices/cgpi-brass.json'
import boltsNuts from '../data/official-indices/cgpi-bolts-nuts.json'

function toIndicator(raw: unknown): OfficialCostIndicator {
  const indicator = raw as OfficialCostIndicator
  // 系列コードを calculationNote から補完（出典特定・原データリンク用）。
  return { ...indicator, seriesCode: indicator.seriesCode ?? extractSeriesCode(indicator.calculationNote) }
}

// 指標を追加したら import と本配列の両方に追記する（tsx の validate:data も静的importで動くため）。
export const OFFICIAL_INDICATORS: OfficialCostIndicator[] = [
  toIndicator(cgpiSteel),
  toIndicator(cgpiNonferrous),
  toIndicator(cgpiElectricity),
  toIndicator(cgpiGas),
  toIndicator(minimumWage),
  toIndicator(toolSteel),
  toIndicator(cuttingTool),
  toIndicator(weldingRod),
  toIndicator(abrasive),
  toIndicator(lubricant),
  toIndicator(dieMold),
  toIndicator(industrialGas),
  toIndicator(paint),
  toIndicator(pigIronCastings),
  toIndicator(aluminumIngot),
  toIndicator(refractory),
  toIndicator(stainlessSheet),
  toIndicator(coatedSteelSheet),
  toIndicator(cementedCarbideTools),
  toIndicator(lpg),
  toIndicator(water),
  toIndicator(wasteDisposal),
  toIndicator(heavyOilA),
  toIndicator(heavyOilBc),
  toIndicator(coalCoke),
  toIndicator(copper),
  toIndicator(brass),
  toIndicator(boltsNuts),
]

const INDICATOR_BY_ID = new Map(OFFICIAL_INDICATORS.map((i) => [i.id, i]))

export function getIndicatorById(id: string): OfficialCostIndicator | undefined {
  return INDICATOR_BY_ID.get(id)
}

/** 指定 ID の指標を、存在するものだけ順序を保って返す。 */
export function getIndicatorsByIds(ids: string[]): OfficialCostIndicator[] {
  return ids.map((id) => INDICATOR_BY_ID.get(id)).filter((i): i is OfficialCostIndicator => !!i)
}

export function getFieldById(id: FieldId): MetalField | undefined {
  return METAL_FIELDS.find((f) => f.id === id)
}

export function getRelatedIndicators(field: MetalField): OfficialCostIndicator[] {
  return getIndicatorsByIds(field.relatedIndicatorIds)
}

export function getNegotiationPointsByFieldId(fieldId: FieldId): NegotiationPoint[] {
  return NEGOTIATION_POINTS.filter((p) => p.fieldId === fieldId)
}

export function getLegalBases(): LegalBasis[] {
  return LEGAL_BASES
}

/** 指標から出典サマリ（重複除去）を作る。出典一覧・印刷シート用。 */
export function getSourceSummaries(indicators: OfficialCostIndicator[]): SourceSummary[] {
  const seen = new Set<string>()
  const summaries: SourceSummary[] = []
  for (const i of indicators) {
    if (seen.has(i.id)) continue
    seen.add(i.id)
    summaries.push({
      id: i.id,
      label: i.name,
      publisher: i.publisher,
      sourceName: i.sourceName,
      sourceUrl: i.sourceUrl,
      retrievedAt: i.retrievedAt,
      quality: i.quality,
      seriesCode: i.seriesCode,
    })
  }
  return summaries
}

/** 価格協議準備シートの派生モデルを生成する（DB保存はしない）。 */
export function buildEvidenceSheetModel(
  field: MetalField,
  createdAt: string,
): EvidenceSheetModel {
  const indicators = getRelatedIndicators(field)
  return {
    createdAt,
    field,
    indicators,
    negotiationPoints: getNegotiationPointsByFieldId(field.id),
    legalBases: LEGAL_BASES,
    checklist: EVIDENCE_CHECKLIST,
    sourceSummaries: getSourceSummaries(indicators),
    hasSampleData: hasSampleData(indicators),
  }
}
