# QMAH 資料工具參考

資料工具服務資料整合者與維護者。一般網站開發者只需要從 [QMAH-Database](https://github.com/MSIT173-03/QMAH-Database) 取得相容的 `QMAH.sql`，不必開啟本目錄的工具，也不必手動執行增量 SQL。

## 工具分工

| 工具 | 用途 |
| --- | --- |
| `NpmDataWorkbench` | 下載、整理與檢查 NPM Open Data 文物資料 |
| `QmahCatalogImport` | 將符合格式的 JSON 匯入 QMAH Catalog，支援預覽與套用 |
| `QmahDatabaseRelease` | 產生展示資料、匯出 Snapshot、還原備份與執行 Schema／資料驗證 |
| `Export-ReferenceDatabase.ps1` | 由資料庫整合者執行的單一 Snapshot Release pipeline |

工具原始碼位於 [QMAH/tools/QmahDataTools](https://github.com/MSIT173-03/QMAH/tree/main/tools/QmahDataTools)。工具輸出放在 QMAH 工作區的 `_工具輸出`，不提交到 Git。

## 完整 Snapshot 流程

1. 在隔離的 `QMAH` 資料庫完成需要交付的 Schema 與共同資料驗證。
2. 在 QMAH Repository 根目錄執行：

   ```powershell
   .\tools\QmahDataTools\Export-ReferenceDatabase.ps1 -Version 0.7.0
   ```

3. Pipeline 會建立暫時 LocalDB、還原並驗證資料、檢查 Web 啟動與資料 parity，再輸出 Release 用 `.bak`、`.sql`、checksum 與報告。
4. 驗證成功後，將完整 SQL Snapshot 更新到與 QMAH 並列的 `QMAH-Database/QMAH.sql`，同步更新 QMAH 的 `database/VERSION`、Database Repository 的 `manifest.json` 與 Git tag。

目前 exporter 寫入的是 sibling Repository 的 `QMAH-Database/QMAH.sql`。若該 Repository 不存在，腳本會在開始時直接停止，避免誤把大型 Snapshot 寫回產品程式 Repository。

## 展示資料命令

`QmahDatabaseRelease` 提供下列命令：

```text
reset-password --connection <connection> --email <email> [--password <password>] [--credentials <path>] [--backup <path>]
seed-showcase-users --connection <connection> [--credentials <path>] [--backup <path>]
generate-showcase-data --connection <connection> [--post-count <1-512>] [--order-count <1-512>] [--seed <number>]
```

`seed-showcase-users` 會建立隔離展示用會員；`generate-showcase-data` 會以穩定識別碼產生彼此有關聯的貼文、留言、訂單、付款紀錄與商品評價。命令只更新自己管理的資料，不刪除其他資料。完成後仍要透過 Snapshot pipeline 輸出可直接還原的完整 SQL，而不是要求每位組員額外執行工具。

本機展示帳號與密碼只存在於未提交的 credentials 檔案或個人密碼管理工具。不要把密碼貼入文件、Issue、Commit 或 Pull Request；遇到登入問題使用 `reset-password` 更新自己的隔離資料庫。

## 文物匯入與圖片

文物匯入的欄位、預覽 token、錯誤處理與重試規則請看 [文物資料匯入](../features/catalog-import.md)。NPM 資料來源、授權、圖片路徑與商品產生規則請看 [資料與圖片使用](../features/data-and-media.md)。匯入工具不負責把遠端圖片永久下載到產品 Repository，也不取代媒體交付設定。

## 交付邊界

- `QMAH/database/Schema.sql` 是可閱讀的結構契約。
- `QMAH/database/VERSION` 只標記主 Repository 目前相容的 Database tag。
- `QMAH-Database/QMAH.sql` 是完整 SQL Server Snapshot，包含結構、共同資料、Identity 與已驗證的展示情境。
- Snapshot 產出後，Release 的 `.sql` 與 `.bak` 必須來自同一次匯出；不可分別手動維護。
- Patch、固定 Seed 與大型 SQL 不放回 QMAH 的產品程式路徑；需要重建資料時使用工具與完整 Snapshot 流程。
