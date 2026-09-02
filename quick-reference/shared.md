# Shared｜共用基礎

本頁固定依「系統範圍 → 資料表與關聯 → 開發規則與跨系統界線 → 查詢入口 → 變更前檢查 → 建議查閱順序」排列。詳細欄位、狀態與操作規則以連結的正規文件為準。

## 系統範圍

Shared 不是資料庫中的獨立 Schema，也不是第六個產品 Area；它整理五個功能系統共同使用的環境、Identity、資料存取、API、媒體、Snapshot、資料工具、協作與跨系統界線。共同規則只在有實際程式、Schema 或工具依據時列出。

## 資料表與關聯

| 資料表或資料群 | 在此入口的用途 | 主要關聯／限制 |
| --- | --- | --- |
| `user.AspNetUsers` 及 Identity 附屬表 | 所有需要會員身分的流程共用的登入主體 | Identity 表由 Identity API 管理；其他系統以目前登入者或明確外鍵引用 |
| `common.DailyMemberActivities` | 每日會員活動與登入歷史 | 連到 `user.AspNetUsers`；每位會員每天最多一列，統計由歷史資料計算 |
| `catalog.Artifacts` | 五個功能系統共同辨識文物的主資料 | Game 題庫／回合、Store 商品、Social 貼文以 `ArtifactId` 引用；Catalog 主責來源與授權 |
| `admin.AuditLogs` | 管理操作的時間、操作者、目標與結果 | 連管理操作者；不保存密碼、Cookie、Token 或完整 request body |
| `admin.EconomyAdjustmentBatches`、`admin.CommunityRewardCampaigns` | 批次資產與活動／房間獎勵的跨系統規則 | 可能連到 User、Store、Catalog、Game 或 Social；變更前要核對交易與稽核 |
| `social.MediaAssets` | 社群媒體檔案的中繼資料 | 連貼文與擁有者；實際網址依 Local／物件儲存／CDN Resolver 決定 |
| `store.PointBalances`、`store.PointTransactions`、`catalog.UserKeyBalances`、`catalog.KeyTransactions` | 會員資產與異動流水的共用查詢邊界 | 各 Area 依主責流程寫入；查帳以流水與 Schema 為準 |
| `game.GameEconomySettings`、`game.GameModeDefinitions` | 遊戲與 Mini Game 使用的數值與模式契約 | 由 Game 流程使用；獎勵可能再連到會員資產或活動規則 |
| `store.Products`、`game.ArtifactQuestionEntries` | 文物主資料在商品與題庫中的跨 Schema 對應 | 都以 `ArtifactId` 連到 Catalog；商品與題庫欄位不回寫文物主資料 |

## 開發規則與跨系統界線

- 主責資料：五個功能系統各自負責自己的主資料；Shared 只整理共同契約，不新增一個虛構的共用資料層。
- 可被引用：跨系統使用明確 API、外鍵或目前登入身分；共同識別鍵、狀態碼與媒體邏輯路徑需以正規文件為準。
- 不得直接修改：Angular 不直接讀 Entity 或 SQL Server；其他 Area 不繞過主責流程改寫 Identity、訂單、文物、內容審核或遊戲歷史。
- 跨表流程：涉及兩張以上資料表、外部服務、重複請求或資產結算時，說明 Service、scoped `QmahDbContext`、交易與失敗回復。
- 前台／後台：前台透過 `/api/v1` DTO；Razor 後台依 Area、Controller、ViewModel、共用 Layout 與實際授權處理。
- 歷史資料：Snapshot 是共同基準；網站啟動不建表、不跑 Migration、不自動執行 Patch 或 Seed，也不覆寫本機資料。

## 查詢入口

| 查詢目的 | 文件入口 | 這一頁要核對的內容 |
| --- | --- | --- |
| 確認系統責任與跨系統界線 | [Area 責任與資料界線](../architecture/area-boundaries.md) | 誰負責修改資料、哪些系統只能引用 |
| 查資料表、主鍵與外鍵 | [資料表參考](../architecture/database-reference.md) | 表格用途、主鍵、外鍵與跨 Schema 關係 |
| 查資料讀寫、交易與併發 | [資料存取與 DB-first](../architecture/data-access.md) | `QmahDbContext`、投影、追蹤、交易與並行控制 |
| 查 API 路徑、DTO 與狀態 | [REST API 契約](../reference/rest-api.md) | 路徑、DTO、驗證、狀態碼與錯誤回應 |
| 查 Angular 前台串接 | [Angular 使用者前台開發](../frontend/angular-development.md) | Route、HttpClient、Cookie、防偽與載入／錯誤狀態 |
| 查 Razor 後台串接 | [管理後台開發起點](../admin/backend-development.md) | Area、Controller、ViewModel、授權與表單處理 |
| 查功能規則與操作流程 | [官方參考索引](../reference/official-references.md)、[Git 與 GitHub 協作](../reference/git-workflow.md) | 本頁範圍內的狀態、輸入、流程與歷史資料規則 |
| 查來源、媒體與外部服務 | [資料與圖片使用](../features/data-and-media.md)、[媒體交付設定](../frontend/media-delivery.md)、[地點與地圖串接](../features/map-integration.md) | 來源、授權、邏輯媒體路徑與外部服務界線 |
| 查本機資料與展示狀態 | [開發資料與本機展示](../getting-started/development-data.md) | Snapshot 已提供什麼，隔離資料如何建立 |
| 查資料工具與 Snapshot | [資料工具](../reference/data-tools.md) | Seed、展示資料、匯出、版本與檔案位置 |
| 查交付與協作規則 | [Git 與 GitHub 協作](../reference/git-workflow.md) | 分支、提交、共用檔案、Review 與交付順序 |

## 變更前檢查

- 本機環境是否使用相容的 .NET、Node.js、SQL Server 與 Angular 工具版本，且 API、Web 指向同一個 `QMAH` 資料庫。
- Schema、Entity、`QmahDbContext`、DTO、OpenAPI、文件與 QMAH-Database Snapshot 是否來自同一個可驗證基準。
- 跨系統寫入是否有明確主責、交易、冪等、併發、失敗回復、稽核與歷史保留方式。
- 文件、工具輸出、Snapshot、媒體檔與本機憑證是否放在正確 Repository 或未提交的本機位置。

## 建議查閱順序

1. [開發環境與啟動](../getting-started/development-environment.md)：確認工具、服務與連線基線。
2. [開發資料與本機展示](../getting-started/development-data.md)：確認 Snapshot、資料量與展示狀態。
3. [系統架構總覽](../architecture/system-overview.md)、[Area 責任與資料界線](../architecture/area-boundaries.md)：確認三個 Repository 與五個功能系統的界線。
4. [資料表參考](../architecture/database-reference.md)、[資料存取與 DB-first](../architecture/data-access.md)：確認資料表、欄位與讀寫方式。
5. [REST API 契約](../reference/rest-api.md)、[API 名詞表](../reference/api-glossary.md)：確認 HTTP、DTO、狀態與錯誤用語。
6. [媒體交付設定](../frontend/media-delivery.md)、[資料工具](../reference/data-tools.md)：依工作目標查外部服務與 Snapshot 工具。
7. [Angular 使用者前台開發](../frontend/angular-development.md)、[管理後台開發起點](../admin/backend-development.md)：確認兩個 UI 入口的串接界線。
8. [Git 與 GitHub 協作](../reference/git-workflow.md)、[官方參考索引](../reference/official-references.md)：完成文件與程式的交付核對。
