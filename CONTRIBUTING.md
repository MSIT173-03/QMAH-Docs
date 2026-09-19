# QMAH-Docs 協作規則

`getting-started` 放上手流程，`features` 放功能規則，`architecture` 放責任與資料流，`frontend` 和 `admin` 放畫面開發，`reference` 放 API、資料工具、名詞與協作規則；同一主題只保留一頁完整定義，其他頁面連回去。

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
