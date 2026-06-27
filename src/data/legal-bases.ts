import type { LegalBasis } from '../types/domain'

// =============================================================================
// 取適法・指針などの法令ポイント（設計書 10 章 / 仕様書 5.4）
//
// 重要:
// - 条文番号・表現は docs（仕様書 5.4）からの転記であり、推測で記載していない。
// - 公開前に必ず公式ソース（e-Gov・公正取引委員会テキスト）で人手レビューすること
//   （docs/LEGAL_REVIEW.md 参照）。checkedAt はそのレビュー日に更新する。
// - 「違法」と断定せず「問題となるおそれ」「確認してください」の表現に統一する。
// - 将来 JSON 化してもよいが、リテラル型（sourceType 等）の安全性のため v1.0 は .ts で管理。
// =============================================================================

const TORITEKI_LAW_NAME =
  '製造委託等に係る中小受託事業者に対する代金の支払の遅延等の防止に関する法律（中小受託取引適正化法・取適法）'

const JFTC_TEXT_URL = 'https://www.jftc.go.jp/toriteki/r7text.pdf'
const JFTC_OVERVIEW_URL = 'https://www.jftc.go.jp/partnership_package/toritekihou.html'
const LABOR_GUIDELINE_URL = 'https://www.jftc.go.jp/dk/guideline/unyoukijun/romuhitenka.html'

const COMMON_CAUTION =
  '個別の取引が取適法の対象となるか、また問題となるかは個別事情により異なります。断定はできません。必要に応じて公正取引委員会・中小企業庁・取引かけこみ寺・価格転嫁サポート窓口・弁護士等の専門家にご確認ください。'

const CHECKED_AT = '2026-06-27'

export const LEGAL_BASES: LegalBasis[] = [
  {
    id: 'toriteki-purpose',
    lawName: TORITEKI_LAW_NAME,
    title: '取適法の目的・位置づけ',
    plainSummary:
      '取適法は、発注者（委託事業者）と受注者（中小受託事業者）の取引の適正化を図り、対等な関係のもとで取引が行われることを目的とした制度です。価格転嫁・取引適正化を後押しする枠組みとして位置づけられています。',
    negotiationMeaning:
      '価格協議は「無理なお願い」ではなく、取引を適切な手続きで進めるための正当な行為として位置づけられます。協議の場を求めること自体に後ろめたさを感じる必要はありません。',
    relatedUserAction:
      'まずは対象取引・影響しているコスト・公的データを整理し、協議を申し入れる準備を進めてください。',
    sourceType: 'jftc',
    sourceName: '公正取引委員会 中小受託取引適正化法（取適法）関係',
    sourceUrl: JFTC_OVERVIEW_URL,
    checkedAt: CHECKED_AT,
    caution: COMMON_CAUTION,
  },
  {
    id: 'transaction-terms-disclosure',
    lawName: TORITEKI_LAW_NAME,
    articleLabel: '第4条',
    title: '発注内容等の明示',
    plainSummary:
      '発注者は、発注内容や取引条件を書面または電磁的方法で明らかにすることが求められます。取引条件が曖昧なままだと、後のトラブルや一方的な取扱いにつながりやすくなります。',
    negotiationMeaning:
      '価格協議の前提として、現在の取引条件を双方で文書により確認しておくことが重要です。条件が明確であるほど、変化したコストの説明もしやすくなります。',
    relatedUserAction:
      '現行の発注書・注文条件・単価の根拠資料を手元に揃えてから協議に臨んでください。',
    sourceType: 'jftc',
    sourceName: '公正取引委員会 中小受託取引適正化法テキスト',
    sourceUrl: JFTC_TEXT_URL,
    checkedAt: CHECKED_AT,
    caution: COMMON_CAUTION,
  },
  {
    id: 'price-reduction-prohibition',
    lawName: TORITEKI_LAW_NAME,
    articleLabel: '第5条第1項第3号',
    title: '代金の減額の禁止',
    plainSummary:
      '受注者に責任がないのに、発注後・契約後に代金を一方的に減額することは、問題となるおそれがあります。',
    negotiationMeaning:
      '合意した価格を後から一方的に引き下げられた場合、それは協議の対象になり得ます。協議では「いつ・いくらで・どう合意したか」を明確にしておくことが大切です。',
    relatedUserAction:
      '過去の値引き要請やその経緯があれば、日付・金額・やり取りの記録を整理しておいてください。',
    sourceType: 'jftc',
    sourceName: '公正取引委員会 中小受託取引適正化法テキスト',
    sourceUrl: JFTC_TEXT_URL,
    checkedAt: CHECKED_AT,
    caution: COMMON_CAUTION,
  },
  {
    id: 'low-price-prohibition',
    lawName: TORITEKI_LAW_NAME,
    articleLabel: '第5条第1項第5号',
    title: '買いたたきの禁止',
    plainSummary:
      '通常支払われる対価に比べて著しく低い代金を不当に定めること（買いたたき）は、問題となるおそれがあります。原材料費・エネルギー費・労務費の上昇を反映しない据え置きも、状況により論点になり得ます。',
    negotiationMeaning:
      'コスト上昇が続いているのに価格が据え置かれている場合、その妥当性を協議する根拠になります。公的データは「市場全体で確かにコストが上がっている」ことを示す客観材料になります。',
    relatedUserAction:
      '公的コスト指標と、自社の仕入・電力・賃金などの個別資料を組み合わせて、上昇の実態を整理してください。',
    sourceType: 'jftc',
    sourceName: '公正取引委員会 中小受託取引適正化法テキスト',
    sourceUrl: JFTC_TEXT_URL,
    checkedAt: CHECKED_AT,
    caution: COMMON_CAUTION,
  },
  {
    id: 'unilateral-price-decision-prohibition',
    lawName: TORITEKI_LAW_NAME,
    articleLabel: '第5条第2項第4号',
    title: '協議に応じない一方的な代金決定の禁止',
    plainSummary:
      '中小受託事業者から価格協議の求めがあったにもかかわらず、実質的な協議や必要な説明を行わず、一方的に代金を決定することは問題となり得ます。',
    negotiationMeaning:
      '価格改定を一方的に求めるのではなく、公的データや自社状況を整理し、協議の場を求めることが重要です。協議の求めに応じてもらうこと自体が正当な要請です。',
    relatedUserAction:
      '協議依頼日、提示資料、相手方の回答、次回協議予定を記録してください。',
    sourceType: 'jftc',
    sourceName: '公正取引委員会 中小受託取引適正化法テキスト',
    sourceUrl: JFTC_TEXT_URL,
    checkedAt: CHECKED_AT,
    caution: COMMON_CAUTION,
  },
  {
    id: 'retaliation-prohibition',
    lawName: TORITEKI_LAW_NAME,
    articleLabel: '第5条第1項第7号',
    title: '報復措置の禁止',
    plainSummary:
      '受注者が公的機関へ相談・申告したことや、協議を求めたことを理由に、取引数量の削減や取引停止などの不利益な取扱いをすることは、問題となるおそれがあります。',
    negotiationMeaning:
      '協議を申し入れることで取引を打ち切られるのではという不安は、制度上は配慮されています。協議を求めること自体を理由とした不利益取扱いは問題になり得ます。',
    relatedUserAction:
      '協議後に取引条件が不利に変わった場合は、その経緯を記録し、必要に応じて公的窓口へ相談してください。',
    sourceType: 'jftc',
    sourceName: '公正取引委員会 中小受託取引適正化法テキスト',
    sourceUrl: JFTC_TEXT_URL,
    checkedAt: CHECKED_AT,
    caution: COMMON_CAUTION,
  },
  {
    id: 'negotiation-record-guideline',
    lawName: '労務費の適切な転嫁のための価格交渉に関する指針',
    articleLabel: '労務費転嫁指針',
    title: '価格交渉の記録作成',
    plainSummary:
      '労務費の適切な転嫁のための価格交渉に関する指針では、価格交渉の経緯を記録し、双方で必要な情報を確認しながら協議を進めることが推奨されています。',
    negotiationMeaning:
      '協議の記録を残すことは、後の認識違いを防ぎ、継続的な協議をしやすくします。記録は自社を守るためにも有効です。',
    relatedUserAction:
      '交渉日時・相手方・提示した資料・回答内容・次回予定を、簡単な記録として残してください。',
    sourceType: 'jftc',
    sourceName: '公正取引委員会 労務費の適切な転嫁のための価格交渉に関する指針',
    sourceUrl: LABOR_GUIDELINE_URL,
    checkedAt: CHECKED_AT,
    caution: COMMON_CAUTION,
  },
]
