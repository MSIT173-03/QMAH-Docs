# User｜會員與 Identity 系統

本頁列出 Identity 帳號、會員資料、登入、地址、通知、成就與會員資產的查詢入口。Identity API、資料庫欄位與前台私人資料各有不同責任，詳細規則以連結的文件為準。

## 範圍

User 管理 ASP.NET Core Identity 帳號與 QMAH 會員資料的連接。Email、密碼、鎖定、角色與外部登入屬於 Identity；暱稱、簡介、地址、成就、通知與會員活動資料由 QMAH 資料模型保存。

## 查詢入口

| 查詢目的 | 正規文件 | 需要確認的內容 |
| --- | --- | --- |
| 查登入、登出與角色 | [Identity 與登入](../features/identity-and-login.md) | Cookie、`UserManager`、授權與 Identity 邊界 |
| 查會員資料關聯 | [資料庫 Diagram 對照](../architecture/database-diagram.md) | `user` 表與其他系統外鍵 |
| 查目前會員 API | [REST API 契約](../reference/rest-api.md) | account、`/me/*`、資產與個人資料端點 |
| 查資料讀寫方式 | [資料存取與 DB-first](../architecture/data-access.md) | Identity API 與 `QmahDbContext` 的分工 |
| 查點數、鑰匙、優惠券與成就 | [經濟與進程](../features/economy-progression.md) | 會員資產流水、兌換與歷史規則 |
| 查地址與地圖顯示 | [地點與地圖串接](../features/map-integration.md) | 地址文字、座標與個人資料限制 |
| 查本機帳號與展示資料 | [開發資料與本機展示](../getting-started/development-data.md) | Snapshot 內容與隔離資料規則 |

## 資料關係

| 資料 | 主要用途 | 變更注意事項 |
| --- | --- | --- |
| `user.AspNetUsers`、`user.AspNetRoles` | Identity 帳號與角色 | 以 Identity API 管理，不直接 CRUD |
| `user.AspNetUserLogins` | 外部登入連結 | 由 Identity provider 流程管理 |
| `user.UserProfiles` | 暱稱、簡介等網站會員資料 | 使用專用 ViewModel 與 `RowVersion` |
| `user.UserAddresses` | 會員地址與預設地址 | 預設地址唯一規則需保留 |
| `user.UserAchievements`、`user.Achievements` | 成就與稱號 | 依既有資產／進程規則更新 |
| `social.UserNotifications` | 會員通知 | 只更新目前資料擁有範圍 |

## 流程與邊界

- 登入成功後以 Cookie 保存狀態；需要登入的 API 使用目前工作階段，不以 request body 的 `UserId` 切換私人資料。
- `UserManager`、`SignInManager`、`RoleManager` 負責 Identity 操作；Profile、地址與網站資料使用 `QmahDbContext`。
- 受保護的 Controller 或 Action 必須實際套用 `[Authorize]`；只在 View 隱藏按鈕不構成授權。
- 密碼、Token、Claim、角色與鎖定欄位不得交給一般表單模型，也不得直接寫入 Identity 資料表。
- Game、Social、Store 需要會員資料時，依目前登入身分或明確外鍵讀取，不複製會員主資料。

## 變更前檢查

- 未登入、已登入、非本人、非 Admin、鎖定與 AccessDenied 路徑是否分開驗證。
- Email、密碼、角色、Profile、地址、通知與資產是否由正確 API 或資料邊界處理。
- 私人資料查詢是否以目前登入者的 UserId 限制；並行修改是否檢查 `RowVersion`。
- API 的 Cookie／防偽設定、前台 `credentials`、OpenAPI security metadata 與文件是否同步。

## 建議查閱順序

1. [Identity 與登入](../features/identity-and-login.md)
2. [REST API 契約](../reference/rest-api.md)
3. [資料存取與 DB-first](../architecture/data-access.md)
4. [經濟與進程](../features/economy-progression.md)
