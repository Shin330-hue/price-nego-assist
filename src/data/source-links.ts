import type { OfficialSourceLink } from '../types/domain'

// 公式情報・支援窓口へのリンク（仕様書 12 章 / 要件 F-010）。
// 外部リンクは必ず target="_blank" rel="noopener noreferrer" で開く。
export const OFFICIAL_SOURCE_LINKS: OfficialSourceLink[] = [
  {
    id: 'jftc-toriteki',
    label: '公正取引委員会：中小受託取引適正化法（取適法）関係',
    url: 'https://www.jftc.go.jp/partnership_package/toritekihou.html',
  },
  {
    id: 'egov-law',
    label: 'e-Gov法令検索',
    url: 'https://laws.e-gov.go.jp/',
  },
  {
    id: 'jftc-labor-transfer-guideline',
    label: '公正取引委員会：労務費の適切な転嫁のための価格交渉に関する指針',
    url: 'https://www.jftc.go.jp/dk/guideline/unyoukijun/romuhitenka.html',
  },
  {
    id: 'sme-price-support',
    label: '中小企業庁：価格交渉・転嫁の支援ツール',
    url: 'https://www.chusho.meti.go.jp/keiei/torihiki/shien_tool.html',
  },
  {
    id: 'boj-cgpi-release',
    label: '日本銀行：企業物価指数 公表データ一覧',
    url: 'https://www.boj.or.jp/statistics/pi/cgpi_release/',
  },
  {
    id: 'mhlw-minimum-wage',
    label: '厚生労働省：地域別最低賃金の全国一覧',
    url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/minimumichiran/index.html',
  },
]

// 相談窓口（価格協議の進め方ガイド・参考リンクで使用）。
export const CONSULTATION_LINKS: OfficialSourceLink[] = [
  {
    id: 'kakekomi',
    label: '取引かけこみ寺（中小企業の取引相談）',
    url: 'https://www.zenkyo.or.jp/kakekomi/',
  },
  {
    id: 'sme-price-support-window',
    label: '中小企業庁：価格交渉・転嫁の支援ツール',
    url: 'https://www.chusho.meti.go.jp/keiei/torihiki/shien_tool.html',
  },
  {
    id: 'jftc-toriteki-window',
    label: '公正取引委員会：中小受託取引適正化法（取適法）関係',
    url: 'https://www.jftc.go.jp/partnership_package/toritekihou.html',
  },
]
