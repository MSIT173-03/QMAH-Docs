# QMAH SSMS Diagram 建立參考

QMAH 依責任將資料表分為七張 SSMS 關聯圖，名稱與加入方式列於下方。共同 Release 會排除圖表版面，還原後可在 SSMS 自行建立；表格結構以 Schema 為準。

這一頁只處理 SSMS Diagram 的建立與閱讀。資料表用途、主鍵、外鍵和跨 Schema 關係詳見[資料表參考](database-reference.md)；Diagram 不等同於完整資料字典。

SSMS 圖表版面可存於資料庫的 `dbo.sysdiagrams`。QMAH-Database 的 `Export-ReferenceDatabase.ps1` 在隔離的交付資料庫移除這張表及相關物件，再建立 Release 備份；SQL 匯出工具也排除圖表物件。因此共同 Release 不附版面，但不能推論所有 SQL Server 備份都不含圖表。自行備份的內容取決於來源資料庫。

## Diagram 名稱與範圍

目前使用 7 張依 Schema／責任分組的圖：

```text
Diagram_User
Diagram_Catalog
Diagram_Game
Diagram_Social
Diagram_Store
Diagram_Admin
Diagram_Common
```

目前不維護共用的 `Diagram_All`。核對跨 Schema 關聯時，把關聯另一端的既有資料表加入同一張 Diagram；繪圖不新增資料表或修改 Schema。

查看資料表關聯時，在 SSMS 使用 **New Database Diagram** 建立。空白圖表不使用 SQL／CLI 預先建立，因為 SSMS 需要各自的版面定義。

使用 **Add Table...** 加入既有資料表；不使用 **New Table**，避免修改 Schema。

## 各圖加入的既有資料表

| Diagram | 表格數 | 加入的既有資料表 |
| --- | ---: | --- |
| `Diagram_User` | 12 | `user.Achievements`、`user.AspNetRoleClaims`、`user.AspNetRoles`、`user.AspNetUserClaims`、`user.AspNetUserLogins`、`user.AspNetUserRoles`、`user.AspNetUsers`、`user.AspNetUserTokens`、`user.EquippedTitles`、`user.UserAchievements`、`user.UserAddresses`、`user.UserProfiles` |
| `Diagram_Catalog` | 10 | `catalog.ArtifactCategories`、`catalog.ArtifactUnlocks`、`catalog.Artifacts`、`catalog.EraBuckets`、`catalog.KeyDefinitions`、`catalog.KeyExchangeRules`、`catalog.KeyProgressBalances`、`catalog.KeyProgressTransactions`、`catalog.KeyTransactions`、`catalog.UserKeyBalances` |
| `Diagram_Game` | 10 | `game.ArtifactQuestionEntries`、`game.GameEconomySettings`、`game.GameModeDefinitions`、`game.GamePlayers`、`game.GameRoomInvitations`、`game.GameRooms`、`game.GameRounds`、`game.MiniGameAttempts`、`game.RoundAnswers`、`game.Votes` |
| `Diagram_Social` | 8 | `social.ContentReports`、`social.EventRegistrations`、`social.Events`、`social.OfficialAnnouncements`、`social.SocialComments`、`social.SocialPosts`、`social.UserNotifications`、`social.MediaAssets` |
| `Diagram_Store` | 10 | `store.CartItems`、`store.CouponDefinitions`、`store.OrderDetails`、`store.Payments`、`store.PointBalances`、`store.PointTransactions`、`store.ProductReviews`、`store.Products`、`store.StoreOrders`、`store.UserCoupons` |
| `Diagram_Admin` | 3 | `admin.AuditLogs`、`admin.CommunityRewardCampaigns`、`admin.EconomyAdjustmentBatches` |
| `Diagram_Common` | 1 | `common.DailyMemberActivities` |

7 張圖合計 54 張 `Schema.sql` 定義的資料表。這是建議加入清單，不代表還原 Snapshot 後資料庫已經存在同名 Diagram。

## 閱讀方式

- 圖中的連線只代表 SQL Server 已定義的外鍵；沒有畫線的相同名稱欄位，不構成關聯依據。
- `store.Products.ArtifactId` 已設定唯一且可為空的外鍵，直接連到 `catalog.Artifacts.Id`。查看這條跨 Schema 關聯時，在同一張自建 Diagram 同時加入兩張表。
- `game.ArtifactQuestionEntries.ArtifactId` 也以唯一索引和外鍵連到 `catalog.Artifacts.Id`；題庫資料仍由 Game 流程負責，文物主資料由 Catalog 負責。
- 各 Schema Diagram 以對應資料表為主；需要確認跨模組關聯時，再把關聯另一端的資料表一併加入，不必修改 Schema。
- `social.ContentReports` 的 `TargetType`／`TargetId` 是多型目標欄位，不會由 SSMS 自動畫出貼文或留言連線；處理檢舉時要由程式依目標類型重新查驗。
- SSMS 首次使用 Diagram 會建立 `dbo.sysdiagrams` 與圖表用預存程序。這些是 SSMS 的版面中繼資料，不屬於 QMAH 的業務 Schema，也不加入任何 Diagram。

## Diagram 變更前檢查

1. 確認目前連線的是要查看的 `QMAH` 資料庫，不是 `master` 或其他本機副本。
2. 使用 **Add Table...** 加入既有資料表，儲存 Diagram 後，再依跨 Schema 關聯補入另一端。
3. 若 SSMS 要求建立 Diagram 支援物件，確認建立的是 `dbo.sysdiagrams` 等版面中繼資料；該物件不列為 QMAH 業務表。
4. 若圖表顯示的欄位或外鍵與文件不同，回到 `Schema.sql`、`QmahDbContext` 與資料庫實際結構核對；修正來源結構後重新產生版面，不直接在圖上修改關係。
