# QMAH 開發文件

## 快速理解

| 先問自己 | 文件直接回答 |
| --- | --- |
| Why（為什麼要看這頁） | 第一次進入專案時，最容易浪費時間的不是找不到文件，而是進了看似相關但不負責該問題的頁面。README 先把工作、入口和正規來源接起來，讓查閱可以從任務開始。 |
| What（現在實際提供什麼） | 這頁把環境與共同資料、系統快速頁、API、資料表、Angular 使用者前台、Razor 管理後台、資料工具、名詞和 Git 協作分開；快速頁回答系統怎麼運作，詳細頁再提供欄位、流程、命令和檢查方式。 |
| How（要找答案怎麼走） | 先在「按工作找文件」選擇要做的事，再進該系統的快速查閱頁確認責任與流程，最後沿著查詢入口進入 API、資料表、程式或工具文件。文件排列只是查找路徑，五個功能系統、營運中心與共用基礎可以平行開發。 |

**適用情境：** 剛 Clone 專案、不知道某個問題該查哪一頁，或需要把文件入口交給其他組員時，先從本頁的「按工作找文件」開始，不必依照側欄順序讀完整站。

[QMAH 專案](https://github.com/MSIT173-03/QMAH) ｜ [QMAH-Docs 專案](https://github.com/MSIT173-03/QMAH-Docs) ｜ [QMAH-Database 專案](https://github.com/MSIT173-03/QMAH-Database) ｜ [QMAH-Docs 文件站](https://msit173-03.github.io/QMAH-Docs/)

這個 Repository 同時是 QMAH 的文件來源與 GitHub Pages 的 VitePress 建置來源。Markdown 保留在 Repository 中供檢視、版本追蹤與離線閱讀；文件站直接使用這批檔案，不另維護網站副本。

## 如何查找文件

文件站不是開發排程。五個功能系統與營運中心可以平行開發；下列路線只是依任務查找文件時的建議入口：

1. [開發環境與啟動](getting-started/development-environment.md) 建立工具、服務與連線基線。
2. [開發資料與本機展示](getting-started/development-data.md) 確認共同 Snapshot 的內容、關係與狀態。
3. [系統架構總覽](architecture/system-overview.md) 了解三個 Repository、網站、API、前端與資料庫的邊界。
4. 依功能範圍開啟 [五個系統、營運中心與共用入口索引](index.md#system-index)，七頁使用相同的查閱邏輯，再進入該頁列出的詳細文件。
5. 精確欄位、HTTP 行為、工具參數或交付規則集中於 [參考文件](reference/rest-api.md) 分類查詢。

## 五個系統、營運中心與共用入口

五個功能系統與 Shared 的快速查閱頁使用相同的標題：`快速查閱`、`系統範圍`、`實際運作方式`、`資料表與關聯`、`開發規則與跨系統界線`、`查詢入口`、`前台接手建議`、`變更前檢查`、`後續查閱`。Operations 是管理後台入口，因此將 `前台接手建議` 改為 `管理後台接手建議`；詳細規則以連結的正規文件為準。

| 系統 | 快速查閱頁 | 內容範圍 |
| --- | --- | --- |
| Shared | [共用基礎](quick-reference/shared.md) | 環境、資料表、API、資料存取、媒體、Snapshot、協作與跨系統界線 |
| Operations | [營運中心](quick-reference/operations.md) | 統計卡片、日期篩選、資產批次、管理員操作與稽核結果 |
| Catalog | [圖鑑與文物](quick-reference/catalog.md) | 文物、分類、年代、題庫設定、解鎖與匯入 |
| Game | [遊戲與作答](quick-reference/game.md) | 房間、回合、選題、作答、投票與獎勵 |
| Social | [社群與活動](quick-reference/social.md) | 貼文、留言、檢舉、活動、通知、地點與媒體 |
| User | [會員與 Identity](quick-reference/user.md) | 帳號、登入、個人資料、地址與會員資產 |
| Store | [商城與訂單](quick-reference/store.md) | 商品、購物車、折價券、訂單、付款與庫存 |

## 文件目錄

### 開始開發

- [5＋1 系統：快速查閱與操作流程](getting-started/system-walkthrough.md)
- [開發環境與啟動](getting-started/development-environment.md)
- [開發資料與本機展示](getting-started/development-data.md)

### 架構

- [系統架構總覽](architecture/system-overview.md)
- [Area 責任與資料界線](architecture/area-boundaries.md)
- [資料存取與 DB-first](architecture/data-access.md)
- [QMAH SSMS Diagram 建立參考](architecture/database-diagram.md)
- [資料表參考](architecture/database-reference.md)

### 前端

- [Angular 使用者前台開發](frontend/angular-development.md)
- [前台功能接手指南](frontend/feature-development-guide.md)
- [媒體交付設定](frontend/media-delivery.md)

### 管理後台

- [管理後台開發起點](admin/backend-development.md)
- [Razor 與 Tabler 管理後台介面](admin/razor-admin-ui.md)

### 功能

- [文物資料匯入](features/catalog-import.md)
- [資料與圖片使用說明](features/data-and-media.md)
- [經濟與進程基準](features/economy-progression.md)
- [Identity 與登入](features/identity-and-login.md)
- [地點與地圖串接說明](features/map-integration.md)

### 參考

- [文件閱讀與名詞基準](reference/terminology.md)
- [REST API 契約](reference/rest-api.md)
- [API 名詞表](reference/api-glossary.md)
- [CRUD 與 Scaffold](reference/crud-and-scaffolding.md)
- [QMAH 資料工具參考](reference/data-tools.md)
- [Git 與 GitHub 協作手冊](reference/git-workflow.md)
- [官方參考索引](reference/official-references.md)

## 文件分工

檔案依要解決的問題命名，不依歷史文件編號命名。系統文件在開頭說明負責與不負責的範圍；跨系統名詞與標題規則集中在[文件閱讀與名詞基準](reference/terminology.md)。

跨系統內容只保留一個正規來源，其他頁面用連結引用。

| 文件目的 | 正規文件 | 判斷方式 |
| --- | --- | --- |
| Tutorial（教學） | 開發環境、開發資料、CRUD 與 Scaffold | 需要依順序完成一項基礎工作 |
| How-to（操作） | Angular、管理後台、文物匯入、媒體、地圖、資料工具 | 已有明確目標，需要命令與檢查點 |
| Reference（參考） | REST API、API 名詞、Git 協作 | 需要精確欄位、狀態、權限或流程規則 |
| Explanation（說明） | 系統架構、Area 界線、資料存取、資料庫 Diagram、資料表參考、經濟與進程 | 需要先理解責任、關係與設計理由 |

## Repo 與文件站

- Repository 內的 Markdown 是可 review、可 clone、可與程式變更一起提交的原始文件。
- VitePress 直接讀取這些 Markdown，提供側欄、全文搜尋與瀏覽器網址。
- `.vitepress/dist` 是建置產物，不回存成第二份文件；內容變更以 Markdown 的 Git 歷史為準。
- 版面方向與元件限制記錄在 [`DESIGN.md`](DESIGN.md)；產品與文件站定位記錄在 [`PRODUCT.md`](PRODUCT.md)。
- 文件站圖表的 Diagram IR、draw.io 編輯檔、SVG 產物與重新產出方式記錄在 [`diagrams/README.md`](diagrams/README.md)。

## 其他入口

- [QMAH GitHub](https://github.com/MSIT173-03/QMAH)
- [QMAH-Docs GitHub](https://github.com/MSIT173-03/QMAH-Docs)
- [QMAH-Database GitHub](https://github.com/MSIT173-03/QMAH-Database)
- [QMAH-Docs 文件站](https://msit173-03.github.io/QMAH-Docs/)

文件內容若與產品程式、`Schema.sql` 或 API 執行結果不一致，應核對可驗證的程式與資料庫契約，並在同一個變更中修正文檔。
