# QMAH-Docs 協作規則

## 快速理解

| 先問自己 | 文件直接回答 |
| --- | --- |
| Why（為什麼要看這頁） | 同一條規則如果分散在多頁，程式改了之後很難知道哪一段還有效。這頁先決定內容應放在哪種文件、哪一頁是正規來源，以及變更後要做哪些檢查。 |
| What（現在實際怎麼分） | `getting-started` 放上手流程，`features` 放功能規則，`architecture` 放責任與資料流，`frontend` 和 `admin` 放畫面開發，`reference` 放 API、資料工具、名詞與協作規則；同一主題只保留一頁完整定義，其他頁面連回去。 |
| How（新增或修改時怎麼走） | 先從程式、`Schema.sql`、API 或 Snapshot 找到可核對的事實，再判斷文件類型與正規頁面；只在需要的地方補連結，不複製另一份規則。完成 Markdown 後執行 `npm run lint:docs`、`npm run docs:build`，再檢查相對連結、命令、路徑與版本是否仍對得上 Repository。 |

**適用情境：** 要新增一頁、修正過時說法、把程式變更同步到文件，或要在提交前確認文件站能建置時，依本頁先找正規來源，再完成分類、連結、文字與檢查。

[QMAH 專案](https://github.com/MSIT173-03/QMAH) ｜ [QMAH-Docs 專案](https://github.com/MSIT173-03/QMAH-Docs) ｜ [QMAH-Database 專案](https://github.com/MSIT173-03/QMAH-Database) ｜ [QMAH-Docs 文件站](https://msit173-03.github.io/QMAH-Docs/)

文件以 Markdown 維護，網站由 VitePress 建置。新增或修改文件時，依內容屬於教學、操作、參考或設計說明，放入既有的六組目錄。

沒有實際內容的頁面不建立；已有規則只保留一個來源。

提交前在本 Repository 執行：

```powershell
npm ci
npm run lint:docs
npm run docs:build
```

跨 Repository 的程式、Schema 與完整 SQL Snapshot 連結，使用固定的 GitHub 或文件站網址。文件內的相對連結只指向本 Repository 仍存在的 Markdown 檔案。

API 欄位、狀態碼與資料庫結構若有衝突，核對程式與 `Schema.sql` 後，在同一個變更中修正文檔。
