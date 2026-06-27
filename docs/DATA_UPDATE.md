# データ更新手順（公的指標）

公的指標は `src/data/official-indices/*.json` に **1指標1ファイル** で管理します。実行時に外部APIへアクセスしません（要件 4.2）。

## 重要原則

- **数値を推測で作らない。** 確認できない値は `quality: "sample"` のままにする（仕様書 16 章）。
- 実数を入れたら `quality` を `official_manual`（手動転記・確認済み）に変更し、`retrievedAt` を実取得日、`publishedAt` を公式公表日にする。
- 出典メタ（`publisher` / `sourceName` / `sourceUrl` / `seriesName` / `unit` / `baseYear`）は公式文書から正確に転記する。

## 指標一覧

> v1.1 で **28指標**に拡充済み（CGPI 26 + SPPI 1 + 最低賃金 1）。**全指標の一覧・系列コード・分野別マッピング・履歴範囲は `DATA_CATALOG.md`（単一情報源）を参照**。本表は初期5指標の出典の例示。

| id | 出典 | 取得元 |
|---|---|---|
| `cgpi-steel` | 日本銀行 企業物価指数（2020年基準）/ 鉄鋼 | https://www.boj.or.jp/statistics/pi/cgpi_release/ |
| `cgpi-nonferrous` | 日本銀行 企業物価指数 / 非鉄金属 | 同上 |
| `cgpi-electricity` | 日本銀行 企業物価指数 / 電力 | 同上 |
| `cgpi-gas` | 日本銀行 企業物価指数 / 都市ガス | 同上 |
| `minimum-wage-national-average` | 厚生労働省 地域別最低賃金 全国加重平均 | https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/minimumichiran/index.html |

## 実データ取得レシピ（v1.0 実装で使用）

### CGPI 4系列（鉄鋼/非鉄/電力/都市ガス）— 日銀 REST API（CSV直返し）

PDF/Excel ではなく、日銀の時系列 REST API から CSV を直接取得できる（cookie 不要・GET 一発）。

```
https://www.stat-search.boj.or.jp/api/v1/getDataCode?format=csv&lang=jp&db=PR01&startDate=YYYYMM&endDate=YYYYMM&code=<系列コード>
```

| id | 系列コード（code パラメータ） |
|---|---|
| `cgpi-steel`（鉄鋼） | `PRCG20_2200920001` |
| `cgpi-nonferrous`（非鉄金属） | `PRCG20_2201020001` |
| `cgpi-electricity`（電力） | `PRCG20_2202230001` |
| `cgpi-gas`（都市ガス） | `PRCG20_2202230002` |

- `db=PR01`（国内CGPI）。`code` に `PR01'` 接頭辞を付けない（付けると HTTP 400 / `M181001E`）。
- 返却は Shift_JIS の long 形式 CSV（データ行の末尾が `…,YYYYMM,値`）。値は ASCII なので `latin1` 読みで period/value を安全に抽出できる。
- 系列コードは公式マスター `https://www.stat-search.boj.or.jp/info/PRList.xlsx`（シート CGPI）で検証する。
- 公表日は毎月の速報PDF（例 `cgpi2605.pdf` = 2026年5月速報, 公表 2026-06-10）と一致を確認する。

### 最低賃金 全国加重平均 — 厚生労働省（年1値・転記）

- 推移（全年度・公式PDF）: https://www.mhlw.go.jp/content/11200000/001572925.pdf
  （確認済み: 令和2〜7年度 = 902 / 930 / 961 / 1004 / 1055 / 1121 円）
- 令和7年度（2025）= 1,121円 は 2025-09-05 報道発表で確定（発効は2025-10-01〜順次）。
  全国一覧PDF: https://www.mhlw.go.jp/content/11200000/001571192.pdf ／ 報道発表: https://www.mhlw.go.jp/stf/newpage_63030.html

> 注: BOJ は API で機械可読取得が可能。最低賃金は年1値のため転記＋人手確認。いずれも実数投入後は `quality` を `official_manual` にし、`retrievedAt`/`publishedAt` を更新する。

## 出典の特定・検証方法（系列コード）

公的指標の出典は「公表ページ」だけでは個別系列に辿り着けない。**系列コードが出典の一意キー**。

**重要: 2種類のコード形式がある。**
- **API 用（裸コード）**: `PRCG20_2200950007`（`db=PR01` を別指定）。JSON の `calculationNote` に保持し、`data-loader` が `seriesCode` として補完。
- **検索フォーム用（データコード）**: 統計コード接頭辞付き `PR01'PRCG20_2200950007`（CGPI=`PR01'…` / SPPI=`PR02'…`）。**裸コードだけではフォードで検索できない**。アプリ画面の「データコード」欄はこの接頭辞付き形式で表示している。

確認方法:
1. 日銀 時系列統計データ検索サイト `https://www.stat-search.boj.or.jp/` の「データコード直接入力」に、**接頭辞付きデータコード**（例: 工具鋼 = `PR01'PRCG20_2200950007`）を貼り付け → 数値・グラフ・ダウンロード。
2. もしくは「原データCSV」リンク（当該系列だけを返す REST API、ワンクリックで確実）:
   `https://www.stat-search.boj.or.jp/api/v1/getDataCode?format=csv&lang=jp&db=PR01&code=PRCG20_2200950007`（SPPI は `db=PR02`、`code=PRCS20_…`）。

各指標カードの「出典・計算メモを表示」、出典一覧（`/sources`）、印刷シートの出典一覧に、この**接頭辞付きデータコード**と上記リンクを表示している。

## v1.1 拡充レシピ（10年履歴・品目拡張・貿易統計）

### 10年履歴
- CGPI は `startDate=201601` で過去10年（約120点）取得（2010年まで遡及も可）。グラフは軸間引きで表示、印刷は年平均間引きで可読性を確保。

### CGPI 品目の系列コード解決（PRList.xlsx）
- 公式マスター `https://www.stat-search.boj.or.jp/info/PRList.xlsx` を解析し、品目名 → `PRCG20_…` を確定する。
- 手順例: `curl -s <PRList.xlsx> -o PRList.xlsx && unzip -oq PRList.xlsx -d x` → `x/xl/worksheets/*.xml` と `x/xl/sharedStrings.xml` を突き合わせ、対象品目名（例 `品目/____特殊鋼切削工具`）の行から系列コード列を取得。**国内（`db=PR01` / `PRCG20`）系列**を選ぶ。
- 確定した品目↔コードは `docs/DATA_CATALOG.md` に記録する。

### 貿易統計（工具材質など CGPI に無い品目）
- 財務省 貿易統計（普通貿易統計）から、対象HSコードの月次「金額」「数量」を取得し、**輸入単価 = 金額 ÷ 数量** を系列化する（単位例: 円/kg）。
- 取得経路: e-Stat API（`appId` 必要）または財務省 貿易統計検索。HSコードは品目に応じて確定（例: タングステン = HS 8101 系）。
- `baseYear` は持たない（指数でないため基準年比は出さない）。`unit` は「円/kg（輸入単価）」等、`calculationNote` に算出方法とHSコードを明記する。
- 取得・検証できたもののみ `official_manual`。抽出が不確実なら `quality:"sample"` として警告表示し、本番ゲートで弾く。

### SPPI（企業向けサービス価格指数）

サービス系（例: 産業廃棄物処理）は SPPI を使う。API は CGPI と同じ `getDataCode` だが **`db=PR02`**、コード接頭辞は **`PRCS20_`**。

```
https://www.stat-search.boj.or.jp/api/v1/getDataCode?format=csv&lang=jp&db=PR02&startDate=YYYYMM&endDate=YYYYMM&code=PRCS20_...
```

- `sourceName` は「企業向けサービス価格指数（2020年基準）」とし CGPI と区別。`sourceUrl` は SPPI 公表ページ `https://www.boj.or.jp/statistics/pi/cspi_release/index.htm`。
- `calculationNote` に系列コード（`PRCS20_…`）を明記（再取得性の担保。`validate:data` が検証）。
- `publishedAt` は CSV の `LAST_UPDATE`（データ行の period 直前の8桁 YYYYMMDD）から取得すると正確（CGPI と公表日が異なる）。

## 更新フロー

1. 公式ソース（日銀CGPI / 厚労省最低賃金）から最新の系列値を取得する。
2. 該当 JSON の `values`（`period` 昇順）を更新する。月次は `YYYY-MM`、年次は `YYYY`。
3. `quality` を `official_manual` に、`retrievedAt` を当日、`publishedAt` を公表日に更新する。
4. `pnpm validate:data` を実行し、構造・参照・日付・URL を検証する。
5. 公開前に `VALIDATE_PRODUCTION=true pnpm validate:data` を実行し、`sample` が残っていないことを確認する。

## 計算ラベルの注意

- 基準年比（`2020年平均比` など）は `baseYear` があり基準=100 の指数のみ。
- 配列先頭→最新の比較は「表示期間内変化率」。基準年比と混同しない。
- 前年比は frequency（月次=前年同月 / 四半期=前年同四半期 / 年次=前年）で比較する。「5データポイント前」固定比較は禁止。

将来的な半自動化の雛形は `scripts/update-official-data.example.ts` を参照（抽出結果は必ず人手レビュー）。
