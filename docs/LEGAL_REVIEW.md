# 法令情報レビュー手順

取適法・指針に関する情報は `src/data/legal-bases.ts` に **`LegalBasis` 型で一元管理** します。条文番号がコード内に散在しないようにしています（要件 F-005）。

## 公開前に必ず確認すること

法令条文番号・表現は **公式ソースで人手確認** が必要です（仕様書 16 章「条文番号を推測で記載しない」）。本実装の条文ラベルは仕様書 5.4 からの転記であり、**公開前に下記の一次/準一次ソースで再確認**してください。確認後、各エントリの `checkedAt` を確認日に更新します。

| 用途 | ソース | URL |
|---|---|---|
| 取適法 概要 | 公正取引委員会 中小受託取引適正化法（取適法）関係 | https://www.jftc.go.jp/partnership_package/toritekihou.html |
| 取適法 条文 | e-Gov法令検索 | https://laws.e-gov.go.jp/ |
| 取適法 テキスト | 公正取引委員会 取適法テキスト | https://www.jftc.go.jp/toriteki/r7text.pdf |
| 取適法 ガイドブック | 公正取引委員会 取適法ガイドブック | https://www.jftc.go.jp/file/toriteki002.pdf |
| 労務費転嫁指針 | 公正取引委員会 労務費の適切な転嫁のための価格交渉に関する指針 | https://www.jftc.go.jp/dk/guideline/unyoukijun/romuhitenka.html |

## v1.0 の法令カード（要確認の条文ラベル）

| id | title | articleLabel |
|---|---|---|
| `toriteki-purpose` | 取適法の目的・位置づけ | （任意） |
| `transaction-terms-disclosure` | 発注内容等の明示 | 第4条 |
| `price-reduction-prohibition` | 代金の減額の禁止 | 第5条第1項第3号 |
| `low-price-prohibition` | 買いたたきの禁止 | 第5条第1項第5号 |
| `unilateral-price-decision-prohibition` | 協議に応じない一方的な代金決定の禁止 | 第5条第2項第4号 |
| `retaliation-prohibition` | 報復措置の禁止 | 第5条第1項第7号 |
| `negotiation-record-guideline` | 価格交渉の記録作成 | 労務費転嫁指針 |

## 表現レビューの観点

- 「違法です」と断定せず、「問題となるおそれがあります」「確認してください」とする。
- 「発注者は必ず値上げに応じなければならない」のような誤解を招く表現を避ける。
- 「協議に応じること」「必要な説明・情報提供」「一方的な代金決定を避けること」を中心に説明する。
- 各カードに出典URLと `checkedAt`（確認日）を必ず持たせる。目安としてリリース日から3か月以内。

## レビュー記録

| 日付 | 確認者 | 対象 | 結果 |
|---|---|---|---|
| （未実施） | | 全 `LegalBasis` の条文番号・表現 | 公開前に実施すること |
