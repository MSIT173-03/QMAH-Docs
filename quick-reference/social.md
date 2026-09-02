# Social｜社群與活動系統

本頁集中 Social 的內容狀態、活動、檢舉、通知、媒體與地點資料入口。頁面聚合查詢路徑，不取代內容審核與 API 契約的詳細規則。

## 範圍

Social 管理貼文、留言、回覆、檢舉、活動、活動報名、通知與社群媒體。內容作者、管理權限、發布狀態與歷史保留是不同的責任，不能只由畫面按鈕是否顯示來判斷。

## 快速查詢

| 查詢目的 | 正規文件 | 需要確認的內容 |
| --- | --- | --- |
| 確認 Social 的資料責任 | [Area 責任與資料界線](../architecture/area-boundaries.md) | 內容、活動、檢舉與通知的修改邊界 |
| 查詢 API 行為 | [REST API 契約](../reference/rest-api.md) | 貼文、留言、檢舉、活動與媒體端點 |
| 查詢地點欄位與地圖連結 | [地點與地圖串接](../features/map-integration.md) | 文字地址、成對座標與 OpenStreetMap 連結 |
| 查詢圖片與授權 | [媒體交付設定](../frontend/media-delivery.md) | 邏輯媒體路徑、Local、CDN 與快取 |
| 查詢內容與文物關聯 | [資料與圖片使用](../features/data-and-media.md) | 文物來源、授權與圖片使用邊界 |
| 查詢管理後台 | [Razor 與 Tabler 介面](../admin/razor-admin-ui.md) | 共用 Layout、表格、表單與狀態回饋 |
| 查本機展示狀態 | [開發資料與本機展示](../getting-started/development-data.md) | 貼文、留言、活動、檢舉與通知資料 |

## 關鍵資料關係

| 資料 | 主要用途 | 變更注意事項 |
| --- | --- | --- |
| `social.SocialPosts` | 一般貼文與公告貼文 | 以發布狀態控制可見性，保留必要歷史 |
| `social.SocialComments` | 留言與回覆 | `ParentCommentId` 形成自我關聯 |
| `social.ContentReports` | 貼文或留言的檢舉 | `TargetType` 與 `TargetId` 需再次查驗目標 |
| `social.Events`、`social.EventRegistrations` | 活動與報名 | 發布、時間、截止日與容量需同時驗證 |
| `social.UserNotifications` | 會員通知與已讀狀態 | 更新範圍限於目前登入者的資料 |
| `social.MediaAssets` | 社群圖片與替代文字 | 上傳規則以 API 與媒體文件為準 |

## 流程與邊界

- `PUBLISHED`、`HIDDEN`、`DELETED` 與檢舉的 `PENDING`、`RESOLVED`、`REJECTED` 是不同資料狀態，不互相替代。
- 活動需分開處理審核、發布、開始結束、報名截止與人數上限。
- 文字地址可獨立存在；`latitude` 與 `longitude` 必須成對提供。地圖連結不改變資料庫的主要地址資料。
- 外部圖片服務只影響媒體交付；文物與社群內容的授權資訊仍由既有資料欄位保存。
- 跨系統引用文物、會員或獎勵時，使用明確 API／外鍵關係，不直接改寫 Catalog、User 或 Store 的主資料。

## 變更前檢查

- 作者、管理權限、公開狀態、檢舉處理與歷史保留是否各有明確 Action。
- 留言樹、通知已讀、活動容量、重複報名與重複處理是否有邊界。
- 使用者輸入是否以純文字安全呈現；外部連結與新分頁是否設置適當安全屬性。
- 圖片上傳的檔案格式、大小、替代文字與 `413` 回應是否同步。

## 循序閱讀

1. [Area 責任與資料界線](../architecture/area-boundaries.md)
2. [REST API 契約](../reference/rest-api.md)
3. [地點與地圖串接](../features/map-integration.md)
4. [媒體交付設定](../frontend/media-delivery.md)
