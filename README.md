# QMAH 開發文件

[QMAH 專案](https://github.com/MSIT173-03/QMAH) ｜ [開發文件](https://msit173-03.github.io/QMAH-Docs/) ｜ [開發資料庫](https://github.com/MSIT173-03/QMAH-Database)

這是 QMAH 的正式開發文件來源，也是部署到 GitHub Pages 的 VitePress 文件站。文件以「易懂但不失專業」為原則，保留可操作的命令、資料契約與程式邊界；產品程式、文件與完整資料庫 Snapshot 分別由三個 Repository 管理。

## 依工作開始

| 你現在要做的事 | 從這裡開始 |
| --- | --- |
| 第一次加入專案 | [開發環境與啟動](getting-started/development-environment.md) → [開發資料](getting-started/development-data.md) |
| 開始 Angular 使用者前台 | [Angular 前端開發指南](frontend/angular-development.md) → [REST API 契約](reference/rest-api.md) |
| 開始 ASP.NET Core API | [系統架構總覽](architecture/system-overview.md) → [資料存取與 DB-first](architecture/data-access.md) |
| 開始 Razor 管理後台 | [管理後台開發起點](admin/backend-development.md) → [Razor 與 Tabler 介面](admin/razor-admin-ui.md) |
| 調整資料庫或產生 Snapshot | [資料工具參考](reference/data-tools.md) → [QMAH-Database](https://github.com/MSIT173-03/QMAH-Database) |

## 文件目錄

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
- [資料與圖片使用](./features/data-and-media.md)
- [經濟與進程](./features/economy-progression.md)
- [Identity 與登入](features/identity-and-login.md)
- [地點與地圖串接](features/map-integration.md)

### 參考

- [REST API 契約](reference/rest-api.md)
- [API 名詞表](reference/api-glossary.md)
- [CRUD 與 Scaffold](reference/crud-and-scaffolding.md)
- [資料工具](reference/data-tools.md)
- [Git 與 GitHub 協作](./reference/git-workflow.md)

## 文件責任分配

文件不以目錄名稱硬套類型；每份文件有主要閱讀目的，跨類型內容只在必要處互相連結。

| 文件目的 | 主要文件 | 適合的閱讀方式 |
| --- | --- | --- |
| Tutorial（教學） | 開發環境、開發資料、CRUD 與 Scaffold | 跟著步驟完成第一次環境或功能 |
| How-to（操作） | Angular、管理後台、文物匯入、媒體、地圖、資料工具 | 已知道目標，查命令與檢查點 |
| Reference（參考） | REST API、API 名詞、Git 協作 | 需要精確欄位、狀態或規則時查閱 |
| Explanation（說明） | 系統架構、Area 界線、資料存取、資料庫 Diagram、經濟與進程 | 先理解設計理由，再進行修改 |

## 其他入口

- [QMAH GitHub](https://github.com/MSIT173-03/QMAH)
- [QMAH-Database GitHub](https://github.com/MSIT173-03/QMAH-Database)
- [QMAH-Docs GitHub](https://github.com/MSIT173-03/QMAH-Docs)
- [QMAH-Docs 文件站](https://msit173-03.github.io/QMAH-Docs/)

文件內容若與產品程式、`Schema.sql` 或 API 執行結果不一致，先以可驗證的程式與資料庫契約為準，再在同一個變更中修正文檔。
