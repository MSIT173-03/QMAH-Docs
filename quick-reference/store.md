# Store｜商城與訂單

快速定位工作可先看下表，再閱讀實際流程與資料表。

## 快速查閱

| 查閱目的 | 入口 |
| --- | --- |
| 先理解怎麼運作 | [商品、訂單、兌券及發放撤銷](../getting-started/system-walkthrough.md#商城：券的規格與手上的一張券) |
| 查資產增減與管理員 | [加鑰匙實例與查帳](../getting-started/system-walkthrough.md#第三步：看一次加鑰匙的完整例子) |
| 查請求如何進入服務 | [啟動與共用元件](../architecture/runtime-and-shared-services.md) |

## 系統範圍

Store 負責文物衍生商品、購物車、折價券、訂單、付款、庫存、商品評價與點數。商品可以對應 Catalog 文物，但商品展示欄位獨立保存；訂單明細保存成交當下的品名、單價與數量快照。

## 實際運作方式

前台從商品 API 讀取上架商品及已解析的圖片網址，購物車只保存會員、商品與數量。建立訂單時重新驗證價格、庫存及可用券，並把成交資料寫入訂單明細快照；付款與履約狀態分開推進。點數兌券會在同一交易內扣點數、寫入點數流水並建立一張 `UserCoupon`；管理員發放、撤銷或批次調整則保存管理員、原因與批次來源，券過期後改為 `EXPIRED` 而不刪除。

## 資料表與關聯

| 資料表或資料群 | 在此入口的用途 | 主要關聯／限制 |
| --- | --- | --- |
| `store.Products` | 商品內容、價格、庫存、上下架狀態與文物對應 | `ArtifactId` 可為空且有唯一限制；商品名稱、說明、尺寸、售價與狀態獨立保存 |
| `store.CartItems` | 會員購物車項目 | 連到會員與商品；同一會員與商品不可重複建列 |
| `store.StoreOrders`、`store.OrderDetails` | 訂單主檔與成交明細 | 明細連到訂單與商品，保存成交品名、單價、數量與金額快照 |
| `store.Payments` | 訂單付款結果與交易資訊 | `OrderId` 唯一，一張訂單目前對應一筆付款紀錄 |
| `store.CouponDefinitions`、`store.UserCoupons` | 折價券定義與會員持券狀態 | 定義、取得方式、有效期間、使用與撤銷狀態分開保存 |
| `store.PointBalances`、`store.PointTransactions` | 會員點數餘額與異動流水 | 會員餘額與流水分表；查帳以流水核對，不直接把畫面數字當成交易 |
| `store.ProductReviews` | 商品評價、公開狀態與會員關聯 | 連到商品與會員；`PUBLISHED`、`HIDDEN`、`DELETED` 不互相替代 |
| `catalog.Artifacts` | 商品對應的文物主資料 | Store 只引用 `ArtifactId`；不複製或修改文物來源、授權與主資料 |
| `admin.EconomyAdjustmentBatches` | 管理員發放或撤銷優惠券等批次操作的來源 | 批次條件與結果需保留；會員持券資料再連回批次 |

## 開發規則與跨系統界線

- 主責資料：Store 主責商品、購物車、訂單、明細、付款、折價券、評價與點數流程。
- 可被引用：商品可引用 Catalog 的 `ArtifactId`；結帳依目前會員身分與既有資產流程讀取 User、優惠券或點數。
- 不得直接修改：其他 Area 不直接改訂單、付款、庫存、商品成交快照或點數流水；文物主資料由 Catalog 管理。
- 跨表流程：結帳需重新查價格、庫存、折價券、點數與會員身分，並在必要時以交易處理明細、付款、庫存和資產異動。
- 前台／後台：Angular 只使用 API DTO；後台在 Store Area 依授權處理商品、訂單、付款、評價與批次資產。
- 歷史資料：訂單、付款、明細、點數流水、已使用優惠券與評價歷史不以實體刪除取代狀態處理。

## 查詢入口

| 查詢目的 | 文件入口 | 這一頁要核對的內容 |
| --- | --- | --- |
| 確認系統責任與跨系統界線 | [Area 責任與資料界線](../architecture/area-boundaries.md) | 誰負責修改資料、哪些系統只能引用 |
| 查資料表、主鍵與外鍵 | [資料表參考](../architecture/database-reference.md) | 表格用途、主鍵、外鍵與跨 Schema 關係 |
| 查資料讀寫、交易與併發 | [資料存取與 DB-first](../architecture/data-access.md) | `QmahDbContext`、投影、追蹤、交易與並行控制 |
| 查 API 路徑、DTO 與狀態 | [REST API 契約](../reference/rest-api.md) | 路徑、DTO、驗證、狀態碼與錯誤回應 |
| 查 Angular 前台串接 | [Angular 使用者前台開發](../frontend/angular-development.md) | Route、HttpClient、Cookie、防偽與載入／錯誤狀態 |
| 查 Razor 後台串接 | [管理後台開發起點](../admin/backend-development.md) | Area、Controller、ViewModel、授權與表單處理 |
| 查功能規則與操作流程 | [經濟與進程](../features/economy-progression.md) | 本頁範圍內的狀態、輸入、流程與歷史資料規則 |
| 查來源、媒體與外部服務 | [資料與圖片使用](../features/data-and-media.md)、[媒體交付設定](../frontend/media-delivery.md)、[地點與地圖串接](../features/map-integration.md) | 來源、授權、邏輯媒體路徑與外部服務界線 |
| 查本機資料與展示狀態 | [開發資料與本機展示](../getting-started/development-data.md) | Snapshot 已提供什麼，隔離資料如何建立 |
| 查資料工具與 Snapshot | [資料工具](../reference/data-tools.md) | Seed、展示資料、匯出、版本與檔案位置 |
| 查交付與協作規則 | [Git 與 GitHub 協作](../reference/git-workflow.md) | 分支、提交、共用檔案、Review 與交付順序 |

## 前台接手建議

- 商品、評價、購物車與訂單可分開實作；串接時確認地址 ID、實際持券 ID 及訂單金額。
- 前台只送商品、數量、地址與選用優惠券；成交單價、折扣、庫存與總額由後端重新計算。
- 建立訂單前顯示的是預估內容，成功後應以訂單 response 的快照金額更新確認頁。
- 優惠券畫面要區分可用、已使用、過期與撤銷；常駐兌換券的點數成本和有效期限由 API 取得。
- 平行分工與跨系統確認事項見[前台功能接手指南](../frontend/feature-development-guide.md)。

## 變更前檢查

- 商品改價、下架、庫存不足、重複結帳、付款失敗、取消與重複回呼是否都有明確結果。
- 訂單明細是否仍顯示成交時的品名、單價與數量，而不跟隨商品現值改寫。
- 權限、目前會員、金額、折扣、庫存與點數是否由伺服器重新計算；目前沒有正式金流供應商 callback Endpoint。
- API、資料庫限制、展示資料、管理後台、前台錯誤狀態與未來金流 callback 契約是否同步。

## 建議查閱順序

1. [Shared｜共用基礎](shared.md)：先讀共同規則與跨系統入口。
2. [開發環境與啟動](../getting-started/development-environment.md)：確認工具、服務與連線基線。
3. [開發資料與本機展示](../getting-started/development-data.md)：確認 Snapshot、資料量與展示狀態。
4. [系統架構總覽](../architecture/system-overview.md)、[Area 責任與資料界線](../architecture/area-boundaries.md)：確認 Store 的責任與引用界線。
5. [資料表參考](../architecture/database-reference.md)、[資料存取與 DB-first](../architecture/data-access.md)：確認資料表、欄位與讀寫方式。
6. [經濟與進程](../features/economy-progression.md)、[資料與圖片使用](../features/data-and-media.md)：依工作目標查資產與展示規則。
7. [REST API 契約](../reference/rest-api.md)、[Angular 使用者前台開發](../frontend/angular-development.md)、[管理後台開發起點](../admin/backend-development.md)：確認對外與畫面串接。
8. [資料工具](../reference/data-tools.md)、[Git 與 GitHub 協作](../reference/git-workflow.md)：完成資料驗證與交付。
