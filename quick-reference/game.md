# Game｜遊戲與作答

Game 分成多人主遊戲與 Mini Game。多人主遊戲保存房間、玩家、回合、作答、投票與領獎狀態；Mini Game 使用共用 Attempt 模型，四種玩法不各建一套資料表。前台必須依 API 回傳的狀態決定可用操作，不能自行判定得分、評級或獎勵。

目前 Mini Game 已具備共用的開始、完成、評級與經濟獎勵流程。完成請求會檢查分數範圍與結果 JSON 格式，但尚未逐一驗證四種玩法的實際操作內容。因此，現階段契約足以讓前台開始串接 Attempt 生命週期，不應描述為已完成完整防作弊驗證。

## 系統範圍

Game 負責遊戲房間、玩家、回合、選題、作答、投票、邀請與 Mini Game。房間與回合是可追溯的流程資料；結算可能同時影響分數、鑑定點數、鑰匙、成就或社群加碼，不能當成互不相關的單表 CRUD。

## 多人主遊戲流程

1. 建立房間後，玩家加入並形成 `GamePlayers`。
2. 每回合由伺服器選題。玩家只在允許的房間與回合狀態送出答案和投票。
3. 房間完成後，後端依資料庫設定計算獎勵，並以房間與會員識別避免重複領取。
4. 私人房間的加碼使用發起者設定的有限額度；官方活動加碼由活動規則供應，不扣管理員個人資產。

## Mini Game Attempt 流程

1. 前台呼叫 start，伺服器建立 `MiniGameAttempts`，並決定模式、文物池、難度、Seed 與 Config。
2. 前台完成玩法後送出原始分數及結果 JSON，不傳送可直接採信的 Grade、點數或鑰匙。
3. complete 目前檢查分數範圍與 JSON 格式，再由伺服器計算標準化分數、Grade、點數和鑰匙進度。四種玩法各自的操作結果驗證仍待補齊。
4. 成功結算才寫入資產流水。鑰匙進度會累積，達到後台設定門檻時轉成一把 `NORMAL` 鑰匙；未達門檻的進度保留至下次。

## 資料表與關聯

完成 Attempt 時，`rawScore` 必須介於 0～100；`rawResultJson` 可省略，有值時最多 4,000 字元，且必須是 JSON 物件或陣列。它是包含 JSON 文字的字串欄位，並非直接嵌入的物件。

相同會員重送已完成的 Attempt，且輸入通過格式檢查時，API 回傳 `200` 與 `alreadyCompleted: true`，不再次發獎。找不到該會員的 Attempt 回傳 `404`，其他不可完成狀態回傳 `409`。目前評級依送入分數和模式門檻計算，尚未根據逐玩法操作紀錄重建成績。

| 資料表或資料群 | 在此入口的用途 | 主要關聯／限制 |
| --- | --- | --- |
| `game.GameRooms` | 房間設定、主持人、狀態與時間 | `GamePlayers`、`GameRounds`、邀請與部分獎勵活動以 `RoomId` 連結；狀態轉換決定可修改欄位 |
| `game.GamePlayers` | 房間與會員的參與關係 | 以 `RoomId`、`UserId` 連到房間與會員；連線狀態不等於會員帳號狀態 |
| `game.GameRounds` | 房間內的回合、文物與回合狀態 | `RoomId` 連房間，`ArtifactId` 連 Catalog；回合狀態控制作答、投票與揭曉 |
| `game.ArtifactQuestionEntries` | 文物題庫的題型、難度與啟用設定 | `ArtifactId` 連 Catalog，唯一索引維持一件文物一筆題庫設定 |
| `game.RoundAnswers` | 每回合、每位玩家的作答結果 | 同時連到 `GameRounds` 與 `GamePlayers`；正確性與結算由伺服器判定 |
| `game.Votes` | 玩家對回合答案的投票 | 連到回合、被投票答案與投票玩家；需處理重複送出與並行更新 |
| `game.GameRoomInvitations` | 私人房間的邀請、接受與拒絕 | 連到房間、邀請人、受邀人，必要時連到獎勵活動與鑰匙定義 |
| `game.GameModeDefinitions`、`game.GameEconomySettings` | Mini Game 模式與多人遊戲共用經濟設定 | 模式代碼唯一；門檻、獎勵與數值由資料庫限制和後台規則共同決定 |
| `game.MiniGameAttempts` | Mini Game 開始、結算、成績與獎勵結果 | 連到會員、模式與可選文物；`STARTED`、`COMPLETED`、`EXPIRED` 是不同流程狀態 |
| `catalog.ArtifactUnlocks` | 遊戲回合產生的文物解鎖結果 | 以 `GameRoundId` 保存來源；不可把解鎖結果回寫成回合狀態 |

## 開發規則與跨系統界線

- 主責資料：Game 主責房間、玩家參與、回合、作答、投票、邀請、模式與結算流程。
- 可被引用：Game 從 Catalog 讀取文物與題庫設定，從 User 取得目前會員身分；結果可依既有流程寫入經濟或解鎖資料。
- 不得直接修改：Game 不直接改寫 Catalog 文物主資料、User Identity 或 Store 訂單；跨系統獎勵使用明確 Service 流程。
- 跨表流程：建立回合、送出作答、投票與結算涉及多表時，使用同一個 scoped `QmahDbContext`，必要時使用交易。
- 前台／後台：Angular 只依 API 回應顯示狀態；後台修改設定或查看歷史時依 Area、ViewModel 與授權規則處理。
- 歷史資料：已完成回合、作答、投票、獎勵與解鎖不因房間關閉、題庫停用或文物下架而刪除。

## 查詢入口

| 查詢目的 | 文件入口 | 這一頁要核對的內容 |
| --- | --- | --- |
| 確認系統責任與跨系統界線 | [Area 責任與資料界線](../architecture/area-boundaries.md) | 誰負責修改資料、哪些系統只能引用 |
| 查資料表、主鍵與外鍵 | [資料表參考](../architecture/database-reference.md) | 表格用途、主鍵、外鍵與跨 Schema 關係 |
| 查資料讀寫、交易與併發 | [資料存取與 DB-first](../architecture/data-access.md) | `QmahDbContext`、投影、追蹤、交易與並行控制 |
| 查 API 路徑、DTO 與狀態 | [REST API 契約](../reference/rest-api.md) | 路徑、DTO、驗證、狀態碼與錯誤回應 |
| 查 Angular 前台串接 | [Angular 使用者前台開發](../frontend/angular-development.md) | Route、HttpClient、Cookie、防偽與載入／錯誤狀態 |
| 查 Razor 後台串接 | [管理後台開發起點](../admin/backend-development.md) | Area、Controller、ViewModel、授權與表單處理 |
| 查功能規則與操作流程 | [經濟與進程](../features/economy-progression.md) | 本頁範圍內的狀態、輸入、流程與歷史資料規則 |
| 查來源、媒體與外部服務 | [資料與圖片使用](../features/data-and-media.md)、[媒體交付設定](../frontend/media-delivery.md)、[地點與地圖串接](../features/map-integration.md) | 來源、授權、邏輯媒體路徑與外部服務界線 |
| 查本機資料與展示狀態 | [開發資料與本機展示](../getting-started/development-data.md) | Snapshot 已提供什麼，隔離資料如何建立 |
| 查資料工具與 Snapshot | [資料工具](../reference/data-tools.md) | Seed、展示資料、匯出、版本與檔案位置 |
| 查交付與協作規則 | [Git 與 GitHub 協作](../reference/git-workflow.md) | 分支、提交、共用檔案、Review 與交付檢查 |

## 前台接手建議

- 先畫出房間、回合、作答、投票與結算的狀態轉換，再決定每個狀態顯示哪些操作。
- 第一版依 API 重新讀取狀態，不假設已有 SignalR；輪詢應集中在 service，離開頁面時停止。
- 作答、投票、邀請回應與領獎在請求完成前鎖定操作。各操作依實際回應處理衝突；重送已完成的 Mini Game 回傳 `200` 與 `alreadyCompleted: true`，主遊戲重複領獎回傳 `200` 與 `alreadyRewarded: true`，均不再次發獎。
- Mini Game 共用 Attempt 生命週期，各模式的 Config 與 raw result 轉換分開維護，評級與獎勵只顯示後端結果。
- 平行分工與跨系統確認事項見[前台功能接手指南](../frontend/feature-development-guide.md)。

## 變更前檢查

- 房間狀態、時間、人數、邀請、作答、投票與結算的正常及失敗路徑是否分開處理。
- 未登入、非房間成員、非主持人、重複作答、重複投票與重複領獎是否有對應回應。
- `RowVersion`、資料庫唯一限制與 `DbUpdateConcurrencyException` 是否一起驗證；完成資料是否禁止任意刪除。
- API DTO、OpenAPI catalog、前台畫面、管理後台、經濟規則與展示資料是否同步。
