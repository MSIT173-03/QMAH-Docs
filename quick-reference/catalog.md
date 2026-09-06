# Catalog｜圖鑑與文物

快速定位工作可先看下表，再閱讀實際流程與資料表。

## 快速查閱

| 查閱目的 | 入口 |
| --- | --- |
| 先理解怎麼運作 | [文物、鑰匙候選、解鎖及來源流水](../getting-started/system-walkthrough.md#圖鑑：文物如何變成會員的解鎖收藏) |
| 查資產增減與管理員 | [加鑰匙實例與查帳](../getting-started/system-walkthrough.md#第三步：看一次加鑰匙的完整例子) |
| 查請求如何進入服務 | [啟動與共用元件](../architecture/runtime-and-shared-services.md) |

## 系統範圍

Catalog 負責文物主資料、分類、年代、來源與授權資訊，也提供題庫、解鎖、鑰匙規則與商品對應使用的文物識別。跨系統關聯一律以資料庫鍵與 API 契約為準；文物名稱、圖片檔名與顯示文字不是關聯鍵。

## 實際運作方式

管理後台建立或匯入文物後，資料先保存分類、年代、來源與邏輯圖片路徑；顯示時才由媒體 resolver 轉成本機或 CDN 網址。Game 透過 `ArtifactId` 建立題庫與 Mini Game 素材，Store 以同一識別連結商品。會員使用鑰匙時，Service 依鑰匙類型在啟用且尚未解鎖的文物中選候選；只有萬能鑰匙接受指定文物，成功後才同時扣餘額、寫鑰匙流水並建立解鎖紀錄。

## 資料表與關聯

| 資料表或資料群 | 在此入口的用途 | 主要關聯／限制 |
| --- | --- | --- |
| `catalog.Artifacts` | 文物主資料、尺寸、來源、授權與邏輯媒體路徑 | `CategoryId`、`EraBucketId` 連到同一 Schema 的分類與年代；`Id` 是其他系統使用的文物識別 |
| `catalog.ArtifactCategories`、`catalog.EraBuckets` | 文物分類與年代區間 | `Artifacts`、`KeyDefinitions` 以外鍵引用；代碼需維持唯一 |
| `game.ArtifactQuestionEntries` | 文物的題型、難度與可出題狀態 | `ArtifactId` 連到 `catalog.Artifacts`，並由唯一索引維持一件文物一筆題庫設定 |
| `catalog.KeyDefinitions`、`catalog.KeyExchangeRules` | 鑰匙類型、作用範圍與兌換規則 | 規則的來源與目標都回到 `KeyDefinitions`；金額與啟用狀態受 Schema 限制 |
| `catalog.UserKeyBalances`、`catalog.KeyTransactions` | 會員鑰匙餘額與異動流水 | 餘額以會員與鑰匙類型組合識別；查帳以流水為依據，不把顯示值當成交易紀錄 |
| `catalog.KeyProgressBalances`、`catalog.KeyProgressTransactions` | Mini Game 產生的鑰匙進度與轉換流水 | 進度資料以 `UserId` 連到 User；與一般鑰匙分開保存 |
| `catalog.ArtifactUnlocks` | 會員解鎖文物的結果與來源 | 連到文物、鑰匙交易、會員與遊戲回合；解鎖結果是歷史資料 |
| `store.Products` | 文物衍生商品的對應入口 | `ArtifactId` 可為空但有唯一限制；商品名稱、尺寸、售價、庫存與狀態獨立保存 |

## 開發規則與跨系統界線

- 主責資料：Catalog 主責文物、分類、年代、來源、授權、題庫關聯所需的文物識別與鑰匙規則。
- 可被引用：Game 可讀取可出題文物，Store 可建立文物對應商品，Social 可用 `ArtifactId` 建立貼文關聯。
- 不得直接修改：其他 Area 不直接改寫 Catalog 的來源、授權、文物主資料或鑰匙定義；需要跨表更新時建立明確流程。
- 跨表流程：解鎖、鑰匙兌換與遊戲獎勵會同時涉及會員、流水或回合，應在 Service 層說明交易範圍與失敗處理。
- 前台／後台：Angular 只使用 API DTO；Catalog 後台在 `QMAH.Web/Areas/Catalog` 依實際授權處理新增、編輯與匯入。
- 歷史資料：已建立的解鎖、鑰匙流水、訂單、回合與貼文不因文物或商品下架而刪除。

## 查詢入口

| 查詢目的 | 文件入口 | 這一頁要核對的內容 |
| --- | --- | --- |
| 確認系統責任與跨系統界線 | [Area 責任與資料界線](../architecture/area-boundaries.md) | 誰負責修改資料、哪些系統只能引用 |
| 查資料表、主鍵與外鍵 | [資料表參考](../architecture/database-reference.md) | 表格用途、主鍵、外鍵與跨 Schema 關係 |
| 查資料讀寫、交易與併發 | [資料存取與 DB-first](../architecture/data-access.md) | `QmahDbContext`、投影、追蹤、交易與並行控制 |
| 查 API 路徑、DTO 與狀態 | [REST API 契約](../reference/rest-api.md) | 路徑、DTO、驗證、狀態碼與錯誤回應 |
| 查 Angular 前台串接 | [Angular 使用者前台開發](../frontend/angular-development.md) | Route、HttpClient、Cookie、防偽與載入／錯誤狀態 |
| 查 Razor 後台串接 | [管理後台開發起點](../admin/backend-development.md) | Area、Controller、ViewModel、授權與表單處理 |
| 查功能規則與操作流程 | [文物資料匯入](../features/catalog-import.md)、[資料與圖片使用](../features/data-and-media.md) | 本頁範圍內的狀態、輸入、流程與歷史資料規則 |
| 查來源、媒體與外部服務 | [資料與圖片使用](../features/data-and-media.md)、[媒體交付設定](../frontend/media-delivery.md)、[地點與地圖串接](../features/map-integration.md) | 來源、授權、邏輯媒體路徑與外部服務界線 |
| 查本機資料與展示狀態 | [開發資料與本機展示](../getting-started/development-data.md) | Snapshot 已提供什麼，隔離資料如何建立 |
| 查資料工具與 Snapshot | [資料工具](../reference/data-tools.md) | Seed、展示資料、匯出、版本與檔案位置 |
| 查交付與協作規則 | [Git 與 GitHub 協作](../reference/git-workflow.md) | 分支、提交、共用檔案、Review 與交付順序 |

## 前台接手建議

- 第一條流程先完成文物清單、篩選與詳細頁，分類和年代選項由 `/metadata` 或對應 Catalog API 取得。
- 路由只保存文物 ID 與查詢條件；詳細頁重新查詢，不依賴上一頁留在記憶體中的完整物件。
- 圖片直接使用 API 回傳網址，並同時顯示來源與授權文字；圖片失敗不能讓文物文字內容一起消失。
- 鑰匙解鎖結果要區分「成功解鎖」與「沒有候選且未扣鑰匙」，兩者都不是一般伺服器錯誤。
- 建議的共用元件與頁面狀態見[前台功能接手指南](../frontend/feature-development-guide.md)。

## 變更前檢查

- `ArtifactId`、分類、年代、題庫、解鎖與商品引用是否仍然一致，且沒有把名稱或圖片檔名當成鍵。
- 原始來源文字、授權代碼、`AttributionText` 與來源網址是否保留；媒體路徑是否交給 Resolver 處理。
- 清單、詳細頁、空資料、查無資料、匯入錯誤、重複資料與停用狀態是否有明確結果。
- Schema、Entity、`QmahDbContext`、API DTO、管理後台、前台與文件是否同步；跨表寫入是否說明交易與歷史保留。

## 建議查閱順序

1. [Shared｜共用基礎](shared.md)：先讀共同規則與跨系統入口。
2. [開發環境與啟動](../getting-started/development-environment.md)：確認工具、服務與連線基線。
3. [開發資料與本機展示](../getting-started/development-data.md)：確認 Snapshot、資料量與展示狀態。
4. [系統架構總覽](../architecture/system-overview.md)、[Area 責任與資料界線](../architecture/area-boundaries.md)：確認 Catalog 的責任與引用界線。
5. [資料表參考](../architecture/database-reference.md)、[資料存取與 DB-first](../architecture/data-access.md)：確認資料表、欄位與讀寫方式。
6. [文物資料匯入](../features/catalog-import.md)、[資料與圖片使用](../features/data-and-media.md)：依工作目標查操作規則。
7. [REST API 契約](../reference/rest-api.md)、[Angular 使用者前台開發](../frontend/angular-development.md)、[管理後台開發起點](../admin/backend-development.md)：確認對外與畫面串接。
8. [資料工具](../reference/data-tools.md)、[Git 與 GitHub 協作](../reference/git-workflow.md)：完成資料驗證與交付。
