# QMAH 開發文件

[QMAH 專案](https://github.com/MSIT173-03/QMAH) ｜ [QMAH-Docs 專案](https://github.com/MSIT173-03/QMAH-Docs) ｜ [QMAH-Database 專案](https://github.com/MSIT173-03/QMAH-Database) ｜ [QMAH-Docs 文件站](https://msit173-03.github.io/QMAH-Docs/)

這個 Repository 同時是 QMAH 的文件來源與 GitHub Pages 的 VitePress 建置來源。Markdown 保留在 Repository 中供檢視、版本追蹤與離線閱讀；文件站直接使用這批檔案，不另維護網站副本。

## 文件閱讀順序

文件先確認環境與共同資料，再確認系統邊界，最後查系統文件、契約與交付規則。首頁提供索引；下列清單列出建議順序：

1. [開發環境與啟動](getting-started/development-environment.md) 建立工具、服務與連線基線。
2. [開發資料與本機展示](getting-started/development-data.md) 確認共同 Snapshot 的內容、關係與狀態。
3. [系統架構總覽](architecture/system-overview.md) 了解三個 Repository、網站、API、前端與資料庫的邊界。
4. 依功能範圍開啟 [六系統快速查詢索引](index.md#system-index)，再進入該頁列出的詳細文件。
5. 需要精確欄位、HTTP 行為、工具參數或交付規則時，回到 [參考文件](reference/rest-api.md) 分類查詢。

## 六系統快速查詢

六頁快速查詢各自列出系統需要的入口、契約、資料、畫面與檢查點。詳細規則以連結的文件為準。

| 系統 | 快速查詢頁 | 內容範圍 |
| --- | --- | --- |
| Catalog | [圖鑑與文物](quick-reference/catalog.md) | 文物、分類、年代、題庫設定、解鎖與匯入 |
| Game | [遊戲與作答](quick-reference/game.md) | 房間、回合、選題、作答、投票與獎勵 |
| Social | [社群與活動](quick-reference/social.md) | 貼文、留言、檢舉、活動、通知、地點與媒體 |
| User | [會員與 Identity](quick-reference/user.md) | 帳號、登入、個人資料、地址與會員資產 |
| Store | [商城與訂單](quick-reference/store.md) | 商品、購物車、折價券、訂單、付款與庫存 |
| Shared | [共用基礎](quick-reference/shared.md) | API、DB-first、資料存取、媒體、跨系統登入與協作 |

## 完整文件目錄

### 開始開發

- [開發環境與啟動](getting-started/development-environment.md)
- [開發資料與本機展示](getting-started/development-data.md)

### 架構

- [系統架構總覽](architecture/system-overview.md)
- [Area 責任與資料界線](architecture/area-boundaries.md)
- [資料存取與 DB-first](architecture/data-access.md)
- [資料庫 Diagram 對照](architecture/database-diagram.md)

### 前端

- [Angular 使用者前台開發](frontend/angular-development.md)
- [媒體交付設定](frontend/media-delivery.md)

### 管理後台

- [管理後台開發起點](admin/backend-development.md)
- [Razor 與 Tabler 介面](admin/razor-admin-ui.md)

### 功能

- [文物資料匯入](features/catalog-import.md)
- [資料與圖片使用](features/data-and-media.md)
- [經濟與進程](features/economy-progression.md)
- [Identity 與登入](features/identity-and-login.md)
- [地點與地圖串接](features/map-integration.md)

### 參考

- [REST API 契約](reference/rest-api.md)
- [API 名詞表](reference/api-glossary.md)
- [CRUD 與 Scaffold](reference/crud-and-scaffolding.md)
- [資料工具](reference/data-tools.md)
- [Git 與 GitHub 協作](reference/git-workflow.md)
- [官方參考索引](reference/official-references.md)

## 文件責任分配

檔案依要解決的問題命名，不依歷史文件編號命名。系統文件在開頭說明負責與不負責的範圍。

跨系統內容只保留一個正規來源，其他頁面用連結引用。

| 文件目的 | 正規文件 | 判斷方式 |
| --- | --- | --- |
| Tutorial（教學） | 開發環境、開發資料、CRUD 與 Scaffold | 需要依順序完成一項基礎工作 |
| How-to（操作） | Angular、管理後台、文物匯入、媒體、地圖、資料工具 | 已有明確目標，需要命令與檢查點 |
| Reference（參考） | REST API、API 名詞、Git 協作 | 需要精確欄位、狀態、權限或流程規則 |
| Explanation（說明） | 系統架構、Area 界線、資料存取、資料庫 Diagram、經濟與進程 | 需要先理解責任、關係與設計理由 |

## Repo 與文件站

- Repository 內的 Markdown 是可 review、可 clone、可與程式變更一起提交的原始文件。
- VitePress 直接讀取這些 Markdown，提供側欄、全文搜尋與瀏覽器網址。
- `.vitepress/dist` 是建置產物，不回存成第二份文件；內容變更以 Markdown 的 Git 歷史為準。
- 版面方向與元件限制記錄在 [`DESIGN.md`](DESIGN.md)；產品與文件站定位記錄在 [`PRODUCT.md`](PRODUCT.md)。

## 其他入口

- [QMAH GitHub](https://github.com/MSIT173-03/QMAH)
- [QMAH-Docs GitHub](https://github.com/MSIT173-03/QMAH-Docs)
- [QMAH-Database GitHub](https://github.com/MSIT173-03/QMAH-Database)
- [QMAH-Docs 文件站](https://msit173-03.github.io/QMAH-Docs/)

文件內容若與產品程式、`Schema.sql` 或 API 執行結果不一致，先核對可驗證的程式與資料庫契約，再在同一個變更中修正文檔。
