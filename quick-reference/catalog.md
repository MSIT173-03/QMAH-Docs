# Catalog｜圖鑑與文物

圖鑑保存文物內容、分類、年代與圖片來源。遊戲用這些文物出題，商城可將商品連到同一件文物，會員則透過鑰匙取得解鎖紀錄。下方先說明資料如何共用，再說明一次解鎖會改哪些資料。

## 系統範圍

Catalog 負責文物主資料、分類、年代、來源與授權資訊，也提供題庫、解鎖、鑰匙規則與商品對應使用的文物識別。跨系統關聯一律以資料庫鍵與 API 契約為準；文物名稱、圖片檔名與顯示文字不是關聯鍵。

## 文物如何進入其他功能

1. 管理後台建立或匯入文物，保存分類、年代、來源、授權與邏輯圖片路徑。
2. 清單和詳細頁讀取文物資料，媒體解析器在輸出時把邏輯路徑轉成本機或 CDN 網址。
3. Game 以 `ArtifactId` 連接題庫與 Mini Game 素材；Store 也以 `ArtifactId` 連接商品。文物名稱和圖片檔名只供顯示，不能當成關聯鍵。

## 鑰匙如何解鎖文物

1. 前台使用會員經濟 API 回傳的 `keyCode`。分類與年代範圍由該鑰匙定義的 `CategoryId`、`EraBucketId` 決定，請求不另傳範圍；只有 `UNIVERSAL` 可以指定 `ArtifactId`。
2. 服務從啟用且會員尚未解鎖的文物建立候選。`NORMAL`、`CATEGORY` 與 `ERA` 的最終結果由伺服器抽選。
3. 有候選時，服務在同一流程扣除鑰匙餘額、建立 `KeyTransaction` 並新增 `ArtifactUnlock`。
4. 沒有候選時不扣鑰匙，也不建立解鎖紀錄。前台應顯示沒有可解鎖文物，而不是一般伺服器錯誤。

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
