import type { FieldId } from '../types/domain'

export const FIELD_PRESENTATION: Record<
  FieldId,
  {
    tagline: string
    imageSrc: string
    imageAlt: string
  }
> = {
  cutting: {
    tagline: '工具代、じわじわ来てる系',
    imageSrc: '/illustrations/fields/cutting.png',
    imageAlt: '切削加工を表す町工場マンガ風イラスト',
  },
  welding: {
    tagline: '火花の裏で、材料とガスも上昇中',
    imageSrc: '/illustrations/fields/welding.png',
    imageAlt: '溶接・接合を表す町工場マンガ風イラスト',
  },
  grinding: {
    tagline: '砥石・電気・処理費が効く系',
    imageSrc: '/illustrations/fields/grinding.png',
    imageAlt: '研磨・表面処理を表す町工場マンガ風イラスト',
  },
  pressing: {
    tagline: '鋼板と金型、どちらも見逃せない系',
    imageSrc: '/illustrations/fields/pressing.png',
    imageAlt: 'プレス加工を表す町工場マンガ風イラスト',
  },
  'sheet-metal': {
    tagline: '板材・ガス・購入部品がじわっと来る系',
    imageSrc: '/illustrations/fields/sheet-metal.png',
    imageAlt: '板金加工を表す町工場マンガ風イラスト',
  },
  plating: {
    tagline: '電気・水・処理費が効く系',
    imageSrc: '/illustrations/fields/plating.png',
    imageAlt: 'めっき・コーティングを表す町工場マンガ風イラスト',
  },
  casting: {
    tagline: '炉の燃料と素材がずっしり系',
    imageSrc: '/illustrations/fields/casting.png',
    imageAlt: '鋳造・鍛造を表す町工場マンガ風イラスト',
  },
  'heat-treatment': {
    tagline: '炉エネルギー、じわっと重い系',
    imageSrc: '/illustrations/fields/heat-treatment.png',
    imageAlt: '熱処理を表す町工場マンガ風イラスト',
  },
}

export const NEGOTIATION_POINT_BLURBS: Record<string, string> = {
  'cutting-material': '工具まわりの上昇、指数でもちゃんと見えます。',
  'cutting-energy-labor': '加工時間ぶんの電気と人手、積み上がっています。',
  'cutting-nonferrous': '銅・黄銅の材料感、まとめて説明できます。',
  'welding-material': '鋼材と溶接材料、どちらも根拠をそろえましょう。',
  'welding-energy': '電力とガス、火花の裏側のコストです。',
  'grinding-energy-labor': '仕上げの品質は、電気と技能に支えられています。',
  'grinding-consumables': '研磨材だけでなく、処理費もじわっと効きます。',
  'pressing-material': '鋼板の上昇は、まず公的データで確認できます。',
  'pressing-energy-die': '金型保全と電力、見えにくい負担を見える化します。',
  'sheet-metal-material': '板材の上昇、ステンレスとめっき鋼板で押さえます。',
  'sheet-metal-energy': 'レーザー加工の電気とガス、ここも根拠になります。',
  'sheet-metal-parts': '購入部品の上昇も、ちゃんと説明材料になります。',
  'plating-material': '薬品・塗料・処理費、まとめて根拠をそろえます。',
  'plating-energy': '用水と電力、めっきの裏方コストです。',
  'casting-material': '地金と鋳物素材、まずは市場全体の動きから。',
  'casting-energy': '炉の燃料と電力、上昇を数字で見せられます。',
  'heat-treatment-energy': 'ガス・LPG・重油・電力、炉まわりをまとめて確認。',
  'heat-treatment-labor': '温度管理の技能も、準備資料で補足できます。',
}
