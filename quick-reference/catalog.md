# Catalog｜圖鑑與文物

圖鑑保存文物內容、分類、年代與圖片來源。遊戲用這些文物出題，商城可將商品連到同一件文物，會員則透過鑰匙取得解鎖紀錄。下方先說明資料如何共用，再說明一次解鎖會改哪些資料。

## 系統範圍

前端串接請先讀 [圖鑑與鑰匙背包串接](../frontend/catalog-unlock-integration.md)，包含選鑰匙、指定／隨機解鎖及列表更新流程。

Catalog 負責文物主資料、分類、年代、來源與授權資訊，也提供題庫、解鎖、鑰匙規則與商品對應使用的文物識別。跨系統關聯一律以資料庫鍵與 API 契約為準；文物名稱、圖片檔名與顯示文字不是關聯鍵。

目前 `db-v0.10.0` 基準有 512 件文物、18 個年代桶與 512 筆題庫；商城對應 512 件文物明信片。新增的 `JAPAN_EDO` 年代有對應的 `KEY-ERA-JAPAN_EDO` 鑰匙，並納入會員餘額與流水；`catalog.ArtifactUnlocks` 也保留可沿 `KeyTransactionId` 查帳的展示解鎖紀錄。詳情頁的文物可從已解鎖內容進入「文物討論」；沒有貼文時，前台會先詢問會員並要求留下第一則留言，才建立該文物的 canonical 討論入口。

圖鑑與社群負責人仍需持續確認這個最小流程是否要演進成主題列表、分支討論或更完整的討論引導；目前請以[社群快速參考](social.md)的 TODO 為準。

## 文物如何進入其他功能

1. 管理後台建立或匯入文物，保存分類、年代、來源、授權與邏輯圖片路徑。
2. 清單和詳細頁讀取文物資料，媒體解析器在輸出時把邏輯路徑轉成本機或 CDN 網址。
3. Game 以 `ArtifactId` 連接題庫與 Mini Game 素材；Store 也以 `ArtifactId` 連接商品。文物名稱和圖片檔名只供顯示，不能當成關聯鍵。

文物停用由具授權的 POST 表單執行，保留 antiforgery 驗證，僅將 `IsActive` 設為 false 並保存；既有題庫、解鎖及其他歷史參照保留。

目前資料庫快照使用 `KEY-NORMAL` 作為一般鑰匙代碼；服務同時相容 `NORMAL`，若兩者皆啟用則優先採用 `NORMAL`。新增、編輯與切換啟用都限制同時最多一把一般鑰匙啟用；停用定義不刪除 `UserKeyBalances`、`KeyTransactions` 或其他參照。前台沿用 API 回傳的實際 keyCode（例如 `KEY-NORMAL`、`KEY-CATEGORY-JADE`、`KEY-ERA-MING`），不要自行把 scope type 拼成路徑值。

## 鑰匙如何解鎖文物

1. 前台使用會員經濟 API 回傳的 `keyCode`。分類與年代範圍由該鑰匙定義的 `CategoryId`、`EraBucketId` 決定，請求不另傳範圍；`CATEGORY`／`ERA` 可指定自身範圍內的 `ArtifactId`，`UNIVERSAL` 可指定任一候選文物。
2. 服務從啟用且會員尚未解鎖的文物建立候選。`NORMAL` 必須由伺服器抽選；其他可指定範圍的鑰匙省略目標時由伺服器在候選中抽選。
3. 有候選時，服務在同一流程扣除鑰匙餘額、建立 `KeyTransaction` 並新增 `ArtifactUnlock`。
4. 沒有候選時不扣鑰匙，也不建立解鎖紀錄。前台應顯示沒有可解鎖文物，而不是一般伺服器錯誤。

## 會員圖鑑 API

會員圖鑑畫面需要使用登入後的清單 API，讓後端一次完成「文物是否已解鎖」的判斷：

| Method | Path | 用途 |
| --- | --- | --- |
| `GET` | `/api/v1/me/catalog/artifacts` | 取得啟用文物分頁，附 `isUnlocked`、`unlockedAt`、分類／年代識別與圖片網址 |
| `GET` | `/api/v1/me/catalog/unlocks` | 取得目前會員的解鎖歷史，依 `unlockedAt` 最新優先；鑰匙來源直接附 `keyCode`／`keyName` |
| `GET` | `/api/v1/me/economy` | 取得鑰匙餘額與每種鑰匙的 `eligibleArtifactCount` |
| `POST` | `/api/v1/me/keys/{keyCode}/unlock` | 使用一把鑰匙；`CATEGORY`／`ERA` 可傳自身範圍內的 `artifactId`，`NORMAL` 不可傳，`UNIVERSAL` 可傳任一候選文物 |
| `POST` | `/api/v1/admin/catalog/members/{userId}/artifacts/{artifactId}/unlock` | Admin 強制解鎖一件文物，來源為 `ADMIN`，重複呼叫冪等 |

兩支清單 API 都支援 `q`、`categoryCode`、`eraCode`、`page` 與 `pageSize`。會員識別只來自登入 Cookie，不能由 query string 傳入 `userId`。圖片路徑已由 API 的媒體解析器轉成可交付網址，前台不應自行拼接磁碟路徑。

### 一次解鎖的前台流程

```text
GET /me/catalog/artifacts + GET /me/economy
        ↓
依 keyCode、scopeType、categoryId、eraBucketId 顯示可用鑰匙
        ↓
POST /me/keys/{keyCode}/unlock
        ├─ CATEGORY／ERA：可送 { "artifactId": "<自身範圍內文物 GUID>" }
        ├─ UNIVERSAL：{ "artifactId": "<文物 GUID>" }
        └─ NORMAL：{ "artifactId": null }
        ↓
若 unlocked=true，重新讀取圖鑑、經濟摘要與解鎖歷史
若 unlocked=false，不扣鑰匙，顯示 message
```

`NORMAL` 從全部未解鎖文物抽選，`CATEGORY` 與 `ERA` 由鑰匙定義的 `CategoryId` 或 `EraBucketId` 限定範圍，可由會員選範圍內單一文物或交給伺服器抽選，`UNIVERSAL` 可指定任一單一文物。請求成功但 `unlocked=false` 不是錯誤，而是該範圍已沒有候選。

多人主遊戲領獎成功時，結算回合的文物會自動寫入 `GAME` 解鎖紀錄；已存在的會員解鎖不會被覆蓋。管理員強制解鎖則寫入 `ADMIN`，並在 `admin.AuditLogs` 保存操作人與目標路徑。

### 單一會員的保存方式

- `catalog.ArtifactUnlocks` 是會員與文物的解鎖事實，一件文物對同一會員只能有一筆；保存 `UnlockMethod`、`UnlockedAt`、`KeyTransactionId` 與可選的 `GameRoundId`。`UnlockMethod` 只記錄來源 `KEY`、`GAME` 或 `ADMIN`；資料庫查帳仍沿著 `KeyTransactionId` 查 `KeyDefinitions.Code`，API 歷史回應則直接附 `keyCode`／`keyName`，不能把每個鑰匙代碼直接寫進 `UnlockMethod`。管理員操作者則沿著同一操作時間與 `admin.AuditLogs` 查詢。
- `catalog.UserKeyBalances` 是目前背包快照，依 `UserId + KeyDefinitionId` 保存餘額，供畫面快速顯示。
- `catalog.KeyTransactions` 是鑰匙異動流水。解鎖成功會在同一筆資料庫交易內新增 `Amount = -1`、`Reason = ARTIFACT_UNLOCK` 的負數流水並回寫 `ArtifactUnlocks.KeyTransactionId`；管理員人工調整才填入 `CreatedByAdminUserId`。
- `GET /api/v1/me/catalog/artifacts` 每次依登入會員即時標記狀態；`GET /api/v1/me/catalog/unlocks` 直接查該會員的歷史，因此前端不需要自行保存解鎖紀錄作為真相。

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

| 要完成的工作 | 直接查閱 |
| --- | --- |
| 上傳文物並確認題庫或商品關聯 | [文物資料匯入](../features/catalog-import.md) |
| 串接解鎖請求與回應 | [顯示圖鑑並使用鑰匙](../reference/rest-api.md#顯示圖鑑並使用鑰匙) |
| 管理員補發鑰匙並查流水 | [增加鑰匙的實際呼叫](../architecture/runtime-and-shared-services.md#管理員增加三把鑰匙的實際呼叫) |
| 確認兌換、回收與可調數值 | [經濟與進程基準](../features/economy-progression.md) |
| 修正圖片或切換 CDN | [媒體交付設定](../frontend/media-delivery.md) |
| 核對欄位與關聯 | [資料表參考](../architecture/database-reference.md) |

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
