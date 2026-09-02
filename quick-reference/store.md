# Store｜商城與訂單系統

本頁集中商品、購物車、折價券、訂單、付款、庫存與點數的查詢入口。Store 的流程資料具有歷史性，價格、金額與狀態由伺服器與資料庫契約決定。

## 範圍

Store 保存文物衍生商品與交易流程。商品資料可與 Catalog 的文物對應，但商品名稱、說明、尺寸、價格、庫存與上下架狀態獨立保存；訂單明細另存成交當下的快照。

## 快速查詢

| 查詢目的 | 正規文件 | 需要確認的內容 |
| --- | --- | --- |
| 確認 Store 的資料責任 | [Area 責任與資料界線](../architecture/area-boundaries.md) | 商品、訂單、付款、庫存與跨系統界線 |
| 查詢資料表與外鍵 | [資料庫 Diagram 對照](../architecture/database-diagram.md) | `store` 與 `catalog`、`user` 的關聯 |
| 查商品、購物車與訂單 API | [REST API 契約](../reference/rest-api.md) | 公開讀取、目前會員與管理端點 |
| 查折扣、點數與鑰匙 | [經濟與進程](../features/economy-progression.md) | 優惠券、點數流水與跨流程加碼 |
| 查商品圖片與授權 | [資料與圖片使用](../features/data-and-media.md) | 文物圖片與商品展示資料的來源界線 |
| 查管理後台頁面 | [Razor 與 Tabler 介面](../admin/razor-admin-ui.md) | 表格、表單、狀態回饋與共用 Layout |
| 查本機展示狀態 | [開發資料與本機展示](../getting-started/development-data.md) | 商品、訂單、付款與評價資料 |

## 關鍵資料關係

| 資料 | 主要用途 | 變更注意事項 |
| --- | --- | --- |
| `store.Products` | 商品內容、價格、庫存與上架狀態 | 可引用文物，但欄位獨立保存 |
| `store.CartItems` | 會員購物車項目 | 同一會員與商品不可重複建列 |
| `store.StoreOrders`、`store.OrderDetails` | 訂單與成交明細 | 保存成交品名、單價與數量快照 |
| `store.Payments` | 付款處理結果 | 與訂單狀態及交易編號一起驗證 |
| `store.CouponDefinitions`、`store.UserCoupons` | 折價券定義與會員券 | 狀態與有效期間需保留歷史 |
| `store.PointBalances`、`store.PointTransactions` | 點數餘額與異動流水 | 以流水查帳，不直接改餘額 |

## 流程與邊界

- 結帳時由伺服器重新查價格、庫存、折價券、點數與會員身分，不採信瀏覽器送回的總金額或狀態。
- 建立訂單時需在同一個明確流程處理明細快照、金額、優惠券、庫存與點數；跨表寫入必要時使用交易。
- 訂單狀態、付款狀態與商品上下架狀態分開保存，不能用其中一個欄位代表全部流程。
- 目前建立訂單時會建立 `PENDING` 付款紀錄；資料中的 `PAID`／`FAILED` 可供既有流程與展示資料呈現，但目前程式沒有正式金流供應商的 callback Endpoint（回呼路徑）。
- 未來若接入金流供應商，需另定 callback 契約，驗證交易編號、金額、回傳代碼與目前狀態，且重複通知不可重複扣庫存或點數。
- 既有訂單、付款、點數交易與使用過的優惠券保留歷史，不以實體刪除取代狀態處理。

## 變更前檢查

- 商品改價、下架、庫存不足、重複結帳、付款失敗、取消與重複回呼是否都有結果。
- 訂單明細是否仍顯示成交時的品名、單價與數量，而不跟隨商品現值改寫。
- 權限、目前會員、金額、折扣、庫存與點數是否由伺服器重新計算。
- API、資料庫限制、展示資料、管理後台與前台錯誤狀態是否同步。

## 循序閱讀

1. [Area 責任與資料界線](../architecture/area-boundaries.md)
2. [REST API 契約](../reference/rest-api.md)
3. [經濟與進程](../features/economy-progression.md)
4. [資料存取與 DB-first](../architecture/data-access.md)
