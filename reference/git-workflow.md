# Git 與 GitHub 協作手冊

`QMAH` 管產品程式與 `Schema.sql`，`QMAH-Docs` 管 Markdown／VitePress 文件站，`QMAH-Database` 管完整資料 Snapshot；五個功能系統與營運中心可在各自 feature branch 平行開發，整合共同分支時仍要核對資料與文件。

QMAH 使用單一 Public Repository。五個 Area 各使用固定 feature branch，完成可驗證階段後整合至 `develop`；展示或發布版本由 `develop` 合併至 `main`。

Repository：<https://github.com/MSIT173-03/QMAH>

## 權限

加入 `MSIT173-03` 組織不會自動取得此 Repository 的 `Write` 權限。目前先以 `Read` 為預設；需要直接 Push 指定的 feature branch 時，`Write` 權限需由 Repository 管理員另外授予。

加入組織後可以 Clone、Pull、建立 Pull Request 與檢視 GitHub Actions。取得此 Repository 的 `Write` 權限後，才可以直接 Push 對應的 `feature/*` 分支。

日常 Push 依分支權限進行。`Write` 不包含刪除 Repository、修改敏感設定或管理組織的權限。

若加入組織後仍無法 Clone 或 Push，確認 GitHub 組織邀請已接受，而且 Visual Studio 登入的是同一個帳號。

## Branch Protection

Repository 採 Public，以使用 GitHub Free 組織的 Branch Protection。保護只套用共同分支，不影響 feature branch 的日常 Push。

目前遠端設定（2026-09-02 查核）：

| 分支 | Required status checks | force push | 刪除 |
| --- | --- | --- | --- |
| `main` | 未啟用 | 禁止 | 禁止 |
| `develop` | 未啟用 | 允許 | 允許 |

上表是 GitHub Settings 的現況，不是尚未啟用的目標政策。功能變更不直接修改 `main` 或 `develop`，整合共同分支時透過 PR 留下變更紀錄。

整合共同分支前，先確認提交內容、變更範圍與驗證結果。`main` 禁止 force push 與刪除；`develop` 目前允許兩者。

目前 `Build` workflow 只有 `workflow_dispatch` 觸發，建立 PR 不會自動執行，且 `Build` 尚未列為共同分支的必要 status check。

若要把 `Build` 設為合併門檻，需由 Repository 管理者在 GitHub Settings 的 Branch protection rules／Rulesets 啟用對應的 workflow 觸發方式與必要檢查。相關設定完成前，文件不把它描述成已存在的保護條件。

## 分支用途

| 分支 | 用途 |
| --- | --- |
| `main` | 可展示、可發布的整合版本 |
| `develop` | 已整合、待展示驗證的共同版本 |
| `feature/game` | 遊戲模組 |
| `feature/catalog` | 圖鑑模組 |
| `feature/social` | 社群模組 |
| `feature/user` | 會員模組 |
| `feature/store` | 商城模組 |

一般功能不直接在 `main` 或 `develop` 修改。

## 第一次 Clone

在 Visual Studio 選擇 **Clone a repository**：

1. 輸入 `https://github.com/MSIT173-03/QMAH.git`。
2. 選擇本機資料夾並完成 Clone。
3. 開啟 `QMAH.sln`。
4. 在 Git 分支選單切到對應的 Area 分支。
5. 依 README 從 QMAH-Database 取得相容的 `QMAH.sql`，或使用同版本且已驗證的 `.bak`。

Visual Studio 檔案旁的藍色鎖通常表示「檔案目前沒有本機修改」，不是唯讀，也不代表沒有權限。

## 每次開始與結束

```text
Pull → 修改 → 本機驗證 → Commit → Push → Pull Request → develop
```

開始前的檢查：

1. 確認目前位於對應的 feature branch。
2. Pull 遠端同分支。
3. 取得團隊目前指定的共同分支內容並處理衝突；平時以 `develop` 為整合分支，團隊通知直接同步最新展示版時則使用 `origin/main`。
4. 再開始修改。

完成一個可驗證階段後：

1. 在 Git Changes 逐一查看變更。
2. 確認沒有密碼、個人設定、raw、快取、`bin`、`obj` 或 `.bak`。
3. 本機建置並操作受影響頁面。
4. Commit、Push 對應的 feature branch。
5. 建立 `feature/<area> → develop` 的 Pull Request。

展示前，建立 `develop → main` Pull Request 留下展示版本紀錄；確認提交內容與 Build 結果後即可合併。

## Visual Studio：保留本機修改並同步最新 main

存在「未認可變更」時不直接切換分支或 Pull。可先將目前進度 Commit 到對應分支，再把 `origin/main` 合併進來：

1. 看 Visual Studio 右下角的分支名稱，確認目前在對應的 `feature/<area>`，不是 `main`。
2. 開啟 **檢視 → Git 變更**，檢查檔案後輸入訊息並選 **認可全部**（Commit All）。功能尚未完成也可以先做進度 Commit。
3. 可選 **推送**（Push），將對應分支備份到 GitHub。
4. 選 **Git → 擷取**（Fetch）。Fetch 只更新遠端分支資訊，不會修改目前檔案。
5. 開啟 **檢視 → Git 存放庫**，展開 **遠端 → origin**，對 `origin/main` 按右鍵，選 **合併至目前分支**（Merge into Current Branch）。操作期間維持在工作分支。
6. 若出現衝突，逐檔比較「目前內容」與「傳入內容」。不對所有檔案直接選「全部接受目前」或「全部接受傳入」。
7. 衝突處理完成後執行 **建置 → 建置方案**，再認可合併結果並 Push 對應分支。

簡化順序：

```text
確認目前位於工作分支
→ Commit 本次修改
→ Push 備份
→ Fetch
→ 將 origin/main 合併至目前分支
→ 處理衝突
→ Build
→ Commit 並 Push
```

同步後要確認 Area 的 `Views/_ViewStart.cshtml` 仍指定：

```html
@{
    Layout = "/Views/Shared/Admin/_AdminLayout.cshtml";
}
```

Scaffold 產生的完整 View 若包含 `Layout = null`，移除該設定，否則會覆蓋 `_ViewStart.cshtml`。

### 不熟悉衝突時的外部備份方案

若目前不處理 Git 衝突，可先把新增或修改的 Controller、ViewModel、View 與相關檔案複製到 Repository 外，保留原本資料夾結構；原分支仍可 Commit 並 Push，作為可恢復的備份。

接著 Fetch，從最新的 `origin/main` 建立另一個功能分支，再只將原分支的功能檔案複製回正確位置並 Build。整個舊 Area 不覆蓋新版，舊的 `_ViewStart.cshtml` 也不複製回去，避免移除 main 已加入的共用設定或覆蓋其他變更。

這種方式較容易理解，但有漏檔與蓋掉新內容的風險。正常情況仍優先使用 Merge，只有不確定如何處理衝突時才使用外部備份方案。

## Commit

一個 Commit 對應一項容易理解的改動：

```text
feat(catalog): 新增文物清單頁面
fix(store): 修正購物車數量驗證
docs: 補充資料庫還原步驟
refactor(game): 整理回合作答查詢
```

不每改一行就 Commit，也不把互不相關的數日工作塞進同一筆 Commit。

共同開發已開始後，不再清除 Git 歷史。不使用 force push、`git reset --hard` 覆蓋共同分支，也不刪除別人的 Commit。

## Pull Request

PR 要寫清楚：

- 做了什麼功能或修正。
- 影響哪個 Area、網址與資料表。
- 如何操作與驗證。
- 是否修改共用檔案。
- 是否影響 Schema、資料或圖片。
- 尚未完成或已知限制。

需要驗證時，在具備 Actions 權限的環境手動執行 `Build`；建立 PR 不會自動啟動工作流程：

```powershell
dotnet restore QMAH.sln --locked-mode
dotnet build QMAH.sln --no-restore --configuration Release
```

`Build` 失敗時先查看 Log 並修正，再合併。工作流程不會部署網站，也不會連線或修改 QMAH 資料庫。

## 共用檔案與 CODEOWNERS

下列檔案會同時影響多個模組：

- `QMAH.Web/Program.cs`
- `QMAH.Infrastructure/Data/`
- `QMAH.Infrastructure/Models/Entities/` 與 `QMAH.Infrastructure/Models/Identity/`
- `database/`
- `QMAH.Web/Views/Shared/`
- `QMAH.Web/wwwroot/css/site.css` 與 `wwwroot/js/site.js`
- `QMAH.Web/QMAH.Web.csproj` 與 `packages.lock.json`
- `.github/`、README 與共同文件

修改前先在群組說明目的與影響範圍。CODEOWNERS 只會自動通知檢視，不會讓每一次 feature Push 都等待 Owner。

## 資料庫變更

一般功能分支不執行：

- 建立 EF Migration 或 `__EFMigrationsHistory`。
- 呼叫 `EnsureCreated()` 或 `Migrate()`。
- 另行建立另一套資料庫或 schema。
- 只改 Entity，卻沒有確認 SQL Server 欄位。

需要調整 Schema 時，在 PR 或群組列出欄位名稱、型別、是否允許 `NULL`、預設值、索引／外鍵與受影響功能。

再由資料庫整合流程同步 `QMAH/database/Schema.sql`、QMAH-Database 的 `QMAH.sql`、Entity、DbContext、Diagram 與同一次輸出的交付產物。

## 衝突處理

不直接選「全部保留目前版本」或「全部採用傳入版本」。先理解雙方改動目的，再保留仍需要的內容。

`QmahDbContext`、Entity、`Schema.sql`、`Program.cs`、共用 Layout 或套件鎖定檔發生衝突時，先確認雙方修改目的與資料契約，解決後重新建置並測試。

## 合併前檢查

- 專案可成功建置。
- 修改的網址可開啟。
- 正常輸入、錯誤輸入與空資料都檢查過。
- 瀏覽器 Console 沒有未處理錯誤。
- 沒有提交密碼、個人設定、快取或建置產物。
- PR 已列出共用檔案與資料庫影響。
- GitHub Actions `Build` 成功。

環境問題詳見[開發環境與共用套件](../getting-started/development-environment.md)；資料存取詳見[QmahDbContext 使用方式](../architecture/data-access.md)。
