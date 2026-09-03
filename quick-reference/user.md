# User｜會員與 Identity

本頁固定依「系統範圍 → 資料表與關聯 → 開發規則與跨系統界線 → 查詢入口 → 變更前檢查 → 建議查閱順序」排列。詳細欄位、狀態與操作規則以連結的正規文件為準。

## 系統範圍

User 負責 ASP.NET Core Identity 帳號與 QMAH 會員資料的連接。Email、密碼、鎖定、角色、Claim、外部登入與 Token 屬於 Identity；暱稱、簡介、地址、成就、稱號、通知與會員活動資料由 QMAH 資料模型保存。

## 資料表與關聯

| 資料表或資料群 | 在此入口的用途 | 主要關聯／限制 |
| --- | --- | --- |
| `user.AspNetUsers`、`user.AspNetRoles` | Identity 帳號、角色與登入主體 | 以 `UserManager`、`SignInManager`、`RoleManager` 管理；不直接 CRUD Identity 表 |
| `user.AspNetUserRoles`、`user.AspNetRoleClaims` | 帳號與角色及角色 Claim 的 Identity 關聯 | 由 Identity API 維護；角色關聯不等於前台畫面是否顯示按鈕 |
| `user.AspNetUserClaims`、`user.AspNetUserLogins`、`user.AspNetUserTokens` | 會員 Claim、外部登入與持久 Token | 目前 Snapshot 可為空；功能啟用後由 Identity 流程寫入 |
| `user.UserProfiles`、`user.UserAddresses` | 會員公開資料與收件地址 | Profile 以 `UserId` 一對一；地址的預設值與並行修改需依 Schema／`RowVersion` 驗證 |
| `user.Achievements`、`user.UserAchievements`、`user.EquippedTitles` | 成就定義、會員取得紀錄與目前稱號 | 成就取得是歷史資料；稱號再連到會員取得的成就 |
| `common.DailyMemberActivities` | 每日會員活動與登入歷史 | 每位會員每天每種活動類型最多一列；統計值由歷史資料計算，不直接當作固定欄位更新 |
| `social.UserNotifications` | 會員通知與已讀狀態 | 表位於 `social` Schema；更新範圍限於目前登入者 |
| `store.PointBalances`、`store.PointTransactions`、`catalog.UserKeyBalances`、`catalog.KeyTransactions` | 會員點數、鑰匙餘額與異動流水 | User 使用資產，但各資料由 Store／Catalog 流程主責；查帳以流水為準 |
| `store.UserCoupons` | 會員持有的優惠券 | 優惠券定義、使用、撤銷與批次發放有各自狀態和關聯 |

## 開發規則與跨系統界線

- 主責資料：User 主責 Identity 帳號、會員 Profile、地址、成就取得與稱號；共用活動、通知與資產依其資料表所在的流程管理。
- 可被引用：其他系統依目前登入身分或明確外鍵讀取會員資料；Game、Social、Store 不複製會員主資料。
- 不得直接修改：密碼、Token、Claim、角色、鎖定與外部登入不得交給一般表單模型，也不得直接寫 Identity 表。
- 跨表流程：Profile、地址、成就、稱號與資產同時變更時，依各自 Service 與交易邊界處理，不以修改 `AspNetUsers` 代替網站會員資料更新。
- 前台／後台：需要登入的 API 以 Cookie 工作階段判定目前會員；管理後台的授權必須由 Controller 或 Action 實際套用。
- 歷史資料：登入、成就取得、資產流水、訂單與通知紀錄不因會員畫面停用而任意刪除。

## 查詢入口

| 查詢目的 | 文件入口 | 這一頁要核對的內容 |
| --- | --- | --- |
| 確認系統責任與跨系統界線 | [Area 責任與資料界線](../architecture/area-boundaries.md) | 誰負責修改資料、哪些系統只能引用 |
| 查資料表、主鍵與外鍵 | [資料表參考](../architecture/database-reference.md) | 表格用途、主鍵、外鍵與跨 Schema 關係 |
| 查資料讀寫、交易與併發 | [資料存取與 DB-first](../architecture/data-access.md) | `QmahDbContext`、投影、追蹤、交易與並行控制 |
| 查 API 路徑、DTO 與狀態 | [REST API 契約](../reference/rest-api.md) | 路徑、DTO、驗證、狀態碼與錯誤回應 |
| 查 Angular 前台串接 | [Angular 使用者前台開發](../frontend/angular-development.md) | Route、HttpClient、Cookie、防偽與載入／錯誤狀態 |
| 查 Razor 後台串接 | [管理後台開發起點](../admin/backend-development.md) | Area、Controller、ViewModel、授權與表單處理 |
| 查功能規則與操作流程 | [Identity 與登入](../features/identity-and-login.md)、[經濟與進程](../features/economy-progression.md) | 本頁範圍內的狀態、輸入、流程與歷史資料規則 |
| 查來源、媒體與外部服務 | [資料與圖片使用](../features/data-and-media.md)、[媒體交付設定](../frontend/media-delivery.md)、[地點與地圖串接](../features/map-integration.md) | 來源、授權、邏輯媒體路徑與外部服務界線 |
| 查本機資料與展示狀態 | [開發資料與本機展示](../getting-started/development-data.md) | Snapshot 已提供什麼，隔離資料如何建立 |
| 查資料工具與 Snapshot | [資料工具](../reference/data-tools.md) | Seed、展示資料、匯出、版本與檔案位置 |
| 查交付與協作規則 | [Git 與 GitHub 協作](../reference/git-workflow.md) | 分支、提交、共用檔案、Review 與交付順序 |

## 變更前檢查

- 未登入、已登入、非本人、非 Admin、鎖定、停權與 AccessDenied 路徑是否分開驗證。
- Email、密碼、角色、Profile、地址、通知、成就與資產是否由正確 API 或資料邊界處理。
- 私人資料查詢是否以目前登入者的 `UserId` 限制；並行修改是否檢查 `RowVersion`。
- API 的 Cookie／防偽設定、前台 `credentials`、OpenAPI security metadata、Identity 設定與文件是否同步。

## 建議查閱順序

1. [Shared｜共用基礎](shared.md)：先讀共同規則與跨系統入口。
2. [開發環境與啟動](../getting-started/development-environment.md)：確認工具、服務與連線基線。
3. [開發資料與本機展示](../getting-started/development-data.md)：確認 Snapshot、資料量與展示狀態。
4. [系統架構總覽](../architecture/system-overview.md)、[Area 責任與資料界線](../architecture/area-boundaries.md)：確認 User 的責任與引用界線。
5. [資料表參考](../architecture/database-reference.md)、[資料存取與 DB-first](../architecture/data-access.md)：確認資料表、欄位與讀寫方式。
6. [Identity 與登入](../features/identity-and-login.md)、[經濟與進程](../features/economy-progression.md)：依工作目標查身分與資產規則。
7. [REST API 契約](../reference/rest-api.md)、[Angular 使用者前台開發](../frontend/angular-development.md)、[管理後台開發起點](../admin/backend-development.md)：確認對外與畫面串接。
8. [資料工具](../reference/data-tools.md)、[Git 與 GitHub 協作](../reference/git-workflow.md)：完成資料驗證與交付。
