import type { NegotiationPoint } from '../types/domain'

// 分野別の価格協議ポイント（仕様書 5.5）。
// indicatorIds は official-indices の id を参照し、かつ同じ分野(fields.ts)の
// relatedIndicatorIds に含まれるものだけを指す（画面表示と説明・根拠一覧を一致させる）。
// この整合は validate:data / data-integrity.test で検証する。
export const NEGOTIATION_POINTS: NegotiationPoint[] = [
  // --- 切削加工 ---
  {
    id: 'cutting-material',
    fieldId: 'cutting',
    category: 'material',
    title: '工具材（工具鋼・切削工具・超硬工具）の上昇を説明する',
    description:
      '切削では工具鋼・切削工具・超硬工具の価格上昇が工具費に直結します。市場全体の上昇傾向を公的指数で示します。',
    indicatorIds: ['cgpi-tool-steel', 'cgpi-cutting-tool', 'cgpi-cemented-carbide-tools'],
    suggestedOwnDocuments: ['工具・材料の価格改定通知', '直近の工具購入明細', '見積時点と現在の単価比較'],
    howToExplain: '工具鋼・切削工具・超硬工具の公的指数で市場全体の上昇傾向を示し、自社の工具購入資料で個別影響を補足します。',
  },
  {
    id: 'cutting-energy-labor',
    fieldId: 'cutting',
    category: 'energy',
    title: '電力・労務費の負担増を加工時間で補足する',
    description: '長時間運転する工作機械の電力負担と、熟練技能に対する労務費の上昇を説明します。',
    indicatorIds: ['cgpi-electricity', 'minimum-wage-national-average'],
    suggestedOwnDocuments: ['電力料金明細', '賃金改定資料', '主要品番の加工時間'],
    howToExplain: '加工時間あたりの電力・人件費を示し、公的データで上昇の客観性を補強します。',
  },
  {
    id: 'cutting-nonferrous',
    fieldId: 'cutting',
    category: 'material',
    title: '銅・黄銅など非鉄材料の上昇を示す',
    description: '銅・黄銅（真鍮）を扱う場合、非鉄材料の価格上昇が採算に直結します。',
    indicatorIds: ['cgpi-copper', 'cgpi-brass'],
    suggestedOwnDocuments: ['非鉄材料の改定通知', '直近の仕入明細'],
    howToExplain: '銅・黄銅の公的指数で市場傾向を示し、自社の仕入資料で個別影響を補足します。',
  },

  // --- 溶接・接合 ---
  {
    id: 'welding-material',
    fieldId: 'welding',
    category: 'material',
    title: '鋼材・溶接材料の上昇を示す',
    description: '母材の鋼材と溶接棒（溶接材料）の価格上昇を、公的指数と自社資料で説明します。',
    indicatorIds: ['cgpi-steel', 'cgpi-welding-rod'],
    suggestedOwnDocuments: ['鋼材・溶接材料の改定通知', '直近の仕入明細'],
    howToExplain: '鉄鋼・溶接棒の公的指数で市場傾向を示し、改定通知で個別影響を補足します。',
  },
  {
    id: 'welding-energy',
    fieldId: 'welding',
    category: 'energy',
    title: '電力・産業用ガス（熱源）コストの上昇を示す',
    description: '溶接機の電力とシールド・燃焼用の産業用ガスのコスト上昇を説明します。',
    indicatorIds: ['cgpi-electricity', 'cgpi-industrial-gas'],
    suggestedOwnDocuments: ['電力料金明細', 'ガス料金明細'],
    howToExplain: '電力・産業用ガスの公的指数で上昇傾向を示し、自社の料金明細で実負担を補足します。',
  },

  // --- 研磨・表面処理 ---
  {
    id: 'grinding-energy-labor',
    fieldId: 'grinding',
    category: 'energy',
    title: '電力と仕上げ技能の労務費を説明する',
    description: '研削設備の電力と、面精度を確保する熟練技能の労務費上昇を説明します。',
    indicatorIds: ['cgpi-electricity', 'minimum-wage-national-average'],
    suggestedOwnDocuments: ['電力料金明細', '砥石・研磨材の購入実績', '賃金改定資料'],
    howToExplain: '電力の公的指数と最低賃金の上昇を示し、自社の消耗品・賃金資料で補足します。',
  },
  {
    id: 'grinding-consumables',
    fieldId: 'grinding',
    category: 'consumables',
    title: '研磨材・砥石の上昇を示す',
    description: '研削・研磨に使う研磨材や砥石の価格上昇を、公的指数と自社資料で説明します。',
    indicatorIds: ['cgpi-abrasive', 'cgpi-lubricant'],
    suggestedOwnDocuments: ['砥石・研磨材の購入実績', '研削液の購入実績'],
    howToExplain: '研磨材の公的指数で市場傾向を示し、自社の購入実績で個別影響を補足します。',
  },

  // --- プレス加工 ---
  {
    id: 'pressing-material',
    fieldId: 'pressing',
    category: 'material',
    title: '鋼板（素材）の上昇を示す',
    description: 'プレスの素材となる鋼板の価格上昇が採算に直結することを説明します。',
    indicatorIds: ['cgpi-coated-steel-sheet'],
    suggestedOwnDocuments: ['鋼板の改定通知', '直近の仕入明細'],
    howToExplain: '鋼板系の公的指数で市場傾向を示し、改定通知で個別影響を補足します。',
  },
  {
    id: 'pressing-energy-die',
    fieldId: 'pressing',
    category: 'consumables',
    title: '金型費・電力の負担増を補足する',
    description: '継続的に発生する金型費とプレス設備の電力負担の上昇を説明します。',
    indicatorIds: ['cgpi-die-mold', 'cgpi-electricity', 'minimum-wage-national-average'],
    suggestedOwnDocuments: ['金型保全費の実績', '電力料金明細', '賃金改定資料'],
    howToExplain: '金型・電力の公的指数を示し、自社の金型保全費・人件費で実負担を補足します。',
  },

  // --- 板金加工 ---
  {
    id: 'sheet-metal-material',
    fieldId: 'sheet-metal',
    category: 'material',
    title: 'ステンレス・めっき鋼板の上昇を示す',
    description: '板材（ステンレス・めっき鋼板）の価格上昇を公的指数と自社資料で説明します。',
    indicatorIds: ['cgpi-stainless-sheet', 'cgpi-coated-steel-sheet'],
    suggestedOwnDocuments: ['鋼板・ステンレスの改定通知', '直近の仕入明細'],
    howToExplain: '板材の公的指数で市場傾向を示し、改定通知で個別影響を補足します。',
  },
  {
    id: 'sheet-metal-energy',
    fieldId: 'sheet-metal',
    category: 'energy',
    title: 'レーザー電力・アシストガスの上昇を示す',
    description: 'レーザー加工機の電力とアシスト用の産業用ガスのコスト上昇を説明します。',
    indicatorIds: ['cgpi-electricity', 'cgpi-industrial-gas'],
    suggestedOwnDocuments: ['電力料金明細', 'ガス料金明細', '消耗品の購入実績'],
    howToExplain: '電力・産業用ガスの公的指数で上昇傾向を示し、自社の料金明細で実負担を補足します。',
  },

  // --- めっき・コーティング ---
  {
    id: 'plating-material',
    fieldId: 'plating',
    category: 'material',
    title: '非鉄金属・塗料（表面処理材）の上昇を示す',
    description: 'めっき・コーティングの非鉄金属や塗料の価格上昇を説明します。',
    indicatorIds: ['cgpi-nonferrous', 'cgpi-paint'],
    suggestedOwnDocuments: ['薬品・非鉄金属の改定通知', '塗料の購入実績', '排水処理費の実績'],
    howToExplain: '非鉄金属・塗料の公的指数で市場傾向を示し、薬品改定通知・処理費で補足します。',
  },
  {
    id: 'plating-energy',
    fieldId: 'plating',
    category: 'energy',
    title: '電力・用水コストの上昇を示す',
    description: '整流器・加温・排水処理などの電力と用水コストの上昇を説明します。',
    indicatorIds: ['cgpi-electricity', 'minimum-wage-national-average'],
    suggestedOwnDocuments: ['電力・水道料金明細', '賃金改定資料'],
    howToExplain: '電力の公的指数と最低賃金の上昇を示し、自社の料金・賃金資料で補足します。',
  },

  // --- 鋳造・鍛造 ---
  {
    id: 'casting-material',
    fieldId: 'casting',
    category: 'material',
    title: '鋳物素材（銑鉄鋳物・アルミ地金）の上昇を示す',
    description: '銑鉄鋳物・アルミ地金など鋳造素材の価格上昇を説明します。',
    indicatorIds: ['cgpi-pig-iron-castings', 'cgpi-aluminum-ingot'],
    suggestedOwnDocuments: ['地金・副資材の改定通知', '直近の仕入明細'],
    howToExplain: '銑鉄鋳物・アルミ地金の公的指数で市場傾向を示し、改定通知で個別影響を補足します。',
  },
  {
    id: 'casting-energy',
    fieldId: 'casting',
    category: 'energy',
    title: '溶解炉の燃料・電力負担を示す',
    description: '溶解・加熱炉で使う燃料（重油・コークス）と電力のコスト上昇を説明します。',
    indicatorIds: ['cgpi-heavy-oil-bc', 'cgpi-coal-coke', 'cgpi-electricity'],
    suggestedOwnDocuments: ['燃料・電力料金明細', '炉の稼働記録'],
    howToExplain: '重油・コークス・電力の公的指数で上昇傾向を示し、自社の炉稼働・料金で実負担を補足します。',
  },

  // --- 熱処理 ---
  {
    id: 'heat-treatment-energy',
    fieldId: 'heat-treatment',
    category: 'energy',
    title: '炉エネルギー（ガス・電力）の上昇を示す',
    description: '加熱炉を連続運転する熱処理は、ガス・電力コストの影響が特に大きいことを説明します。',
    indicatorIds: ['cgpi-gas', 'cgpi-industrial-gas', 'cgpi-electricity'],
    suggestedOwnDocuments: ['ガス・電力料金明細', '炉保全費の実績'],
    howToExplain: 'ガス・電力の公的指数で上昇傾向を示し、自社の炉稼働・料金で実負担を補足します。',
  },
  {
    id: 'heat-treatment-labor',
    fieldId: 'heat-treatment',
    category: 'labor',
    title: '管理技能の労務費を補足する',
    description: '温度・雰囲気・時間管理の技能に対する労務費の上昇を説明します。',
    indicatorIds: ['minimum-wage-national-average'],
    suggestedOwnDocuments: ['賃金改定資料'],
    howToExplain: '最低賃金の上昇を示し、自社の賃金改定資料で実負担を補足します。',
  },
]
