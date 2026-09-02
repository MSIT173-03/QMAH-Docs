[QMAH 專案](https://github.com/MSIT173-03/QMAH) ｜ [QMAH-Docs 專案](https://github.com/MSIT173-03/QMAH-Docs) ｜ [QMAH-Database 專案](https://github.com/MSIT173-03/QMAH-Database) ｜ [QMAH-Docs 文件站](https://msit173-03.github.io/QMAH-Docs/)

<div class="qmah-home">
  <section class="qmah-index-header" aria-labelledby="qmah-home-title">
    <h1 id="qmah-home-title">QMAH 開發文件</h1>
    <p class="qmah-index-lead">文件依序列出開發環境、共同資料、系統邊界、功能文件與參考資料。需要處理單一系統時，也可以直接從六個快速查詢頁進入。</p>
    <div class="qmah-index-meta" aria-label="文件站資訊">
      <span>QMAH / DOCUMENTATION</span>
      <span>Markdown source · VitePress build</span>
      <span>DB-first · API · Snapshot</span>
    </div>
  </section>

  <section id="reading-route" class="qmah-work-index" aria-labelledby="qmah-route-title">
    <nav class="qmah-index-rail" aria-label="工作索引">
      <p class="qmah-index-label">工作索引</p>
      <a class="qmah-rail-item" href="#reading-route">
        <span class="qmah-rail-marker" aria-hidden="true"></span>
        <span><strong>準備環境</strong><small>工具、資料庫與服務</small></span>
      </a>
      <a class="qmah-rail-item" href="#system-index">
        <span class="qmah-rail-marker" aria-hidden="true"></span>
        <span><strong>查詢系統</strong><small>五個系統與一個共用頁</small></span>
      </a>
      <a class="qmah-rail-item" href="#complete-directory">
        <span class="qmah-rail-marker" aria-hidden="true"></span>
        <span><strong>查交付規則</strong><small>契約、工具與協作</small></span>
      </a>
    </nav>
    <div class="qmah-index-sheet">
      <p class="qmah-index-label">讀取方式</p>
      <h2 id="qmah-route-title">先確認共用資料，再查系統</h2>
      <p>先確認環境、資料庫與系統邊界，再依功能範圍查閱文件。快速查詢頁列出入口；資料、API 與變更規則以連結的詳細文件為準。</p>
      <ol class="qmah-route-list">
        <li><a href="./getting-started/development-environment">準備開發環境</a><span>工具、啟動、連線與共同 Snapshot</span></li>
        <li><a href="./architecture/system-overview">確認系統邊界</a><span>QMAH、API、Angular、Razor 與資料庫責任</span></li>
        <li><a href="#system-index">查詢系統文件</a><span>從六個系統頁進入，再查詳細目錄與精確參考</span></li>
      </ol>
    </div>
  </section>

  <section id="system-index" class="qmah-system-index" aria-labelledby="system-index-title">
    <div class="qmah-section-heading">
      <p class="qmah-index-label">系統索引 / 6 pages</p>
      <h2 id="system-index-title">六個系統快速查詢頁</h2>
      <p>每頁列出該系統常用的資料關係、API、畫面與變更檢查。詳細內容以連結指向的文件為準，快速頁不另維護一份欄位規則。</p>
    </div>
    <div class="qmah-system-list">
      <a class="qmah-system-row" href="./quick-reference/catalog"><span class="qmah-system-code">CAT</span><span><strong>Catalog｜圖鑑與文物</strong><small>文物、分類、年代、題庫設定、解鎖、匯入與圖片授權</small></span><span class="qmah-system-arrow" aria-hidden="true">↗</span></a>
      <a class="qmah-system-row" href="./quick-reference/game"><span class="qmah-system-code">GAME</span><span><strong>Game｜遊戲與作答</strong><small>房間、回合、選題、作答、投票、邀請與獎勵</small></span><span class="qmah-system-arrow" aria-hidden="true">↗</span></a>
      <a class="qmah-system-row" href="./quick-reference/social"><span class="qmah-system-code">SOC</span><span><strong>Social｜社群與活動</strong><small>貼文、留言、檢舉、活動、通知、地點與媒體</small></span><span class="qmah-system-arrow" aria-hidden="true">↗</span></a>
      <a class="qmah-system-row" href="./quick-reference/user"><span class="qmah-system-code">USER</span><span><strong>User｜會員與 Identity</strong><small>帳號、登入、個人資料、地址、通知、成就與會員資產</small></span><span class="qmah-system-arrow" aria-hidden="true">↗</span></a>
      <a class="qmah-system-row" href="./quick-reference/store"><span class="qmah-system-code">STORE</span><span><strong>Store｜商城與訂單</strong><small>商品、購物車、折價券、訂單、付款、庫存與點數</small></span><span class="qmah-system-arrow" aria-hidden="true">↗</span></a>
      <a class="qmah-system-row qmah-system-row-shared" href="./quick-reference/shared"><span class="qmah-system-code">CORE</span><span><strong>Shared｜共用基礎</strong><small>API、DB-first、資料存取、媒體、Snapshot、協作與跨系統邊界</small></span><span class="qmah-system-arrow" aria-hidden="true">↗</span></a>
    </div>
  </section>
</div>

## 詳細文件目錄 {#complete-directory}

詳細文件依「開始開發 → 架構 → 前端 → 管理後台 → 功能 → 參考」排列。快速查詢頁只提供入口，規則以以下文件為準。

### 開始開發

- [開發環境與啟動](getting-started/development-environment.md)
- [開發資料與本機展示](getting-started/development-data.md)

### 架構

- [系統架構總覽](architecture/system-overview.md)
- [Area 責任與資料界線](architecture/area-boundaries.md)
- [資料存取與 DB-first](architecture/data-access.md)
- [資料庫 Diagram 對照](architecture/database-diagram.md)

### 前端

- [Angular 使用者前台開發](frontend/angular-development.md)
- [媒體交付設定](frontend/media-delivery.md)

### 管理後台

- [管理後台開發起點](admin/backend-development.md)
- [Razor 與 Tabler 介面](admin/razor-admin-ui.md)

### 功能

- [文物資料匯入](features/catalog-import.md)
- [資料與圖片使用](features/data-and-media.md)
- [經濟與進程](features/economy-progression.md)
- [Identity 與登入](features/identity-and-login.md)
- [地點與地圖串接](features/map-integration.md)

### 參考

- [REST API 契約](reference/rest-api.md)
- [API 名詞表](reference/api-glossary.md)
- [CRUD 與 Scaffold](reference/crud-and-scaffolding.md)
- [資料工具](reference/data-tools.md)
- [Git 與 GitHub 協作](reference/git-workflow.md)
- [官方參考索引](reference/official-references.md)
