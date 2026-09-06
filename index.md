[QMAH 專案](https://github.com/MSIT173-03/QMAH) ｜ [QMAH-Docs 專案](https://github.com/MSIT173-03/QMAH-Docs) ｜ [QMAH-Database 專案](https://github.com/MSIT173-03/QMAH-Database) ｜ [QMAH-Docs 文件站](https://msit173-03.github.io/QMAH-Docs/)

<div class="qmah-home">
  <section class="qmah-index-header" aria-labelledby="qmah-home-title">
    <h1 id="qmah-home-title">QMAH 開發文件</h1>
    <p class="qmah-index-lead">各系統可以平行開發。從負責的功能進入，查操作流程、API 與資料；需要共用登入、文物或資產時，再確認跨系統約定。</p>
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
        <span><strong>查詢系統</strong><small>一個共用入口、五個功能系統與營運中心</small></span>
      </a>
      <a class="qmah-rail-item" href="#complete-directory">
        <span class="qmah-rail-marker" aria-hidden="true"></span>
        <span><strong>查交付規則</strong><small>契約、工具與協作</small></span>
      </a>
    </nav>
    <div class="qmah-index-sheet">
      <p class="qmah-index-label">讀取方式</p>
      <h2 id="qmah-route-title">共同基準與功能範圍</h2>
      <p>第一次開啟專案可先確認環境與資料庫。各系統開發彼此獨立；文件排列只是查閱入口，沒有要求依序完成各系統。</p>
      <ol class="qmah-route-list">
        <li><a href="./getting-started/development-environment">準備開發環境</a><span>工具、啟動、連線與共同 Snapshot</span></li>
        <li><a href="./getting-started/development-data">確認共同資料</a><span>Snapshot、資料表、狀態與展示資料</span></li>
        <li><a href="./architecture/system-overview">確認系統邊界</a><span>QMAH、API、Angular、Razor 與資料庫責任</span></li>
        <li><a href="#system-index">查詢系統文件</a><span>從七個入口進入，再查詳細文件與精確參考</span></li>
      </ol>
    </div>
  </section>

  <section id="system-index" class="qmah-system-index" aria-labelledby="system-index-title">
    <div class="qmah-section-heading">
      <p class="qmah-index-label">快速入口／七頁</p>
      <h2 id="system-index-title">五個功能系統、營運中心與共用入口</h2>
      <p>選擇負責的系統或工作入口，先看快速查閱與實際運作方式，再依需要查 API、資料表及跨系統約定。Shared 集中放共用服務與環境說明；營運中心集中放統計與管理操作。</p>
    </div>
    <div class="qmah-system-list">
      <a class="qmah-system-row qmah-system-row-shared" href="./quick-reference/shared"><span class="qmah-system-code">CORE</span><span><strong>Shared｜共用基礎</strong><small>環境、資料表、API、資料存取、媒體、Snapshot、協作與跨系統界線</small></span><span class="qmah-system-arrow" aria-hidden="true">↗</span></a>
      <a class="qmah-system-row" href="./quick-reference/catalog"><span class="qmah-system-code">CAT</span><span><strong>Catalog｜圖鑑與文物</strong><small>文物、分類、年代、題庫設定、解鎖、匯入與圖片授權</small></span><span class="qmah-system-arrow" aria-hidden="true">↗</span></a>
      <a class="qmah-system-row" href="./quick-reference/game"><span class="qmah-system-code">GAME</span><span><strong>Game｜遊戲與作答</strong><small>房間、回合、選題、作答、投票、邀請與獎勵</small></span><span class="qmah-system-arrow" aria-hidden="true">↗</span></a>
      <a class="qmah-system-row" href="./quick-reference/social"><span class="qmah-system-code">SOC</span><span><strong>Social｜社群與活動</strong><small>貼文、留言、檢舉、活動、通知、地點與媒體</small></span><span class="qmah-system-arrow" aria-hidden="true">↗</span></a>
      <a class="qmah-system-row" href="./quick-reference/user"><span class="qmah-system-code">USER</span><span><strong>User｜會員與 Identity</strong><small>帳號、登入、個人資料、地址、通知、成就與會員資產</small></span><span class="qmah-system-arrow" aria-hidden="true">↗</span></a>
      <a class="qmah-system-row" href="./quick-reference/store"><span class="qmah-system-code">STORE</span><span><strong>Store｜商城與訂單</strong><small>商品、購物車、折價券、訂單、付款、庫存與點數</small></span><span class="qmah-system-arrow" aria-hidden="true">↗</span></a>
      <a class="qmah-system-row qmah-system-row-operations" href="./quick-reference/operations"><span class="qmah-system-code">OPS</span><span><strong>Operations｜營運中心</strong><small>統計卡片、日期篩選、資產批次、管理員操作與稽核結果</small></span><span class="qmah-system-arrow" aria-hidden="true">↗</span></a>
    </div>
  </section>
</div>

## 按工作找文件

| 現在要做什麼 | 從這裡開始 | 接著查什麼 |
| --- | --- | --- |
| 第一次準備本機環境 | [開發環境與啟動](getting-started/development-environment.md) | [開發資料與本機展示](getting-started/development-data.md) |
| 想知道一次請求如何運作 | [5＋1 系統：快速查閱與操作流程](getting-started/system-walkthrough.md) | [應用程式啟動與共用服務](architecture/runtime-and-shared-services.md) |
| 開發使用者前台 | [Angular 使用者前台開發](frontend/angular-development.md) | [前台功能接手指南](frontend/feature-development-guide.md)、[REST API 契約](reference/rest-api.md) |
| 開發管理後台 | [管理後台開發起點](admin/backend-development.md) | [Razor 與 Tabler 管理後台介面](admin/razor-admin-ui.md) |
| 查 API 要送什麼、會收到什麼 | [REST API 契約](reference/rest-api.md) | [API 名詞表](reference/api-glossary.md)、啟動後的 Scalar |
| 查資料表、外鍵或交易 | [資料表參考](architecture/database-reference.md) | [資料存取與 DB-first](architecture/data-access.md) |
| 修改圖片、地圖或外部來源 | [媒體交付設定](frontend/media-delivery.md) | [地點與地圖串接說明](features/map-integration.md)、[資料與圖片使用說明](features/data-and-media.md) |
| 匯入資料或建立展示 Snapshot | [開發資料與本機展示](getting-started/development-data.md) | [QMAH 資料工具參考](reference/data-tools.md) |
| 查資產、批次活動與稽核 | [Operations｜營運中心](quick-reference/operations.md) | [經濟與進程基準](features/economy-progression.md)、[資料表參考](architecture/database-reference.md) |
| 協作、分支與交付 | [Git 與 GitHub 協作手冊](reference/git-workflow.md) | [QMAH-Docs 協作規則](CONTRIBUTING.md) |

## 文件目錄 {#complete-directory}

以下依文件目的分組，方便從環境、架構、前端、管理後台、功能或參考資料進入。這是查閱入口，不是五個功能系統、營運中心與共用入口的開發先後；快速查閱頁提供摘要，正式規則以連結文件為準。

### 開始開發

- [5＋1 系統：快速查閱與操作流程](getting-started/system-walkthrough.md)
- [開發環境與啟動](getting-started/development-environment.md)
- [開發資料與本機展示](getting-started/development-data.md)

### 架構

- [系統架構總覽](architecture/system-overview.md)
- [應用程式啟動與共用服務](architecture/runtime-and-shared-services.md)
- [Area 責任與資料界線](architecture/area-boundaries.md)
- [資料存取與 DB-first](architecture/data-access.md)
- [QMAH SSMS Diagram 建立參考](architecture/database-diagram.md)
- [資料表參考](architecture/database-reference.md)

### 前端

- [Angular 使用者前台開發](frontend/angular-development.md)
- [前台功能接手指南](frontend/feature-development-guide.md)
- [媒體交付設定](frontend/media-delivery.md)

### 管理後台

- [管理後台開發起點](admin/backend-development.md)
- [Razor 與 Tabler 管理後台介面](admin/razor-admin-ui.md)

### 功能

- [文物資料匯入](features/catalog-import.md)
- [資料與圖片使用說明](features/data-and-media.md)
- [經濟與進程基準](features/economy-progression.md)
- [Identity 與登入](features/identity-and-login.md)
- [地點與地圖串接說明](features/map-integration.md)

### 參考

- [REST API 契約](reference/rest-api.md)
- [文件閱讀與名詞基準](reference/terminology.md)
- [API 名詞表](reference/api-glossary.md)
- [CRUD 與 Scaffold](reference/crud-and-scaffolding.md)
- [QMAH 資料工具參考](reference/data-tools.md)
- [Git 與 GitHub 協作手冊](reference/git-workflow.md)
- [官方參考索引](reference/official-references.md)
