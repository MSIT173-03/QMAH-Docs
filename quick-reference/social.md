# Social｜社群與活動

## 快速理解

| 先問自己 | 文件直接回答 |
| --- | --- |
| Why（為什麼要看這頁） | 貼文、留言、檢舉、活動、報名、邀請和通知會互相連結，但它們的狀態和可操作角色不同。把活動報名當成貼文欄位，或把邀請成功直接當成遊戲完成，會讓後續權限和資產處理失去依據。 |
| What（現在實際怎麼運作） | Social 保存 `SocialPosts`、`SocialComments`、`ContentReports`、`Events`、`EventRegistrations`、`UserNotifications` 與媒體資料；地址文字和可選座標供顯示／選點，地圖服務不取代活動或貼文資料。私人房間邀請、活動加碼與點數／鑰匙結果分別連到 Game 或資產流水。 |
| How（要查或開發一個社群流程怎麼走） | 先確認是內容、活動、報名、邀請、通知還是地點，再查該資料的狀態、操作者和主責表；接著依 API 或後台契約處理建立、審核、接受、取消或結束。若流程涉及加碼或獎勵，最後回查發起者／官方活動來源、資產扣除或發放流水，以及參與者看到的狀態。 |

**適用情境：** 需要處理貼文、留言、檢舉、活動報名、通知、地點或活動加碼時，先用本頁分清內容狀態和參與狀態；如果結果會影響遊戲或資產，沿資料關聯回查 Game 與流水規則。

## 快速查閱

| 查閱目的 | 入口 |
| --- | --- |
| 先理解怎麼運作 | [貼文、活動、報名、邀請及加碼](../getting-started/system-walkthrough.md#社群：內容、活動與加碼分開查) |
| 查資產增減與管理員 | [加鑰匙實例與查帳](../getting-started/system-walkthrough.md#第三步：看一次加鑰匙的完整例子) |
| 查請求如何進入服務 | [應用程式啟動與共用服務](../architecture/runtime-and-shared-services.md) |

## 系統範圍

Social 負責貼文、公告貼文、留言與回覆、檢舉、活動、活動報名、通知及社群媒體。內容作者、管理權限、發布狀態與歷史保留是不同責任，不能只由畫面是否顯示按鈕來判斷。

## 實際運作方式

會員建立貼文或活動時，Controller 驗證目前登入者，Service 保存內容、地點與媒體關聯；公開查詢再依發布及審核狀態過濾。留言以父留言形成回覆串，檢舉只保存目標類型與識別，審核時重新確認目標仍存在。活動報名或遊戲邀請可連到共用加碼 Campaign，結算時才由獎勵服務判斷官方供應或會員預付額度，並把實際資產異動寫入流水。

## 資料表與關聯

| 資料表或資料群 | 在此入口的用途 | 主要關聯／限制 |
| --- | --- | --- |
| `social.SocialPosts` | 一般貼文與公告貼文 | 連到會員、可選文物與活動；發布狀態決定公開查詢範圍 |
| `social.SocialComments` | 貼文留言與回覆 | `PostId` 連貼文，`ParentCommentId` 形成同表父子關係；狀態與貼文分開保存 |
| `social.ContentReports` | 貼文或留言的檢舉與處理結果 | `TargetType`、`TargetId` 指向業務目標；檢舉人與處理人另以會員外鍵保存 |
| `social.Events`、`social.EventRegistrations` | 活動審核、發布、報名與出席 | 活動連建立者與審核者；報名連活動、會員與可選獎勵規則 |
| `social.OfficialAnnouncements` | 舊公告資料的結構相容表 | 新公告使用 `SocialPosts` 的公告貼文類型；兩種模型不作為同一筆資料重複寫入 |
| `social.UserNotifications` | 會員通知與已讀狀態 | 只更新目前會員可管理的通知；通知由事件流程產生 |
| `social.MediaAssets` | 社群圖片中繼資料、替代文字與貼文關聯 | 連到貼文與擁有者；實際網址由媒體 Resolver 解析 |
| `catalog.Artifacts`、`user.AspNetUsers` | 貼文的文物與作者引用 | Social 只保存明確外鍵或識別，不擁有文物與 Identity 主資料 |

## 開發規則與跨系統界線

- 主責資料：Social 主責貼文、留言、回覆、檢舉、活動、報名、通知與社群媒體的流程狀態。
- 可被引用：Social 可用 `ArtifactId` 連到 Catalog，也可依目前登入者和明確外鍵讀取 User；活動獎勵依既有跨系統流程處理。
- 不得直接修改：其他 Area 不直接改寫 Social 的審核、發布、留言或檢舉狀態；管理操作需經實際授權 Action。
- 跨表流程：發布活動、報名、內容處理與媒體刪除涉及多個狀態或資料列時，說明交易、重複請求與歷史保留方式。
- 前台／後台：Angular 依 API DTO 呈現可見狀態；Razor 後台在 Social Area 或共用管理介面處理審核與營運操作。
- 歷史資料：已發布、隱藏、刪除、已處理的內容與活動紀錄不以實體刪除取代狀態流程。

## 查詢入口

| 查詢目的 | 文件入口 | 這一頁要核對的內容 |
| --- | --- | --- |
| 確認系統責任與跨系統界線 | [Area 責任與資料界線](../architecture/area-boundaries.md) | 誰負責修改資料、哪些系統只能引用 |
| 查資料表、主鍵與外鍵 | [資料表參考](../architecture/database-reference.md) | 表格用途、主鍵、外鍵與跨 Schema 關係 |
| 查資料讀寫、交易與併發 | [資料存取與 DB-first](../architecture/data-access.md) | `QmahDbContext`、投影、追蹤、交易與並行控制 |
| 查 API 路徑、DTO 與狀態 | [REST API 契約](../reference/rest-api.md) | 路徑、DTO、驗證、狀態碼與錯誤回應 |
| 查 Angular 前台串接 | [Angular 使用者前台開發](../frontend/angular-development.md) | Route、HttpClient、Cookie、防偽與載入／錯誤狀態 |
| 查 Razor 後台串接 | [管理後台開發起點](../admin/backend-development.md) | Area、Controller、ViewModel、授權與表單處理 |
| 查功能規則與操作流程 | [地點與地圖串接](../features/map-integration.md)、[資料與圖片使用](../features/data-and-media.md) | 本頁範圍內的狀態、輸入、流程與歷史資料規則 |
| 查來源、媒體與外部服務 | [資料與圖片使用](../features/data-and-media.md)、[媒體交付設定](../frontend/media-delivery.md)、[地點與地圖串接](../features/map-integration.md) | 來源、授權、邏輯媒體路徑與外部服務界線 |
| 查本機資料與展示狀態 | [開發資料與本機展示](../getting-started/development-data.md) | Snapshot 已提供什麼，隔離資料如何建立 |
| 查資料工具與 Snapshot | [資料工具](../reference/data-tools.md) | Seed、展示資料、匯出、版本與檔案位置 |
| 查交付與協作規則 | [Git 與 GitHub 協作](../reference/git-workflow.md) | 分支、提交、共用檔案、Review 與交付檢查 |

## 前台接手建議

- 貼文、活動、留言、報名與檢舉可分開實作；共用會員身分、內容 ID 與發布狀態。
- 發文圖片先呼叫媒體上傳取得 ID，再把 ID 送進建立貼文 request；媒體上傳成功不等於貼文已發布。
- 留言回覆以 `ParentCommentId` 建立關係，不從畫面縮排或文字內容推算父留言。
- 活動報名後重新使用 API 結果更新名額與會員狀態；地點依座標或文字決定定位與搜尋行為。
- 平行分工與跨系統確認事項見[前台功能接手指南](../frontend/feature-development-guide.md)。

## 變更前檢查

- 作者、管理權限、公開狀態、檢舉處理、留言樹與歷史保留是否各有明確 Action。
- 活動審核、發布、開始結束、報名截止、人數上限、重複報名與出席狀態是否分開驗證。
- 使用者輸入是否以純文字安全呈現；外部連結、新分頁、媒體替代文字與 `413` 回應是否同步。
- API、資料庫限制、媒體 Resolver、管理後台、前台顯示與展示資料是否同步。

## 後續查閱

以下是查文件的路線，不是系統實作先後。

1. [Shared｜共用基礎](shared.md)：先讀共同規則與跨系統入口。
2. [開發環境與啟動](../getting-started/development-environment.md)：確認工具、服務與連線基線。
3. [開發資料與本機展示](../getting-started/development-data.md)：確認 Snapshot、資料量與展示狀態。
4. [系統架構總覽](../architecture/system-overview.md)、[Area 責任與資料界線](../architecture/area-boundaries.md)：確認 Social 的責任與引用界線。
5. [資料表參考](../architecture/database-reference.md)、[資料存取與 DB-first](../architecture/data-access.md)：確認資料表、欄位與讀寫方式。
6. [地點與地圖串接](../features/map-integration.md)、[資料與圖片使用](../features/data-and-media.md)：依工作目標查外部服務與內容規則。
7. [REST API 契約](../reference/rest-api.md)、[Angular 使用者前台開發](../frontend/angular-development.md)、[管理後台開發起點](../admin/backend-development.md)：確認對外與畫面串接。
8. [資料工具](../reference/data-tools.md)、[Git 與 GitHub 協作](../reference/git-workflow.md)：完成資料驗證與交付。
