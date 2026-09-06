# 應用程式啟動與共用服務

`Program.cs` 讀取設定、尋找 `QMAH` 資料庫、註冊 Identity、DbContext、resolver、Service 與 Middleware；請求進入後由 Controller 呼叫 Service，再由 `QmahDbContext` 存取資料庫，回應才交回 API 或 Razor View。

本頁說明網站啟動、請求進入 Controller 後如何使用共用服務，以及資產流水和媒體設定的責任。一次完整流程的白話例子見 [5＋1 系統：快速查閱與操作流程](../getting-started/system-walkthrough.md)；跨文件名詞見[文件閱讀與名詞基準](../reference/terminology.md)。

## Program.cs：從設定到接收請求

網站啟動時會先讀取設定並註冊服務，再建立請求會經過的處理管線。註冊服務不等於執行業務操作，例如註冊 `EconomyService` 不會立刻發放點數。以下是網站啟動與單次請求的執行順序，不是功能系統的開發順序。

1. 讀取共同設定、環境別設定、環境變數等來源，最後加入 `appsettings.Local.json`，同名值由 Local 覆寫。資料庫目標等在啟動時讀成固定值，修改後需重新啟動。
2. 允許探索時，`QmahDatabaseConnectionResolver` 檢查指定連線及本機候選，採第一個符合條件者。必要表檢查不等於完整版本驗證；關閉探索時直接使用指定連線。
3. 註冊 `QmahDbContext`、Identity 與各 Service，讓 Controller 可以透過建構式取得所需物件。這叫 DI（依賴注入）。
4. 設定 Middleware，也就是請求沿途經過的處理程式：路由、限流、Cookie 修復、登入及授權等。API 另套 CORS；Web 沒有套用 API 的 CORS policy。
5. `app.Run()` 開始接收請求。Infrastructure 是程式庫，不需要另外啟動。

## 註冊與呼叫服務

若新功能使用 DbContext，就在使用它的 host 註冊 `AddScoped<服務類型>()`。Scoped 表示同一請求使用同一份物件，下一個請求另外建立，避免混用資料追蹤。

只有 API 使用就註冊在 API；Web 也會呼叫才在 Web 註冊。Singleton 是整個應用程式共用一份，不能持有請求專屬的 DbContext。

Controller 負責輸入與 HTTP 回應；需要共用的規則放 Service。單一系統的既有 CRUD 不必只為形式一致搬進共用層。

以資產異動為例，實際路徑是：

1. Web 或 API 的 `Program.cs` 以 scoped 生命週期註冊 `EconomyService`。
2. 需要調整資產的 Controller 透過建構式取得服務，不自行改 Balance。
3. Controller 將會員、增減量、原因與操作者交給服務。
4. 服務檢查餘額與業務條件，在同一交易內更新 Balance 並新增 Transaction。
5. Controller 依服務結果回傳 Razor 畫面或 HTTP 回應。查帳時以 Transaction 為異動依據，Balance 只表示目前數量。

只有 API 會使用的服務放在 API 註冊；Web 與 API 都會使用時，兩個主機都必須註冊。新增註冊不會讓服務自動執行，仍要由 Controller 或其他已註冊流程呼叫。

## 共用元件由哪些功能使用

| 共用元件 | 實際呼叫位置 | 擴充時的做法 |
| --- | --- | --- |
| QmahDatabaseConnectionResolver | Web、API Program | 重用探索規則，不另猜伺服器名稱 |
| QmahMediaUrlResolver | Catalog、StoreCatalog、MiniGame、Me API 與 Web MediaUrlTagHelper | 保存邏輯路徑，輸出時解析 |
| QmahCookieRecoveryExtensions | Web、API pipeline | Cookie 更名需同步目前名稱及舊名稱清單 |
| EconomyService | Economy API、MiniGame、會員管理、鑰匙與券背包 | 餘額及流水一起保存 |
| BulkEconomyService | OperationsController | 預覽與執行分開，保存篩選及結果 |
| CommunityRewardService | 社群、加碼及房間邀請 API | 由服務判斷加碼來源與額度 |
| DailyActivityService | MeController | 前台明確記錄每日登入，後台登入不觸發 |

## 交易與重試

Transaction（資料庫交易）讓多筆相關寫入一起成立，例如餘額增加與流水新增。提交前失敗就回復。

Program 啟用 SQL 短暫錯誤重試後，手動交易需要把整段操作放入 execution strategy（重試策略）。目前人工點數及鑰匙調整已這樣處理；其他直接使用 BeginTransactionAsync 的領域方法仍需在串接時核對。不能只看到有 transaction 就宣稱所有結算路徑已可重試。

完整例子與重複 HTTP 請求的限制見[增加鑰匙流程](../getting-started/system-walkthrough.md#第三步：看一次加鑰匙的完整例子)。

## 流水與稽核

![資產帳本與管理紀錄的用途對照](../diagrams/rendered/asset-ledger-map.svg)

此圖表示查帳用途，不表示 SQL 外鍵。Balance 查目前數量，Transaction 查增減來源，UserCoupons 查券生命週期，批次主檔查活動整體，AuditLogs 查管理操作結果。

[可編輯圖檔](https://github.com/MSIT173-03/QMAH-Docs/blob/main/diagrams/asset-ledger-map.drawio) · [查帳快速對照](../getting-started/system-walkthrough.md#查帳快速對照)

## 圖片與部署設定

Resolver 只轉換公開網址，不會搬檔案。改用 CDN 還需上傳素材、設定來源與存取權限；受保護的媒體不能直接公開。完整步驟見[媒體交付設定](../frontend/media-delivery.md)。

新增 Angular 網址時在 Cors:AllowedOrigins 設定明確來源，並一起核對 Cookie、XSRF 及部署的同站／跨站條件。只增加 CORS 不會自動解決 Cookie 的 SameSite 限制。
