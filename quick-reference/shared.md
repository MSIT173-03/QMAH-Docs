# Shared｜共用基礎與跨系統資料

本頁是六個系統共同使用的基礎查詢頁，集中 API、DB-first、資料存取、登入、媒體、Snapshot、協作與文件規則。這些內容跨越 Catalog、Game、Social、User 與 Store，不歸入單一 Area。

## 共用範圍

| 共用主題 | 正規文件 | 主要契約 |
| --- | --- | --- |
| 啟動、版本與服務 | [開發環境與啟動](../getting-started/development-environment.md) | .NET、Node.js、SQL Server、連線與啟動設定 |
| 共同資料與狀態 | [開發資料與本機展示](../getting-started/development-data.md) | Snapshot 內容、關聯與狀態值 |
| 系統流向與 Repository | [系統架構總覽](../architecture/system-overview.md) | QMAH、QMAH-Docs、QMAH-Database 的責任 |
| 跨 Area 邊界 | [Area 責任與資料界線](../architecture/area-boundaries.md) | 主責資料、只讀引用與跨表寫入 |
| EF Core 與 DB-first | [資料存取與 DB-first](../architecture/data-access.md) | Schema、Entity、`QmahDbContext`、交易與查詢 |
| HTTP 與驗證 | [REST API 契約](../reference/rest-api.md) | DTO、OpenAPI、Cookie、CORS、錯誤與狀態碼 |
| 媒體網址 | [媒體交付設定](../frontend/media-delivery.md) | 邏輯路徑、Local、物件儲存與 CDN |
| Snapshot 與資料工具 | [資料工具](../reference/data-tools.md) | 展示資料、Release pipeline、輸出路徑與檢查 |
| Git 變更與交付 | [Git 與 GitHub 協作](../reference/git-workflow.md) | 分支、PR、共用檔案、Schema 與版本歷史 |
| 官方規格與工具文件 | [官方參考索引](../reference/official-references.md) | .NET、SQL Server、Angular、OpenAPI、VitePress、GitHub 與授權來源 |

## 跨系統查詢索引

| 出現的問題 | 先查哪裡 | 再核對哪裡 |
| --- | --- | --- |
| API 回應欄位不清楚 | [REST API 契約](../reference/rest-api.md) | [API 名詞表](../reference/api-glossary.md)、DTO 與 OpenAPI |
| 查詢或寫入資料表 | [資料存取與 DB-first](../architecture/data-access.md) | [資料庫 Diagram 對照](../architecture/database-diagram.md)、`Schema.sql` |
| 登入後讀不到私人資料 | [Identity 與登入](../features/identity-and-login.md) | REST API 的 Cookie、`credentials` 與 User 邊界 |
| 圖片網址在不同環境不同 | [媒體交付設定](../frontend/media-delivery.md) | Catalog／Social 的授權與邏輯路徑 |
| 本機資料與其他環境不同 | [開發資料與本機展示](../getting-started/development-data.md) | [QMAH-Database](https://github.com/MSIT173-03/QMAH-Database) 的 tag 與 manifest |
| Schema 變更影響多個系統 | [Git 與 GitHub 協作](../reference/git-workflow.md) | Entity、`QmahDbContext`、API、文件與 Snapshot |
| 需要重建展示資料或 Snapshot | [資料工具](../reference/data-tools.md) | [QmahDatabaseRelease 工具說明](https://github.com/MSIT173-03/QMAH/blob/main/tools/QmahDataTools/QmahDatabaseRelease/README.md) |

## 不可跨越的共用邊界

- Angular 使用 API DTO，不直接讀取 Entity 或 SQL Server 資料表。
- Razor 管理後台依 Area 與共用 Layout 開發，授權由 Controller 或 Action 實際執行。
- Schema 是 DB-first 結構契約；完整可還原資料只在 QMAH-Database 維護。
- 網站啟動不建立資料庫、不執行 Migration，也不自動補跑 Patch 或 Seed。
- 跨表寫入需說明交易範圍、失敗回復與歷史資料保留方式。
- 文件站與 Repository 使用同一批 Markdown；建置輸出不成為第二份內容來源。

## 共用基線的循序閱讀

1. [開發環境與啟動](../getting-started/development-environment.md)
2. [開發資料與本機展示](../getting-started/development-data.md)
3. [系統架構總覽](../architecture/system-overview.md)
4. [資料存取與 DB-first](../architecture/data-access.md)
5. [REST API 契約](../reference/rest-api.md)
6. [Git 與 GitHub 協作](../reference/git-workflow.md)
