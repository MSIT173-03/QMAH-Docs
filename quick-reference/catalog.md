# Catalog｜圖鑑與文物系統

本頁列出 Catalog 的資料關係、API、管理後台、匯入與圖片授權入口。詳細欄位與規則以連結的文件為準，本頁不另維護一份說明。

## 範圍

Catalog 保存文物主資料、分類、年代、來源與授權資訊，也提供題庫設定、鑰匙範圍與商品對應所需的文物識別。文物以 `ArtifactId` 作為跨系統關聯鍵；名稱、圖片檔名與顯示文字不作為關聯依據。

## 查詢入口

| 查詢目的 | 正規文件 | 需要確認的內容 |
| --- | --- | --- |
| 了解資料責任與跨系統界線 | [Area 責任與資料界線](../architecture/area-boundaries.md) | 文物、題庫、解鎖與商品的修改邊界 |
| 查詢資料表與關聯 | [資料庫 Diagram 對照](../architecture/database-diagram.md) | `catalog`、`game`、`store` 的外鍵關係 |
| 讀取或修改資料 | [資料存取與 DB-first](../architecture/data-access.md) | `QmahDbContext`、投影、追蹤與交易 |
| 匯入文物資料 | [文物資料匯入](../features/catalog-import.md) | Preview、Import、來源欄位與失敗重試 |
| 確認來源與圖片使用 | [資料與圖片使用](../features/data-and-media.md) | 授權、來源網址、媒體路徑與商品圖片界線 |
| 查 API | [REST API 契約](../reference/rest-api.md) | 圖鑑、metadata、解鎖與管理端點 |
| 查本機展示內容 | [開發資料與本機展示](../getting-started/development-data.md) | 共同 Snapshot 已包含的文物與題庫資料 |

## 資料關係

| 資料 | 主要用途 | 關聯方式 |
| --- | --- | --- |
| `catalog.Artifacts` | 文物、年代、分類、來源、授權與媒體邏輯路徑 | `CategoryId`、`EraBucketId` |
| `catalog.ArtifactCategories`、`catalog.EraBuckets` | 分類與年代選項 | 由 `Artifacts` 引用 |
| `game.ArtifactQuestionEntries` | 題型、難度與可出題狀態 | `ArtifactId` |
| `catalog.ArtifactUnlocks`、`catalog.KeyDefinitions` | 解鎖結果與鑰匙範圍 | 文物、分類或年代規則 |
| `store.Products` | 文物衍生商品 | `ArtifactId`，商品欄位獨立保存 |

## 畫面與 API 的分工

- Razor 管理後台位於 `QMAH.Web/Areas/Catalog`；新增、編輯與匯入流程須遵守管理授權與資料來源規則。
- Angular 使用者前台只使用 API 回傳的 DTO 與 metadata，不直接依賴 Entity 或資料表欄位。
- API 的文物資料可供 Game、Store 與 Social 建立明確關聯；其他系統不直接改寫 Catalog 的來源、授權與主資料。
- 圖片只保存邏輯媒體路徑與授權資訊；實際網址解析依 [媒體交付設定](../frontend/media-delivery.md) 處理。

## 變更前檢查

- `ArtifactId`、分類、年代、題庫、解鎖與商品引用是否仍然一致。
- 原始來源文字、授權代碼、`AttributionText` 與來源網址是否保留。
- 清單、詳細頁、空資料、查無資料、匯入錯誤與重複資料是否有明確結果。
- 跨表寫入是否由一個明確流程處理，是否需要交易與歷史保留。
- Schema、Entity、`QmahDbContext`、API DTO 與文件是否同步。

## 建議查閱順序

1. [系統架構總覽](../architecture/system-overview.md)
2. [開發資料與本機展示](../getting-started/development-data.md)
3. [文物資料匯入](../features/catalog-import.md)
4. [資料與圖片使用](../features/data-and-media.md)
5. [REST API 契約](../reference/rest-api.md)
