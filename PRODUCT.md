# QMAH-Docs

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

文件涵蓋開發環境、Angular 使用者前台、Razor 管理後台、五個功能系統與 SQL Server Snapshot。所有頁面使用中性說明，不預設讀者的身分或工具。

## Product Purpose

QMAH-Docs 集中 QMAH 的環境、架構、API、前端、管理後台、功能與資料工具規則。文件提供依序閱讀的目錄，也提供六個系統快速查詢頁；Snapshot 交付規則放在資料工具與開發資料文件中。

## Positioning

文件直接對齊 QMAH 的 DB-first 契約、三個 Repository 的責任與可執行流程。操作指南、API 參考與資料庫 Snapshot 各有正規來源，其他頁面以連結引用。

## Operating Context

文件可從 GitHub Repository、QMAH-Docs GitHub Pages 或 IDE 連結開啟。內容需支援桌面與窄螢幕閱讀；執行命令時會用到 QMAH、QMAH-Docs 與 QMAH-Database。文件由 Markdown 維護、以 VitePress 建置，並以 `markdownlint-cli2` 檢查。

## Capabilities and Constraints

- 文件網站固定使用 VitePress，部署目標是 `https://msit173-03.github.io/QMAH-Docs/`。
- 文件固定使用繁體中文，技術名稱、命令、路徑、API 與 SQL 識別字保留原文。
- 正式文件分成開始開發、架構、前端、管理後台、功能與參考六組；同一主題只保留一個 canonical 頁面。
- QMAH 主 Repository 只保留 `Schema.sql` 與 Snapshot 版本標記；完整 `QMAH.sql` 由 QMAH-Database 管理。
- 不能虛構 API、資料、帳密、客戶、效能或產品功能；文件中的命令與路徑要能回到 Repository 證據。

## Brand Commitments

已確認的產品名稱是「QMAH｜清明鑑定屋」，名稱來源為《清明上河圖》。文件不把名稱延伸為產品功能宣稱，文字採易懂但不失專業的語氣。

QMAH 既有 logo 與 mark 位於產品 Repository 的 `QMAH.Web/wwwroot/images/brand/`。文件站沿用該識別，不另造產品名稱或品牌故事。

## Evidence on Hand

- QMAH 程式 Repository：`https://github.com/MSIT173-03/QMAH`
- QMAH-Database Snapshot：`db-v0.7.0`、`QMAH.sql` 與 `manifest.json`
- 現有 Markdown 文件、`Schema.sql`、資料工具與 launch 設定
- 無已提供的客戶見證、商業數據或可新增的真實照片素材；不在文件站製造這些證據。

## Product Principles

- 先說明要完成的工作，再補充必要背景。
- 將規則的唯一責任放在一個頁面，其他頁面只做有目的的交叉連結。
- 以真實 Repository、命令與資料契約支撐文件，不用漂亮但不可驗證的宣稱。
- 讓搜尋、側欄、頁內標題與跨 Repository 導覽互相一致。

## Accessibility & Inclusion

文件站需支援鍵盤導覽、清楚的 focus 狀態、可讀的色彩對比、窄螢幕閱讀、語意標題層級與不依賴色彩的狀態辨識。程式碼、表格與 Mermaid 圖都要保留可讀的文字替代途徑。
