# Angular 前台整合狀態

> 更新日期：2026-09-21
> 本頁是目前前台整合的工作基準與待辦摘要，不取代 API 契約、資料庫文件或各系統的功能說明。

`QMAH.Client` 已有可操作的 Angular 使用者前台與共用 App Shell。User、Catalog、Game、Social、Store 五個系統都已接入主要入口；一般使用者前台的公開頁與 API＋Angular 流程不需要啟動 `QMAH.Web`，只有管理後台、私人 uploads／頭像或需要 Razor 的流程才需要第三個服務。主要缺口是部分流程仍需在可用的本機資料庫與正確啟動組合下完成端對端驗證。

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

## 目前實際前台路由

下表依 `QMAH.Client/src/app/app.routes.ts` 目前內容整理。路由已註冊不等於每條流程都已完成真實資料庫端到端驗證；「目前狀態」只描述程式入口與正式 API 邊界。

| 路由範圍 | 目前入口 | 目前狀態 | 主要未完成事項 |
| --- | --- | --- | --- |
| 帳號 | `/login`、`/register`、`/forgot-password`、`/reset-password` | UI 與帳號 API 已接入；登入鏈為 antiforgery → login → `/me` | 以代表帳號完成瀏覽器登入、登出、停權與 Google capability smoke |
| 首頁與法律 | `/home`、`/privacy-policy`、`/terms` | 頁面已存在；首頁行銷版位仍使用型錄排序或本地 editorial fallback | 若需要正式主視覺、限時特賣、搜尋建議或 site config，先建立後端契約 |
| User／會員 | `/member`、`/member/profile`、`/member/economy`、`/member/achievements`、`/member/daily-activity`、`/member/addresses`、`/member/coupons`、`/member/notifications` | 主要會員頁與 `/api/v1/me/*` 已接入，使用 `authGuard` | 真實資料庫驗證載入失敗、空資料、寫入失敗、登出後回復狀態 |
| Catalog／圖鑑 | `/artifact-list`、`/key-list` | 圖鑑查詢、分類／年代、解鎖與鑰匙 API 已接入；已解鎖篩選是前台狀態切換 | 真實圖片、解鎖扣除／不扣除、交換規則、刷新與錯誤回饋的 E2E smoke |
| Game／遊戲 | `/game`、`/game/rooms`、`/game/room/:roomId`、`/game/account`、`/game/training`、`/game/minigames`、`/game/how-to` | 房間、ready/start/leave/heartbeat、回合、作答、投票、Mini Game API 均有 service 與頁面入口 | 真實房間生命週期、逾時、重新整理、邀請、獎勵冪等與多人結果驗證 |
| Social／社群 | `/social/posts`、`/social/posts/:id`、`/social/events`、`/social/events/:id`、`/social/announcements` | 貼文、看板、留言、檢舉、活動、報名、媒體及作者編輯 API 已接入 | 真實檔案上傳限制、審核／發布、權限與通知流程驗證 |
| Admin／管理前台 | `/admin/events`、`/admin/reports`、`/admin/posts`、`/admin/comments` | 已註冊 `adminGuard` 與對應 Admin API | Admin 角色登入、列表空狀態、狀態異動與跨頁刷新驗證 |
| Store／商城 | `/store`、`/store/products`、`/store/product/:id`、`/store/cart`、`/store/checkout` | 商品、活動、評價、會員購物車、地址與建立訂單 API 已存在；圖片走正式 Catalog／Store media | 結帳報價 API 尚不存在；付款、配送、庫存、優惠券套用與取消／退款尚未形成完整契約 |

根路徑 `/` 與未知路徑目前都導向 `/home`。`/game/demo` 只在 development mode 註冊，`/game/test` 與 `/admin/*` 受管理員 guard 保護。

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

目前另有兩個需要優先清理的前台契約缺口：

- `CheckoutApi.getQuote()` 仍保留 `/api/v1/store/checkout/quote` 呼叫，但 API 目前沒有這支路由；在正式報價契約完成前，結帳頁不能宣稱已可完成報價。
- `CatalogService` 仍保留文物 `POST`、`PUT`、`PATCH`、`DELETE` 方法，但目前 `CatalogController` 沒有對應寫入路由；現行前台頁面未使用這些方法，後續應移除或改放到明確的管理 API，避免誤用。

## 共同驗證與邊界

- 目前整合完成不等於所有需要資料庫的流程都已完成端對端驗證。
- 一般前台最小驗證順序：先啟動 API 與 Angular，以代表帳號逐系統走一條主流程，檢查登入、圖片、資料與登出；管理後台或私人媒體流程再加啟動 `QMAH.Web`。
- 後端 authorization、交易一致性、庫存與付款狀態仍是安全與正確性的邊界；Angular guard 只負責前端導引與體驗。
- 詳細跨系統工作項目與已知限制以本頁「目前實際前台路由」及各系統「下一步／目前未完成事項」為準；目前沒有另外存在的 `INTEGRATION_TODO.md`。

## 啟動與交接

Visual Studio 可使用 `QMAH 全站（API＋前台＋管理後台）` 一次啟動三個服務；部分檢查可使用 `QMAH API＋Angular 前台` 或 `QMAH API`。實際網址、Node 相容版本與命令列方式見[開發環境與啟動](../getting-started/development-environment.md)。
