# 引き継ぎメモ: SNS向け UI ポップ化リデザイン

**宛先:** UI改善を担当するコーディングエージェント  
**作成:** 2026-06-27

## 0. 目的

アプリ画面を **SNS投稿で映える、ポップで親しみやすいUI** に。今の「固い」印象を和らげる。
**機能・データ・信頼性はそのまま**、見た目とトーン中心の改善でお願いします。

## 1. プロジェクト概要（背景）

- 金属加工業の中小受託事業者向け「**取適法・公的データ対応 価格協議準備ツール**」。
- ログイン不要の**公開・静的SPA**（React + Vite + TypeScript(strict) + Tailwind CSS + Recharts + React Router、pnpm、Vercel）。
- 公的データ **28系列**（日銀CGPI/SPPI・厚労省最低賃金）、**8加工分野**。
- 仕様の正本: `docs/01_要件定義書.md` / `02_設計書.md` / `03_仕様書.md`。データは `docs/DATA_CATALOG.md`（指標カタログ）/`docs/DATA_UPDATE.md`。`README.md` も参照。

## 2. ❗壊さないでほしいガードレール（最重要）

1. **印刷シートは“固いまま”が正解**: 価格協議準備シート（`src/components/sheet/EvidenceSheet.tsx` ほか `sheet/**`、`.print-sheet`、`src/index.css` の `@media print`）は **取引先に提出する書類**。白背景・黒文字・ビジネス文書調を維持し、ポップ化しない。**アプリ画面（Home/Field/Sources/About）はポップ化OK**。
2. **信頼区分を残す**: 公的データのグラフ・数値＝客観的事実として信頼してよい（肯定的キュー）。**価格協議の進め方ガイド・依頼文テンプレート＝「参考」**（`src/components/ui/ReferenceNote.tsx` の参考バッジ＋注記、見出しの「（参考）」）。この区別を消さない。
3. **出典の追跡性を残す**: 各指標の**出典リンク・日銀データコード（`PR01'…`）・原データCSVリンク**（指標カード詳細・`/sources`・印刷シート）。`src/lib/boj.ts`、`SourceBadge`、`CostIndicatorCard`。
4. **アクセシビリティ**: コントラスト比、フォーカスリング（`:focus-visible`）、警告は**色だけに依存せずアイコン＋テキスト**（`DataQualityBanner`）。チャート線は印刷で潰れない濃色（`CostTrendChart` の `compact`）。
5. **データ品質警告・免責**: `sample` 時の警告（現状 `sample=0` だが機能は維持）、法的免責（`LegalDisclaimer`、フッター短縮版）。
6. **数値・法令の文言は勝手に変えない**: 公的データ値、取適法の条文番号・表現（`src/data/legal-bases.ts`）。誤情報になる。
7. **ゲートを壊さない**: 下記「検証コマンド」が全て通る状態を維持。

## 3. どこを触ると良いか（実装ガイド）

- **配色・トーン**: `src/index.css` の `:root` CSS変数（`--background` `--surface` `--foreground` `--primary` `--muted` 等）が起点。`tailwind.config.js` でこれらを `bg-primary` 等にマップ済みなので、**変数を変えるだけで全体の波及が最小**。現状は鉄黒系ダーク＋溶接オレンジ。ポップ路線（明るい配色・鮮やかなアクセント・大きめ角丸・やわらかい影・絵文字/イラスト等）に振ってOK。
- **共通UI**: `src/components/ui/`（`Button.tsx`、`ExternalLink.tsx`、`ReferenceNote.tsx`）、カード見た目は `.industrial-card`（index.css）。
- **レイアウト/ページ**: `src/components/layout/`（`AppHeader`/`AppFooter`）、`src/pages/`（`HomePage` がSNS流入の入口＝特に映えを意識）。
- **アイコン**: `lucide-react`。ポップにするならイラスト/絵文字の追加も可（アクセシビリティの代替テキストは付ける）。
- **フォント**: 現状システムフォント。丸ゴシック等に変える場合はパフォーマンス（webフォント読込）に注意。
- **触らない方針**: `src/components/sheet/**`、`@media print`（印刷は固い書類のまま）。

## 4. 文言（コピー）の置き場所

- 表示文言・依頼文テンプレート・各種注記は **`src/lib/copy.ts` に集約**。トーンをポップにする場合もここを編集（ヒーロー、CTA、参考注記、免責など）。
- **コピーや構造を変えたらテストも更新**（次項）。

## 5. テスト注意（壊しやすい箇所）

`src/test/ui.test.tsx` が次の文言・構造に依存しています。変更時は同テストを更新してください。
- ヒーロー見出し（`HERO_HEADLINE`）、8分野名（`METAL_FIELDS` の `name`）。
- `/fields/cutting` で「工具鋼 企業物価指数」「買いたたきの禁止」「価格協議のお願い」。
- データコード表示（`PRCG20_2200950007`）・原データリンク（`a[href*="getDataCode"]`）・出典リンク（`a[href*="boj.or.jp"]`）。
- 参考注記（「一般的な流れの参考」「文面づくりの参考用テンプレート」）。
- データ品質バナー（`/開発用サンプルデータ/`）と品質バッジ件数（`サンプルデータ`/`公式（手動更新）`）。
- 不正 `fieldId` で「存在しない加工分野です」、未定義パスで「404」。

`src/test/data-integrity.test.ts` / `calculations.test.ts` / `routes.test.ts` はデータ・ロジック用。UIのみの変更なら基本影響しません。

## 6. OGP画像（SNS映えに直結）

- `public/ogp.png`（**1200×630**）を**ポップなデザインに差し替え推奨**（SNSカードの第一印象）。プログラム生成の雛形は `scripts/generate-ogp.mjs`、手描き画像でも可。
- `index.html` の `og:*` / `twitter:card`（`summary_large_image`）。`og:image`/`og:url` の**絶対URLは公開ドメイン確定後に差し替え**（現状は暫定 `price-nego-assist.vercel.app`）。

## 7. 検証コマンド（PR前に全て通すこと）

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm validate:data
VALIDATE_PRODUCTION=true pnpm validate:data   # sample が無いこと（現状 official_manual=28 / sample=0）
pnpm build
pnpm dev   # 目視: 375 / 768 / 1280px、印刷プレビュー(Cmd+P)で白いA4シート
```

## 8. 完成後の引き継ぎ方法

- 作業は**ブランチ推奨**（例 `feat/pop-ui`）。まとまったら main へ、または PR。
- 完了したら元の担当（Claude）がレビューします。観点:
  1. デザイン/SNS映え・モバイル表示の所感、
  2. 本メモのガードレール（印刷の固さ・信頼区分・出典/データコード・A11y・免責）が保たれているか、
  3. 全ゲートの再確認（必要なら修正）。

## 9. 主要ファイルマップ

```
src/
  index.css                     # CSS変数・テーマ・@media print（配色変更の起点）
  pages/                        # HomePage(入口) / FieldPage / SheetPage(印刷) / Sources / About / NotFound
  components/
    layout/                     # AppHeader / AppFooter / PrintOnly
    ui/                         # Button / ExternalLink / ReferenceNote(参考バッジ)
    field/                      # FieldCard / FieldSelector / FieldCostProfile
    data/                       # CostIndicatorCard / CostTrendChart / SourceBadge / DataQualityBanner
    legal/                      # LegalBasisCard / LegalDisclaimer
    negotiation/               # NegotiationGuide / NegotiationPointCard / LetterTemplate / Checklist
    sheet/                      # EvidenceSheet ほか（印刷＝触らない方針）
  lib/                          # copy.ts(文言) / boj.ts(出典リンク) / calculations / data-loader / ほか
  data/                         # fields / legal-bases / negotiation-points / official-indices(JSON) / source-links
tailwind.config.js              # CSS変数→ユーティリティのマップ
public/ogp.png                  # OGP画像（差し替え推奨）
docs/                           # 要件/設計/仕様 + DATA_CATALOG / DATA_UPDATE / LEGAL_REVIEW / AI_REVIEW_REPORT
```

困ったら `README.md` と `docs/DATA_CATALOG.md` を先に読むと全体像が掴めます。
