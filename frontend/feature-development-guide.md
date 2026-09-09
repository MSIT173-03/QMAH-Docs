# 前台功能接手指南

開發前台功能時，需要決定畫面顯示什麼、操作後呼叫哪個 API，以及載入中、失敗或沒有資料時如何呈現。本頁依系統列出接手建議，方便各自開發後再接合。

Angular 的 route 決定頁面網址，component 負責畫面與操作，service 集中呼叫 API，state 保存目前的畫面狀態。登入、錯誤與分頁等重複需求可放共用層，各功能透過 API 回傳的識別碼連接資料。

各系統可以同時開發自己的使用者前台功能。本頁說明各自能做什麼，以及功能接在一起時需要確認什麼。實際欄位與狀態碼仍以啟動中的 OpenAPI／Scalar 為準；本頁負責說明畫面流程，不複製另一份 DTO 定義。名詞定義見[文件閱讀與名詞基準](../reference/terminology.md)。

UI 預設直接使用 Tailwind CSS 與 daisyUI，Component 預設沒有 stylesheet；特殊視覺可使用 component CSS，不自行加入另一套 theme 或完整 UI framework。日常範例與規則只維護在 [Angular 使用者前台開發：UI 與樣式](angular-development.md#ui-and-styling)。

## 開始前台工作的最短路線

先把自己的功能分支更新到 `main`，啟動 API 與 Angular，再依下表完成第一條可看到結果的流程。表中的檔名是建議起點，不是需要一次建立的固定模板。

| Domain | 建議第一條流程 | 起始 API | 是否需登入 |
| --- | --- | --- | --- |
| Catalog | 分類／文物清單 → 詳情 | `GET /api/v1/catalog/categories`、`/catalog/artifacts` | 否 |
| Game | 房間清單 → 房間詳情 | `GET /api/v1/game/rooms`、`/game/rooms/{id}` | 清單否，操作是 |
| Social | 公開貼文／活動清單 → 詳情 | `GET /api/v1/social/posts`、`/social/events` | 否 |
| Store | 商品清單 → 商品詳情 | `GET /api/v1/store/products`、`/store/products/{id}` | 否 |
| User | 防偽 → 登入 → 會員資料 | `/api/v1/account/antiforgery-token`、`/api/v1/account/login`、`/api/v1/me` | 登入後是 |

Catalog、Game、Social、Store 的 Domain 負責人各自維護自己的 `*-api.ts` 與功能目錄；User 負責先定義登入／session service 的公開方法，其他 Domain 使用這份介面，不各自重寫登入。每個人可在自己的分支暫時註冊測試 route；合併時由整合者集中處理 `app.routes.ts`，避免五個分支同時改根路由。

## 共用功能的平行開發

登入、API 呼叫與共用畫面元件可和各系統同步開發。先約定方法名稱、輸入與回傳欄位；尚未完成時，可用符合 API 契約的測試回應開發畫面，接好後再換成真實 API 驗證：

| 位置 | 建議內容 |
| --- | --- |
| Domain 的 `*.models.ts` | 功能契約；確實跨 Domain 共用時才抽出共用型別 |
| `auth/`（實作登入時建立） | 啟動時讀取目前會員、登入、登出、`401` 清理與登入後每日活動登記 |
| `app.config.ts` | 沿用 credentials／XSRF 設定；操作防重送由 Page 管理 |
| `shared/<功能>/`（有共用需求時建立） | 載入、空資料、錯誤、分頁、確認操作、圖片替代狀態與地點連結元件 |

前台不保存資料庫 Entity，也不從名稱、圖片檔名或畫面文字推算 ID。篩選代碼與顯示名稱先讀取 `/api/v1/metadata`；圖片直接使用 API 回傳的 URL。

## 平行開發對照

表格是分工對照，不是開發先後順序。各系統可以同時開始，只有要串在一起的功能需要確認共同資料。

| 系統 | 可以獨立開發 | 跨系統時確認什麼 |
| --- | --- | --- |
| 會員 | 個人資料、地址、通知、登入畫面 | 提供共用登入狀態；商城使用地址 ID；其他功能使用會員 ID |
| 圖鑑 | 清單、分類年代篩選、詳情、圖片授權 | 遊戲、商品、貼文使用同一 ArtifactId；解鎖後更新鑰匙與收藏 |
| 遊戲 | 房間、回合、作答、投票、結果畫面 | 文物素材與題目來源；領獎後的點數、鑰匙；社群邀請 |
| 社群 | 貼文、留言、活動、報名、地點 | 發文者身分；文物引用；遊戲邀請及加碼結果 |
| 商城 | 商品、評價、購物車、訂單畫面 | 會員地址、可用券、後端確認的價格與付款結果 |
| 營運中心 | 管理查詢、日期篩選、資產活動 | 各指標採哪個日期與狀態；批次操作及個別流水如何對照 |

例如商城不用等會員所有頁面完成。地址選擇只需約定地址 API 的欄位與 ID，就能先完成選擇畫面；串接時再確認該地址確實屬於目前會員。

遊戲也不用等圖鑑頁面完成，只需取得文物 API 的 ID 與圖片網址。文物不再啟用、圖片讀不到或素材為空時，兩邊再確認一致的處理方式。

## 各系統的實作重點

### User

登入、個人資料、地址、通知與稱號可分別開發，共用同一份會員狀態。應用程式啟動時呼叫 `/me` 判斷 Cookie 是否仍有效；收到 `401` 時清除記憶體中的會員狀態並導向登入，不在 localStorage 保存 Cookie 或密碼。每日登入只由會員前台在登入狀態確認後登記，管理後台登入不觸發。

### Catalog

文物清單、詳情與篩選各自使用對應 API，詳情網址保留文物 ID，方便分享與直接開啟。清單保留 API 的 `page` 與 `pageSize`，詳細頁重新依 ID 查詢，不把整筆清單資料當成唯一來源。圖片、縮圖、來源網址與授權文字都直接使用 DTO；找不到文物、圖片載入失敗與文物停用要有不同畫面狀態。

### Social

公開清單、詳情與會員寫入功能可以分開實作，整合時再確認登入及發布狀態。圖片發文採「先上傳媒體取得 ID，再建立貼文」；上傳成功不代表貼文已發布。活動報名按鈕依 API 回傳的名額、期間與目前會員狀態顯示，送出後仍以伺服器結果為準。地點只有文字時提供地址搜尋，有成對座標時才建立定位連結。

### Game

房間、回合與答案是不同層級。前台應以 API 回傳狀態決定可以加入、作答、投票或查看結果，不以按鈕是否可見取代後端授權。第一版可在使用者主動操作或固定的低頻率間隔重新讀取房間／回合，不假設目前已有 SignalR。送出作答、投票、邀請回應與領獎時要鎖定按鈕，並處理重複操作的 `409`。

### Store

商品、購物車與訂單可分別開發；地址與折價券依共同 API 欄位串接。購物車金額只供顯示；建立訂單時由後端重新確認售價、庫存、折價券與總額。前台送出商品、數量、地址與選用優惠券，不自行決定成交單價或折扣結果。建立後以訂單明細回應顯示後端確認的金額。

### Economy 與 Mini Game

經濟首頁以 `/me/economy` 作為同一份會員資產摘要。鑰匙比例、可解鎖數量、回收價值、折價券門檻與遊戲獎勵不寫在 Angular 常數。使用鑰匙沒有候選文物時仍是成功回應，畫面顯示未解鎖且未扣除，不當成錯誤。

Mini Game 先由 `/game/modes` 產生模式入口。Start response（開始回應）提供 Attempt、文物池、難度、Seed 與 Config；Complete request（完成請求）只送原始結果，評級、點數與鑰匙進度由後端計算。四種模式可以共用嘗試生命週期，但每種 `Config` 與 raw result（原始結果）的畫面轉換應放在各自 adapter（資料轉換層），不要在單一大型 component 內以大量條件分支處理。

## 可選的 API 串接測試頁

正式 UI 尚未完成時，可在 `<domain>/api-test/` 建立很薄的 standalone 頁面；這是推薦工具，不是必做交付。按鈕呼叫真正的 Feature Service，再顯示 loading、response 與 error，驗證路徑是 `Test Page → Real Feature Service → Real HttpClient → Real API`。

以下 Catalog 範例沿用 [CatalogApi 範例](angular-development.md#angular-分層)，檔案可放在 `catalog/api-test/api-test.ts`：

```ts
import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { CatalogApi } from '../catalog-api';
import { Category } from '../catalog.models';

@Component({
  selector: 'app-catalog-api-test',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <button (click)="load()" [disabled]="loading()">讀取分類</button>
    @if (loading()) { <p>載入中…</p> }
    @if (error()) { <p role="alert">{{ error() }}</p> }
    <pre>{{ categories() | json }}</pre>
  `
})
export class CatalogApiTest {
  private readonly api = inject(CatalogApi);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly categories = signal<Category[]>([]);

  load() {
    if (this.loading()) return;
    this.loading.set(true);
    this.error.set('');
    this.api.getCategories().pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: value => this.categories.set(value),
      error: () => this.error.set('讀取失敗，請查看 Network 回應。')
    });
  }
}
```

測試頁不直接 inject HttpClient、不重複 URL、不自行讀 XSRF 或設定 credentials。正式 UI 完成後可移除測試頁或由正式 Page 取代；若保留 developer-only 頁面，限制在開發路由，不放正式 navigation。無需替五個 Domain 預先建立測試頁。

## 每個頁面都要處理的狀態

清單至少有載入中、空資料、載入失敗、正常資料與下一頁；詳情另處理不存在或目前不可見。寫入頁要保留欄位錯誤、送出中、成功、權限不足、登入失效、狀態衝突與重新嘗試。`204` 沒有 response body，不能一律呼叫 JSON 解析。

API 回應中的日期保留原始 ISO 8601 值，由共用格式化工具轉成台灣顯示格式。金額與數量同樣集中格式化，不在模板中散落字串拼接。

## 從空資料夾到正式頁面

先依 [Angular 開發入口](angular-development.md#開發入口)還原本機 DB、啟動 API 與 Angular。瀏覽器使用 `http://localhost:4200/`；API 契約在 `https://localhost:7249/scalar/v1`。app.routes 仍為空，尚無功能頁是預期狀態；選定 Domain 後才建立實際功能目錄。

建議一次完成一條可操作流程，而不是先把五個 Domain 的所有畫面或 service 寫完：

1. **選定入口**：例如 Catalog 先完成分類查詢與顯示，再做文物清單、分頁及詳情。先約定負責人、頁面 URL、要用的 endpoint 與操作成功後呈現什麼。
2. **確認 contract**：在 Scalar 查看 Method、Route、query、body、DTO、可空欄位、Auth 與成功狀態；公開查詢可先串接，需要登入的功能再接共用 session。
3. **建立 model**：在 Domain／feature 旁的 `*.models.ts` 依 DTO 定義 TypeScript 型別。保留 API 的欄位名稱、null 與日期字串語意；不使用 Entity，也不以 `any` 隱藏型別落差。TypeScript 型別不會在執行時驗證伺服器資料。
4. **建立 service**：在 Domain／feature 旁的 `*-api.ts` 使用 `inject(HttpClient)` 和 environment；query 放在 HttpClient 的 `params`，寫入使用專屬 request 型別。方法回傳 Observable，由使用端訂閱，service 不自己觸發重複 request。
5. **接上 Page**：在 Domain 下的功能目錄建立 standalone component，TS／HTML 放一起，inject service；特殊視覺才加 component CSS。模板需要的 pipe／component 明確加入 imports。用 signal 保存互動狀態，`finalize` 解除 loading。範例見前面的可選測試頁，正式 UI 同樣沿用該 service。
6. **註冊路由**：第一個頁面完成後建立 Domain routes，於 `app.routes.ts` 加一條 lazy route。只有其他頁面也會使用的 UI 才移到 `shared`，Domain 專用元件留在使用它的功能旁。
7. **接好操作結果**：寫入成功後重新讀取受影響資料，或用後端回應更新畫面；失敗保留輸入並顯示可理解的錯誤。點數、庫存、名額與訂單金額以後端為準。
8. **按風險驗證並交接**：選用下方方法，記下入口、帳號角色及已完成流程，連同功能程式一起提交；尚未實作的部分直接說明，不以假成功回應遮掩。

以下路由是頁面完成後的範例，假設 `artifact-list/artifact-list.ts` 匯出 `ArtifactList`；範例檔名及網址可依實際 UI 決定：

```ts
// catalog/catalog.routes.ts
import { Routes } from '@angular/router';

export const catalogRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./artifact-list/artifact-list').then(m => m.ArtifactList)
  }
];

// app.routes.ts 的 routes 陣列加入這個項目
// { path: 'catalog', loadChildren: () =>
//     import('./catalog/catalog.routes').then(m => m.catalogRoutes) }
```

不要把每次嘗試用的路由都加入正式選單。API 測試頁若保留，僅在開發環境註冊；隱藏選單本身不等於路由不可存取，也不取代後端授權。

## 登入與寫入串接

共用登入流程由 `auth/` 負責，各 Domain 使用同一份記憶體 session 狀態：

1. 先 `GET /api/v1/account/antiforgery-token`，取得 `XSRF-TOKEN-API`。
2. `POST /api/v1/account/login`，由全域 HttpClient 設定帶上 Cookie 與 `X-XSRF-TOKEN`。成功的 `204` 沒有 JSON body。
3. `GET /api/v1/me` 取得會員，並重新取得 antiforgery token，讓後續寫入使用登入身分對應的 XSRF。
4. 會員前台確認登入完成後，可依正式流程呼叫 `/api/v1/me/daily-activity/login`；不要在每個頁面載入時都登記。
5. 登出使用 `/api/v1/account/logout`，成功後清除記憶體 session；之後若以匿名身分寫入或重新登入，先更新 antiforgery token。

頁面重新整理時可用 `/me` 恢復 session。未登入的公開頁可正常顯示，不必把所有 `401` 都轉成全站跳頁；需要登入的功能再引導登入。Angular route guard 用於導覽體驗，API 仍負責授權。完整 Cookie 與 PowerShell 操作見 [REST API 契約](../reference/rest-api.md#powershell-驗證流程)。

寫入期間停用操作按鈕，並在 handler 防止重入；不要替訂單、扣款、發獎等 POST 加上通用自動 retry。遇到逾時先查詢實際結果，再依 endpoint 的重送契約決定下一步。不要把一支 endpoint 的冪等行為推廣到所有寫入 API。

## 實作時容易忽略的地方

| 情境 | 建議做法 |
| --- | --- |
| 搜尋與篩選快速變更 | 可用 debounce 與 switchMap 避免舊回應覆蓋新查詢；變更篩選時回第一頁 |
| 離開頁面 | 長時間訂閱與輪詢隨元件銷毀解除，可用 AsyncPipe 或 takeUntilDestroyed；避免背景輪詢持續累積 |
| 多次訂閱 Observable | HttpClient 每次訂閱都可能發出 request，避免模板與程式對同一操作重複訂閱 |
| loading 與錯誤 | 成功、失敗都解除 loading；重試前清除舊錯誤，保留必要表單輸入 |
| API 參數 | 使用 params 處理查詢，將可空欄位和空字串區分；不要手工拼出未編碼的查詢字串 |
| 資料顯示 | 用安全文字插值，圖片直接用 API URL；清單以穩定 ID 追蹤，保留空資料畫面 |
| 表單與可操作性 | 輸入有 label，錯誤靠近欄位，按鈕可用鍵盤操作；手機寬度避免橫向溢出 |
| HTTP 錯誤 | 依狀態與 ProblemDetails 顯示可理解訊息；response 不一定是 JSON，也不一定包含 detail |
| 正式部署 | API 維持 `/api/v1`；部署主機需處理 SPA 深層路由回退，API 路徑則轉送 API，不回傳 index.html |

## 依需要選用的測試方式

不需要每次改字、調樣式都跑整套測試。先確認目前想排除哪種問題，再選最小方法；不必每支 API 測遍所有錯誤碼。

| 想確認什麼 | 推薦方式 | 能確認的範圍 |
| --- | --- | --- |
| route、method、DTO 或 Auth | Scalar／OpenAPI | 後端契約及直接 request，無法代表 Angular service 已接好 |
| 真實前台串接 | 正式 Page 或可選 API 測試頁＋Network | Page → service → HttpClient → API，含 proxy、Cookie 與 XSRF |
| service 的 URL、參數、body | HttpClient 測試替身 | 不連 DB；模擬回應與錯誤，確認 request 形狀與解析 |
| Page 的 loading、error 與互動 | 用 service stub 做元件測試 | 專注畫面狀態，不能取代真實 API 串接 |
| 寫入是否生效 | 送出一次後查詢 API／後台／DB | 實際保存結果；使用可辨識的測試資料，避免對正式資料試寫 |
| 型別、模板及打包 | `npm run build` | 編譯與打包，不代表登入或業務流程正確 |

service 測試可使用 Angular 的 `provideHttpClient()`，再註冊 `provideHttpClientTesting()`，由 `HttpTestingController.expectOne` 核對 URL、method、params／body，再以 `flush` 模擬回應；結束時 `verify` 確認沒有未處理 request。這只測 HTTP 契約用法，不測真實 Cookie、proxy 或 DB。有明確回歸風險時再加入測試，不為空目錄建立測試。

建議的手動串接順序是：正常讀取 → 空資料 → 實際要用的登入／寫入 → 成功後畫面更新；視功能再檢查欄位錯誤、未登入、無權限、查無資源或衝突。Network 可檢查 URL、Method、Status、Headers、Payload、Response 與 Cookies。若資料有寫入，回查結果，不只看成功提示。

## 遇到串接問題時

| 現象 | 先看哪裡 |
| --- | --- |
| Angular 首頁空白 | app.routes 是否有已實作的 page；目前骨架尚無功能路由 |
| `/api` 回傳 HTML | URL 或 proxy 是否正確，是否被 SPA fallback 接走 |
| API 連不到 | API 是否以 https profile 啟動、7249 是否一致、proxy 設定及本機開發憑證 |
| `401` | `.QMAH.Api.Auth` 是否存在且 request 有帶 Cookie；帳號 session 是否有效 |
| `400` 或防偽失敗 | 先看 response；區分 DTO validation 與缺 XSRF，確認登入後已更新 token |
| `403` | 目前會員角色、資源擁有者及 endpoint 權限；不要只修改前端按鈕 |
| `409` | 查詢最新餘額、庫存或流程狀態，依實際 endpoint 契約決定是否重試 |
| 有回應但沒顯示 | DTO 欄位大小寫、null、清單包裝、訂閱及畫面狀態是否一致 |

## 組員交接建議

一個功能的提交可包含 model、service、Page、需要的 Domain routes 與 app.routes 註冊。共用設定只有確實需要才修改，避免五個人同時重寫登入或 interceptor。Commit 說明頁面入口、使用的 API、必要角色、完成的操作及已知限制；API contract 改變時同步更新受影響型別與文件。

試接用 stub 不作為正式成功路徑，測試帳密不寫入程式或 commit。正式 UI 接好後移除不再需要的測試頁，保留真正可重用的 service。

相關資料：[Angular 使用者前台開發](angular-development.md)、[REST API 契約](../reference/rest-api.md)、[經濟與進程](../features/economy-progression.md)、[媒體交付設定](media-delivery.md)、[地點與地圖串接](../features/map-integration.md)。
