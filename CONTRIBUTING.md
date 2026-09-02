# QMAH-Docs 協作規則

[QMAH 專案](https://github.com/MSIT173-03/QMAH) ｜ [QMAH-Docs 專案](https://github.com/MSIT173-03/QMAH-Docs) ｜ [QMAH-Database 專案](https://github.com/MSIT173-03/QMAH-Database) ｜ [QMAH-Docs 文件站](https://msit173-03.github.io/QMAH-Docs/)

文件以 Markdown 維護，網站由 VitePress 建置。新增或修改文件時，先判斷內容主要是教學、操作、參考或設計說明，再放入既有的六組目錄；不要為了目錄完整而建立沒有內容的頁面，也不要複製另一份相同規則。

提交前在本 Repository 執行：

```powershell
npm ci
npm run lint:docs
npm run docs:build
```

跨 Repository 的程式、Schema 與完整 SQL Snapshot 連結，請使用固定的 GitHub 或文件站網址；文件內的相對連結只指向本 Repository 仍存在的 Markdown 檔案。API 欄位、狀態碼與資料庫結構若有衝突，先核對程式與 `Schema.sql`，再在同一個變更中修正文檔。
