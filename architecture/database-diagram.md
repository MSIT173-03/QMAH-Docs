# QMAH SSMS Diagram 建立參考

SSMS Diagram 只保存資料表關聯的版面，不屬於 QMAH 資料庫結構；參考 `.bak` 與完整 `.sql` 也不包含 Diagram。需要查看關聯時，在指定的 `QMAH` 資料庫建立 Diagram 即可，這不會改變資料表設計。

## Diagram 名稱

```text
Diagram_Catalog
Diagram_Game
Diagram_User
Diagram_Social
Diagram_Store
Diagram_Admin
```

目前不維護共用的 `Diagram_All` 或模組 Diagram。

查看資料表關聯時，在 SSMS 使用 **New Database Diagram** 建立。不要用 SQL／CLI 預先建立空白圖表，因為 SSMS 需要各自的版面定義。

使用 **Add Table...** 加入既有資料表，不要使用 **New Table**，避免修改 Schema。

## 各模組表格

| Diagram | 表格數 | 加入的既有資料表 |
| --- | ---: | --- |
| `Diagram_User` | 11 | `user.Achievements`、`user.AspNetRoleClaims`、`user.AspNetRoles`、`user.AspNetUserClaims`、`user.AspNetUserLogins`、`user.AspNetUserRoles`、`user.AspNetUsers`、`user.AspNetUserTokens`、`user.UserAchievements`、`user.UserAddresses`、`user.UserProfiles` |
| `Diagram_Catalog` | 7 | `catalog.ArtifactCategories`、`catalog.Artifacts`、`catalog.ArtifactUnlocks`、`catalog.EraBuckets`、`catalog.KeyDefinitions`、`catalog.KeyTransactions`、`catalog.UserKeyBalances` |
| `Diagram_Game` | 6 | `game.ArtifactQuestionEntries`、`game.GamePlayers`、`game.GameRooms`、`game.GameRounds`、`game.RoundAnswers`、`game.Votes` |
| `Diagram_Social` | 8 | `social.ContentReports`、`social.EventRegistrations`、`social.Events`、`social.OfficialAnnouncements`、`social.SocialComments`、`social.SocialPosts`、`social.UserNotifications`、`social.MediaAssets` |
| `Diagram_Store` | 10 | `store.CartItems`、`store.CouponDefinitions`、`store.OrderDetails`、`store.Payments`、`store.PointBalances`、`store.PointTransactions`、`store.ProductReviews`、`store.Products`、`store.StoreOrders`、`store.UserCoupons` |
| `Diagram_Admin` | 1 | `admin.AuditLogs` |

六組合計 43 張業務／Identity 資料表。上表只是依功能分組的選取清單，不代表資料庫內已經存在同名 Diagram。

## 閱讀方式

- 圖中的連線只代表 SQL Server 已定義的外鍵。
- `store.Products.ArtifactId` 已設定唯一且可為空的外鍵，直接連到 `catalog.Artifacts.Id`。若要查看這條跨 Schema 關聯，請在同一張自建 Diagram 同時加入兩張表。
- 各 Area Diagram 以對應資料表為主；需要確認跨模組關聯時，再把關聯另一端的資料表一併加入，不必修改 Schema。
- 其他沒有外鍵的跨模組識別欄位（例如部分 `UserId`）不會由 SSMS 自動畫出連線；這不代表欄位沒有業務用途。
- SSMS 首次使用 Diagram 會建立 `dbo.sysdiagrams` 與圖表用預存程序。這些是 SSMS 的版面中繼資料，不屬於 QMAH 的業務 Schema，也不加入任何 Diagram。
