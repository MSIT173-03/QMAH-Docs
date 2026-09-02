# Game｜遊戲與作答系統

本頁列出 Game 的房間生命週期、回合資料、作答、投票、API、管理後台與經濟系統連接點。詳細狀態與欄位以連結的文件為準。

## 範圍

Game 管理房間、玩家、回合、題目、作答與投票。房間與回合屬於可追溯的流程資料；結算可能同時影響分數、鑑定點數、鑰匙或社群加碼，不能視為互不相關的單表 CRUD。

## 查詢入口

| 查詢目的 | 正規文件 | 需要確認的內容 |
| --- | --- | --- |
| 確認 Game 的資料責任 | [Area 責任與資料界線](../architecture/area-boundaries.md) | 房間狀態、玩家、回合與結算邊界 |
| 查詢表格與外鍵 | [資料庫 Diagram 對照](../architecture/database-diagram.md) | `game` 與 `catalog`、`user` 的關聯 |
| 查詢 API 與回應 | [REST API 契約](../reference/rest-api.md) | 房間、回合、作答、投票、邀請與獎勵端點 |
| 查詢點數與鑰匙影響 | [經濟與進程](../features/economy-progression.md) | 遊戲結果、加碼、鑰匙與成就的規則 |
| 查詢前台串接方式 | [Angular 使用者前台開發](../frontend/angular-development.md) | DTO、登入 Cookie、載入與錯誤狀態 |
| 查詢管理後台實作 | [管理後台開發起點](../admin/backend-development.md) | Area、ViewModel、授權與 CRUD 起點 |
| 查本機展示狀態 | [開發資料與本機展示](../getting-started/development-data.md) | 房間、回合、作答與狀態資料 |

## 資料關係

| 資料 | 主要用途 | 變更注意事項 |
| --- | --- | --- |
| `game.GameRooms` | 房間設定、主持人、狀態與時間 | 狀態轉換決定可修改欄位 |
| `game.GamePlayers` | 房間與會員的關聯 | `UserId` 由登入身分或既有玩家關係決定 |
| `game.GameRounds` | 房間內的回合與出題資料 | 已完成回合需保留歷史 |
| `game.RoundAnswers` | 每回合作答結果 | 不由前端直接判定正確性 |
| `game.Votes` | 回合或答案的投票資料 | 需處理重複送出與並行更新 |
| `game.ArtifactQuestionEntries` | 文物的題庫設定 | 由 Catalog 提供文物對應 |

## 流程與邊界

- `WAITING`、`PLAYING`、`COMPLETED`、`CANCELLED` 是房間生命週期的一部分；狀態值與時間欄位需一起驗證。
- 房間、玩家、回合、作答與投票含有並行更新風險，`RowVersion` 只作並行檢查，不作一般表單欄位。
- 結算流程若寫入兩張以上資料表，應使用同一個 scoped `QmahDbContext`，並在必要時使用交易。
- Angular 顯示結果只能依 API 回應；答案正確性、結算狀態、玩家權限與獎勵由伺服器決定。
- Game 需要會員與文物資料時，分別依 User 與 Catalog 的資料界線引用，不直接修改對方的主資料。

## 變更前檢查

- 狀態轉換、時間限制、人數限制、邀請與結算的正常及失敗路徑是否清楚。
- 未登入、非房間成員、非主持人、重複作答、重複投票與重複領獎是否有對應回應。
- 同時修改時是否捕捉 `DbUpdateConcurrencyException`，完成資料是否禁止任意刪除。
- API 的 DTO、OpenAPI catalog、前台畫面與展示資料是否同步。

## 建議查閱順序

1. [系統架構總覽](../architecture/system-overview.md)
2. [Area 責任與資料界線](../architecture/area-boundaries.md)
3. [REST API 契約](../reference/rest-api.md)
4. [經濟與進程](../features/economy-progression.md)
