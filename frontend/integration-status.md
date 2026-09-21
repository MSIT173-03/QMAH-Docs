# Angular 前台整合狀態

> 更新日期：2026-09-21
> 本頁是目前前台整合的工作基準與待辦摘要，不取代 API 契約、資料庫文件或各系統的功能說明。

`QMAH.Client` 已有可操作的 Angular 使用者前台與共用 App Shell。User、Catalog、Game、Social、Store 五個系統都已接入主要入口；目前的主要缺口不是「還沒有畫面」，而是部分流程仍需要在可用的本機資料庫與三個服務同時啟動時完成端對端驗證。

視覺整合以 Game 區域作為參考之一，但不是其他系統的版型規格。共用層負責導覽、主題狀態、字體階層、色彩角色、間距、圓角、表單與回饋基線；各系統仍依自己的任務保留資訊架構與操作節奏。

目前共用色彩與五個 Area 的語意 accent，依[前台色彩與視覺素材基準](ui-color-system.md)維護。該文件另行區分 UI 素材（分隔線、淡色 surface、狀態層級）與內容照片（必須有語意、來源、授權、alt 與 responsive crop），不以 stock photo 取代元件層級問題。

2026-09-21 的整合 hardening 已整理到主分支：登入流程維持 `/api/v1/account/antiforgery-token` → `/api/v1/account/login` → `/api/v1/me`；Angular `npm start` 會優先探測 API HTTPS `7249`，找不到時改用 HTTP `5147`，仍可用 `npm run start:https` 或 `npm run start:http` 明確指定。API 也直接提供公開的 `/media/catalog` 與 `/media/store`，因此只啟動 API 與 Angular 時不再必須依賴 `QMAH.Web` 才能顯示圖鑑與商城公開圖片。

## 目前共用基線

- App Shell、主要導覽、行動版導覽、active state 與共用頁尾已接回各主要前台入口。
- Login、App Shell 與各系統使用同一套 shared theme state；主題偏好可跨 route 保留。
- 共用按鈕、表單、卡片、狀態提示與頁面容器已有整合基線，局部頁面仍可依內容密度調整。
- 五個系統已建立 shared Area accent mapping；Area 色只負責辨識與分組，成功／警告／錯誤／資訊仍使用全站 semantic state。
- 圖鑑篩選器已改用 intrinsic grid、完整換行與 checked state；已解鎖篩選按鈕會在「僅顯示已解鎖／顯示全部」之間切換。
- 真首頁、登入頁、圖鑑列表、商城首頁、社群列表、遊戲大廳與會員中心已可作為目前前台代表畫面。
- Angular production build 與既有前端測試可作為整合變更的基本檢查；需要資料的流程仍須另做 runtime smoke。

## 五個系統待辦

### User／會員

目前已涵蓋登入、註冊、會員中心、個人資料、地址、通知、每日活動、成就與會員資產等前台入口。

下一步：

- 用可用的本機資料庫完成 Auth → `/me` → 一個 authenticated write → logout 的瀏覽器流程。
- 確認每日活動請求失敗或逾時時，不會把會員中心整頁卡在 loading。
- 重新確認 Google 登入 capability、停權狀態與失敗訊息在前台的呈現。

### Catalog／圖鑑

目前已涵蓋圖鑑列表、搜尋、分類／年代篩選、文物詳情、收藏／解鎖與鑰匙相關入口。

下一步：

- 在真實資料庫完成列表、詳情、圖片 URL、解鎖與會員進度的 E2E smoke。
- 決定圖鑑詳情與社群討論之間的唯一入口，避免同一功能出現兩條不一致路徑。
- Key Exchange 的完整前台流程仍待 API、狀態與錯誤回饋一起確認。

### Game／遊戲

目前已涵蓋遊戲大廳、房間、多人鑑定、單人玩法、訓練與歷史相關入口。

下一步：

- 以真實資料庫驗證房間建立、加入、離開、回合、作答、投票與結果更新。
- 確認獎勵、邀請與加成交易只在後端交易成功後反映到前台。
- 為空房間、逾時、房間已結束與重新整理補齊可恢復狀態。

### Social／社群

目前已涵蓋貼文列表、貼文詳情、活動、公告、通知、留言與媒體相關入口。

下一步：

- 驗證貼文、留言、檢舉、活動、通知與媒體 URL 的真實資料流程。
- 確認檔案選擇、上傳失敗、過大檔案與不支援格式都有清楚回饋。
- 決定文物詳情、社群貼文與活動之間的 canonical route，避免導覽分裂。

### Store／商城

目前已涵蓋商城首頁、搜尋／分類、商品列表、商品詳情、購物車與結帳入口；商品詳情的長來源 URL 已處理行動版換行與 overflow。商品清單、熱銷排行與推薦卡片沿用正式商品 API 的圖片與統計欄位，明信片視圖固定使用淺色紙面，不隨商城深色主題反轉。

目前前台實際呼叫的 Store 相關 API：

- 商品型錄：`/api/v1/store/categories`、`/api/v1/store/promotions`、`/api/v1/store/products`、`/api/v1/store/products/{id}`、`/api/v1/store/products/{id}/reviews`
- 會員資料：`/api/v1/me`、`/api/v1/me/coupons`、`/api/v1/me/cart`
- 首頁主視覺、限時特賣、排行、推薦、可領折價券、熱門搜尋與 Store site config 尚未是後端契約。前台改用現有商品型錄排序或本地 editorial fallback，不再請求不存在的路徑。

下一步：

- 補齊正式 checkout options、報價、配送、付款 DTO 與狀態機的前後端契約，並讓前台接上實際流程。
- 在真實資料庫驗證商品、購物車、優惠券、點數、庫存與訂單狀態。
- 確認付款 callback、已付款取消／退款與失敗回復，不以單純前端 disabled 取代後端規則。

## 共同驗證與邊界

- 目前整合完成不等於所有需要資料庫的流程都已完成端對端驗證。
- 最小驗證順序：先啟動 API、Angular 前台與 Razor 管理後台，再用代表帳號逐系統走一條主流程，最後檢查跨系統導覽與登出。
- 後端 authorization、交易一致性、庫存與付款狀態仍是安全與正確性的邊界；Angular guard 只負責前端導引與體驗。
- 詳細跨系統工作項目與已知限制，請參考主 Repository 的 `INTEGRATION_TODO.md`。

## 啟動與交接

Visual Studio 可使用 `QMAH 全站（API＋前台＋管理後台）` 一次啟動三個服務；部分檢查可使用 `QMAH API＋Angular 前台` 或 `QMAH API`。實際網址、Node 相容版本與命令列方式見[開發環境與啟動](../getting-started/development-environment.md)。
