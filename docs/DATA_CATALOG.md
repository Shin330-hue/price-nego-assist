# 指標カタログ（分野別マッピング）

本ファイルは公的指標の**単一情報源**。各指標の id・出典・系列コード・単位・状態と、分野ごとの割り当てを管理する。

- 系列コードは BOJ 公式マスター `PRList.xlsx` から確定し、BOJ REST API で実在検証済み（手順は `DATA_UPDATE.md`）。
- 出典は **CGPI=企業物価指数（`db=PR01` / `PRCG20_`）**、**SPPI=企業向けサービス価格指数（`db=PR02` / `PRCS20_`）**、最低賃金=厚労省。
- 履歴は **10年（2016-01〜）** を既定。系列により遡及開始が異なる（小類別は2020開始のものがある）。
- 数値は推測しない。取得・検証できたもののみ `official_manual`、不確実は `sample`（警告表示・本番ゲートで弾く）。

## 指標カタログ（実装済み・28指標）

| id | 名称 | 出典 | 系列コード | 単位 | 履歴 |
|---|---|---|---|---|---|
| `cgpi-steel` | 鉄鋼 | 日銀 CGPI | `PRCG20_2200920001` | 指数(2020=100) | 2016〜 |
| `cgpi-nonferrous` | 非鉄金属 | 日銀 CGPI | `PRCG20_2201020001` | 指数 | 2016〜 |
| `cgpi-electricity` | 電力 | 日銀 CGPI | `PRCG20_2202230001` | 指数 | 2020〜 |
| `cgpi-gas` | 都市ガス | 日銀 CGPI | `PRCG20_2202230002` | 指数 | 2020〜 |
| `minimum-wage-national-average` | 最低賃金 全国加重平均 | 厚労省 | （推移PDF） | 円/時 | 2016〜2025 |
| `cgpi-tool-steel` | 工具鋼 | 日銀 CGPI | `PRCG20_2200950007` | 指数 | 2016〜 |
| `cgpi-cutting-tool` | 特殊鋼切削工具 | 日銀 CGPI | `PRCG20_2201350022` | 指数 | 2016〜 |
| `cgpi-cemented-carbide-tools` | 超硬工具 | 日銀 CGPI | `PRCG20_2201350023` | 指数 | 2016〜 |
| `cgpi-welding-rod` | 溶接棒 | 日銀 CGPI | `PRCG20_2201150024` | 指数 | 2016〜 |
| `cgpi-abrasive` | 研磨材 | 日銀 CGPI | `PRCG20_2200850023` | 指数 | 2016〜 |
| `cgpi-lubricant` | 潤滑油 | 日銀 CGPI | `PRCG20_2200650008` | 指数 | 2016〜 |
| `cgpi-die-mold` | 金型 | 日銀 CGPI | `PRCG20_2201350027` | 指数 | 2016〜 |
| `cgpi-industrial-gas` | 圧縮ガス・液化ガス | 日銀 CGPI | `PRCG20_2200550004` | 指数 | 2016〜 |
| `cgpi-lpg` | LPG（液化石油ガス） | 日銀 CGPI | `PRCG20_2200650010` | 指数 | 2016〜 |
| `cgpi-heavy-oil-a` | A重油 | 日銀 CGPI | `PRCG20_2200650006` | 指数 | 2016〜 |
| `cgpi-heavy-oil-bc` | B・C重油 | 日銀 CGPI | `PRCG20_2200650007` | 指数 | 2016〜 |
| `cgpi-coal-coke` | 石炭コークス | 日銀 CGPI | `PRCG20_2200650011` | 指数 | 2016〜 |
| `cgpi-paint` | 塗料 | 日銀 CGPI | `PRCG20_2200540020` | 指数 | 2020〜 |
| `cgpi-water` | 水道 | 日銀 CGPI | `PRCG20_2202230003` | 指数 | 2020〜 |
| `cgpi-pig-iron-castings` | 機械用銑鉄鋳物 | 日銀 CGPI | `PRCG20_2200950022` | 指数 | 2016〜 |
| `cgpi-aluminum-ingot` | アルミニウム合金地金 | 日銀 CGPI | `PRCG20_2201050003` | 指数 | 2016〜 |
| `cgpi-copper` | 銅 | 日銀 CGPI | `PRCG20_2201050001` | 指数 | 2016〜 |
| `cgpi-brass` | 黄銅伸銅品 | 日銀 CGPI | `PRCG20_2201050012` | 指数 | 2016〜 |
| `cgpi-refractory` | 耐火物 | 日銀 CGPI | `PRCG20_2200850020` | 指数 | 2016〜 |
| `cgpi-stainless-sheet` | ステンレス冷延鋼板 | 日銀 CGPI | `PRCG20_2200950016` | 指数 | 2016〜 |
| `cgpi-coated-steel-sheet` | 亜鉛めっき鋼板 | 日銀 CGPI | `PRCG20_2200950019` | 指数 | 2020〜 |
| `cgpi-bolts-nuts` | ボルト・ナット | 日銀 CGPI | `PRCG20_2201150010` | 指数 | 2016〜 |
| `sppi-industrial-waste-disposal` | 産業廃棄物処理 | 日銀 **SPPI** | `PRCS20_5202050003`（`db=PR02`） | 指数 | 2016〜 |

### 採用見送り・保留（誤った名称を付けないため）

| 候補 | 結果 |
|---|---|
| タングステン 輸入単価（HS 8101） | **保留**。e-Stat API は appId 必須・CSV直DL不可で未取得。工具材は `cgpi-cemented-carbide-tools`（超硬工具）等で代替済み。appId 入手後に追加可 |
| 研削と石（砥石） | 2020年基準に独立品目なし → `cgpi-abrasive`（研磨材）で代替 |
| ニッケル地金 / フェロクロム | 独立品目なし → 採用せず（`cgpi-nonferrous`/`cgpi-copper`/`cgpi-brass` で非鉄を表現） |
| 普通鋼鋼材 / 機械工具 | `cgpi-steel` / `cgpi-cutting-tool` 等と重複のため不採用 |

## 分野別マッピング（実装済み）

| 分野 | 割り当て指標 id |
|---|---|
| `cutting` 切削 | `cgpi-tool-steel`, `cgpi-cutting-tool`, `cgpi-cemented-carbide-tools`, `cgpi-copper`, `cgpi-brass`, `cgpi-lubricant`, `cgpi-electricity`, `minimum-wage-national-average` |
| `welding` 溶接 | `cgpi-steel`, `cgpi-welding-rod`, `cgpi-industrial-gas`, `cgpi-electricity`, `minimum-wage-national-average` |
| `grinding` 研磨 | `cgpi-abrasive`, `cgpi-lubricant`, `sppi-industrial-waste-disposal`, `cgpi-electricity`, `minimum-wage-national-average` |
| `pressing` プレス | `cgpi-coated-steel-sheet`, `cgpi-die-mold`, `cgpi-lubricant`, `cgpi-electricity`, `minimum-wage-national-average` |
| `sheet-metal` 板金 | `cgpi-stainless-sheet`, `cgpi-coated-steel-sheet`, `cgpi-industrial-gas`, `cgpi-bolts-nuts`, `cgpi-electricity`, `minimum-wage-national-average` |
| `plating` めっき | `cgpi-nonferrous`, `cgpi-paint`, `cgpi-water`, `sppi-industrial-waste-disposal`, `cgpi-electricity`, `minimum-wage-national-average` |
| `casting` 鋳造 | `cgpi-pig-iron-castings`, `cgpi-aluminum-ingot`, `cgpi-refractory`, `cgpi-heavy-oil-bc`, `cgpi-coal-coke`, `cgpi-electricity`, `minimum-wage-national-average` |
| `heat-treatment` 熱処理 | `cgpi-gas`, `cgpi-industrial-gas`, `cgpi-refractory`, `cgpi-lpg`, `cgpi-heavy-oil-a`, `cgpi-electricity`, `minimum-wage-national-average` |

## 注記

- 採用品目を増減した場合は、`fields.ts` の `relatedIndicatorIds`・`negotiation-points.ts` の `indicatorIds`・`data-loader.ts` の import/配列・本表を必ず同期する。
- `pnpm validate:data`（および `data-integrity.test.ts`）が次を検証する: 指標の必須メタ・`period` 昇順・`https://`・ISO日付、`fields`/`negotiation-points` の indicatorId 実在、**交渉ポイントの indicatorId が同一分野の `relatedIndicatorIds` に含まれること**、日銀系指標の `calculationNote` に系列コード（`PRCG20_`/`PRCS20_`）があること、本番モードでの `sample` 検出。なお本表（DATA_CATALOG）と `fields.ts` の一致は手動確認とする。
- 電力・都市ガス・塗料・亜鉛めっき鋼板・水道は2020年基準の小類別/品目で遡及が2020開始。10年に揃える場合は2015基準系列とのリンクが必要（別作業）。
