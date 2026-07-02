# 取適法・公的データ対応 価格協議準備ツール（金属加工業向け）

金属加工業の中小受託事業者が、取引先へ価格協議を申し入れる前に、**公的なコスト上昇データ・取適法関連ポイント・協議の進め方・コピペ可能な依頼文**を確認し、A4の価格協議準備シートとして出力できる、ログイン不要の公開Webツールです。

- 認証・DB・バックエンドなしの **静的フロントエンド SPA**
- 公的データは実行時APIを使わず、リポジトリ内 JSON として管理（出典・取得日付き）
- 法令情報は断定を避け、平易な言葉で表示。**個別判断は公的窓口・専門家へ** と明示

> 本ツールは価格協議の準備を支援する参考情報を提供するものであり、法律相談・個別案件の適法性判断を行うものではありません。

## ツールの位置づけと信頼区分

本ツールは価格交渉を代行・保証するものではなく、**支援ツール**です。機能の優先度は ①コスト上昇要因の公的データ提供と分野への紐付け → ②データの見せ方 → ③依頼文の書き方の参考、です。

情報の確からしさを取り違えないよう、UI でも次を区別しています。

- **公的データに基づくグラフ・数値**：出典の明確な客観的事実。各データに出典リンクを表示します。
- **価格協議の進め方ガイド／依頼文テンプレート**：一般的な流れ・文面の**参考**であり、実績や成果を保証するものではありません（各所に「参考」表示）。

## 技術スタック

React + Vite + TypeScript(strict) / Tailwind CSS / Recharts / React Router / Vitest + Testing Library / ESLint + Prettier。パッケージ管理は pnpm。

## セットアップ

```bash
pnpm install
pnpm dev          # 開発サーバ
```

## スクリプト

| コマンド | 内容 |
|---|---|
| `pnpm dev` | 開発サーバ |
| `pnpm build` | 型チェック + 本番ビルド |
| `pnpm preview` | ビルド結果のプレビュー |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Vitest（単体・UI） |
| `pnpm validate:data` | データ検証（開発時は sample 許容） |
| `pnpm format` | Prettier |

本番ゲート（sample データが残っていたら失敗）:

```bash
VALIDATE_PRODUCTION=true pnpm validate:data
```

## ディレクトリ

```
src/
  data/                 # 8分野・公的指標(JSON)・法令・交渉ポイント・公式リンク
  lib/                  # 計算・フォーマッタ・データローダ・検証・コピー文言
  components/           # layout / field / data / legal / negotiation / sheet / ui
  pages/                # Home / Field / Sheet / Sources / About / NotFound
  routes.tsx            # React Router 定義（lib/routes.ts はパス生成・検証）
  test/                 # 単体・データ整合性・UI テスト
scripts/
  validate-data.ts        # データ検証スクリプト
  generate-ogp.mjs        # OGP 画像生成
  generate-sitemap.ts     # sitemap.xml / robots.txt 生成（build 前に実行）
  update-official-data.ts # 日銀 API から公的データを更新（pnpm update:data）
docs/                   # 要件/設計/仕様 + DATA_UPDATE / DATA_CATALOG / LEGAL_REVIEW
```

## データ・出典について

公的指標は実行時APIを使わず、リポジトリ内 JSON（出典URL・公表日・取得日・系列名つき）として管理し、各データに出典リンクを表示します。

- 日銀 企業物価指数（CGPI）: 鉄鋼・非鉄・電力・都市ガスに加え、工具鋼・特殊鋼切削工具・**超硬工具**・溶接棒・研磨材・潤滑油・金型・圧縮/液化ガス・**LPG**・**A/B・C重油**・**石炭コークス**・耐火物・機械用銑鉄鋳物・アルミ合金地金・**銅**・**黄銅伸銅品**・ステンレス冷延鋼板・亜鉛めっき鋼板・**ボルト・ナット**・塗料・**水道**。REST APIで取得、既定 **過去10年（2016年〜）**（一部の小類別は2020年〜）。
- 日銀 企業向けサービス価格指数（SPPI）: **産業廃棄物処理**（`db=PR02` / `PRCS20_`）。
- 最低賃金 全国加重平均: 厚生労働省 確定値（2016〜2025）。
- タングステン（HS 8101）の輸入単価は **保留**（e-Stat の appId 未取得）。工具材は超硬工具・工具鋼・特殊鋼切削工具で代替。

現在の公的指標は **28件すべて実データ（`official_manual`）**。数値は推測せず、取得・検証できたもののみ `official_manual`、不確実なものは `quality:"sample"` として画面・印刷シートに警告を出し、`VALIDATE_PRODUCTION=true pnpm validate:data` で本番ビルドから弾きます。

全指標の一覧・系列コード・分野別マッピングの**単一情報源**は [docs/DATA_CATALOG.md](docs/DATA_CATALOG.md)。データ更新手順は [docs/DATA_UPDATE.md](docs/DATA_UPDATE.md)、法令表現のレビューは [docs/LEGAL_REVIEW.md](docs/LEGAL_REVIEW.md) を参照してください。

## デプロイ（Vercel）

静的 SPA として Vercel にデプロイします。`vercel.json` の rewrites で全パスを `index.html` に向け、クライアントサイドルーティングのリロード404を回避します。OGP の `og:image` / `og:url` は絶対URLが必要なため、公開ドメイン確定後に `index.html` のプレースホルダURLを差し替えてください。
