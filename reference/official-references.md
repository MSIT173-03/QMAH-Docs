# 官方參考索引

本頁把 .NET、ASP.NET Core、EF Core、Angular、SQL Server、OpenAPI、HTTP、VitePress、GitHub Pages、資料來源與授權的官方文件，對應到 QMAH 的正規文件和程式來源。每個連結旁都說明它能確認哪一種通用行為。

本頁列出 QMAH 文件引用的官方技術與資料來源。官方文件只用來確認框架、工具、協定與授權的通用語意；QMAH 的路由、資料表、版本、連線解析順序與業務規則，仍以產品 Repository 的程式、`Schema.sql`、API 契約與 QMAH-Database Snapshot 為準。

## 何時查哪一份

| 主題 | QMAH 正規文件 | 官方參考 |
| --- | --- | --- |
| SDK 選擇與 `.vsconfig` | [開發環境與啟動](../getting-started/development-environment.md) | [.NET `global.json` 概觀](https://learn.microsoft.com/en-us/dotnet/core/tools/global-json)、[Visual Studio 安裝設定匯入與匯出](https://learn.microsoft.com/en-us/visualstudio/install/import-export-installation-configurations?view=visualstudio) |
| ASP.NET Core 設定與本機覆寫 | [開發環境與啟動](../getting-started/development-environment.md) | [ASP.NET Core Configuration](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration/?view=aspnetcore-10.0) |
| SQL Server LocalDB | [開發環境與啟動](../getting-started/development-environment.md) | [SQL Server Express LocalDB](https://learn.microsoft.com/en-us/sql/database-engine/configure-windows/sql-server-express-localdb?view=sql-server-ver17) |
| DB-first 與 Entity 對照 | [資料存取與 DB-first](../architecture/data-access.md) | [EF Core Managing Database Schemas](https://learn.microsoft.com/en-us/ef/core/managing-schemas/)、[EF Core Reverse Engineering](https://learn.microsoft.com/en-us/ef/core/managing-schemas/scaffolding/) |
| DbContext 與交易 | [資料存取與 DB-first](../architecture/data-access.md) | [DbContext Lifetime](https://learn.microsoft.com/en-us/ef/core/dbcontext-configuration/)、[Using Transactions](https://learn.microsoft.com/en-us/ef/core/saving/transactions) |
| 追蹤、並行與套件還原 | [資料存取與 DB-first](../architecture/data-access.md)、[開發環境與啟動](../getting-started/development-environment.md) | [Tracking vs. No-Tracking Queries](https://learn.microsoft.com/en-us/ef/core/querying/tracking)、[Handling Concurrency Conflicts](https://learn.microsoft.com/en-us/ef/core/saving/concurrency)、[Package references in project files](https://learn.microsoft.com/en-us/nuget/consume-packages/package-references-in-project-files) |
| Identity、登入與授權 | [Identity 與登入](../features/identity-and-login.md) | [ASP.NET Core Authentication](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/?view=aspnetcore-10.0)、[Introduction to Identity](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity?view=aspnetcore-10.0) |
| Angular 版本、HTTP、Router | [Angular 使用者前台開發](../frontend/angular-development.md) | [Angular Version Compatibility](https://angular.dev/reference/versions)、[Angular HTTP Client](https://angular.dev/guide/http)、[Angular Routing](https://angular.dev/guide/routing) |
| API 契約與 HTTP 狀態 | [REST API 契約](./rest-api.md) | [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)、[RFC 9457 Problem Details](https://www.rfc-editor.org/rfc/rfc9457.html)、[RFC 9110 HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html) |
| CORS 與 API 安全設定 | [REST API 契約](./rest-api.md) | [ASP.NET Core CORS](https://learn.microsoft.com/en-us/aspnet/core/security/cors?view=aspnetcore-10.0)、[ASP.NET Core Security](https://learn.microsoft.com/en-us/aspnet/core/security/?view=aspnetcore-10.0) |
| VitePress 文件站 | [文件站協作規則](../CONTRIBUTING.md) | [VitePress Getting Started](https://vitepress.dev/guide/getting-started)、[Site Config](https://vitepress.dev/reference/site-config)、[Deploy Your VitePress Site](https://vitepress.dev/guide/deploy) |
| Markdown lint | [文件站協作規則](../CONTRIBUTING.md) | [`markdownlint-cli2` 官方 Repository](https://github.com/DavidAnson/markdownlint-cli2)、[`markdownlint-cli2-action`](https://github.com/DavidAnson/markdownlint-cli2-action) |
| GitHub Pages 與 Release | [Git 與 GitHub 協作](./git-workflow.md) | [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)、[About Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases) |
| 故宮資料與圖片授權 | [資料與圖片使用](../features/data-and-media.md) | [故宮典藏資料檢索－Open Data](https://digitalarchive.npm.gov.tw/opendata/)、[國立故宮博物院數位物件利用申請說明](https://www.npm.gov.tw/articles.aspx?l=1&sno=03012918)、[智慧財產局－授課使用照片、圖片的合理範圍](https://www.tipo.gov.tw/tw/copyright/771-4942.html) |

## Microsoft .NET、ASP.NET Core 與 SQL Server

- [`global.json` 概觀](https://learn.microsoft.com/en-us/dotnet/core/tools/global-json)：說明 SDK 選擇、`rollForward` 與本機已安裝 SDK 的判斷方式。QMAH 的實際基準仍以根目錄 `global.json` 為準。
- [Visual Studio 安裝設定匯入與匯出](https://learn.microsoft.com/en-us/visualstudio/install/import-export-installation-configurations?view=visualstudio)：說明把工作負載與元件保存在 `.vsconfig`，以及由 Solution 或 Repository 提示安裝缺少元件的方式。
- [ASP.NET Core Configuration](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration/?view=aspnetcore-10.0)：說明 `appsettings.json`、環境設定、User Secrets、環境變數與命令列設定的優先順序。QMAH 的 `QmahDatabase` 與 `QmahDatabaseDiscovery` 仍以實際 `Program.cs` 與 resolver 為準。
- [SQL Server Express LocalDB](https://learn.microsoft.com/en-us/sql/database-engine/configure-windows/sql-server-express-localdb?view=sql-server-ver17)：說明 LocalDB 的安裝、instance 管理與連線方式。QMAH 會把 LocalDB 放進本機候選清單，但不把單一 LocalDB instance 視為唯一部署位置。
- [EF Core Managing Database Schemas](https://learn.microsoft.com/en-us/ef/core/managing-schemas/)：區分以 Model 為基準的 Migrations 與以資料庫 Schema 為基準的 Reverse Engineering。QMAH 選擇 DB-first，專案規則不可由通用教學反向改成 Migration。
- [EF Core Reverse Engineering](https://learn.microsoft.com/en-us/ef/core/managing-schemas/scaffolding/)：說明由既有資料庫產生 Entity 與 `DbContext`，以及產生檔案被覆寫時應採用 partial 或可覆寫機制。QMAH 的產生輸出必須先放到暫存位置檢查。
- [DbContext Lifetime, Configuration, and Initialization](https://learn.microsoft.com/en-us/ef/core/dbcontext-configuration/) 與 [Using Transactions](https://learn.microsoft.com/en-us/ef/core/saving/transactions)：說明 scoped `DbContext`、單一工作單位與跨表交易的基本行為；QMAH 的具體交易邊界以資料存取文件和程式實作為準。
- [Tracking vs. No-Tracking Queries](https://learn.microsoft.com/en-us/ef/core/querying/tracking) 與 [Handling Concurrency Conflicts](https://learn.microsoft.com/en-us/ef/core/saving/concurrency)：說明唯讀查詢、變更追蹤與 `rowversion` 並行控制的通用行為。
- [Package references in project files](https://learn.microsoft.com/en-us/nuget/consume-packages/package-references-in-project-files)：說明 `PackageReference`、transitive package 與 lock file；QMAH 的實際套件版本仍以各 `.csproj` 與 `packages.lock.json` 為準。
- [ASP.NET Core MVC with EF Core](https://learn.microsoft.com/en-us/aspnet/core/data/ef-mvc/intro?view=aspnetcore-10.0)：查閱 MVC、EF Core 與 Scaffold 的通用範例；產生後仍須依 QMAH 的 Area、ViewModel、授權與歷史資料規則調整。
- [ASP.NET Core Authentication](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/?view=aspnetcore-10.0) 與 [Introduction to Identity](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity?view=aspnetcore-10.0)：說明 authentication、authorization、使用者、角色、Claim、Token 與外部登入的基本責任。
- [ASP.NET Core CORS](https://learn.microsoft.com/en-us/aspnet/core/security/cors?view=aspnetcore-10.0)：說明跨來源政策與明確來源設定。QMAH 的 API 只接受設定檔列出的 Angular 來源，不以 `AllowAnyOrigin` 取代來源清單。

## Angular 與前端

- [Angular Version Compatibility](https://angular.dev/reference/versions)：確認 Angular major／minor 與 Node.js、TypeScript、RxJS 的相容範圍。課程要求 Angular 21；QMAH 固定 `21.2.22`，版本選擇理由見[前端文件](../frontend/angular-development.md)。
- [Angular HTTP Client](https://angular.dev/guide/http)：說明 `HttpClient`、請求設定與資料取得。QMAH 前台透過 `/api/v1` DTO 契約，不直接連 SQL Server。
- [Angular Routing](https://angular.dev/guide/routing)：說明 Router、路由組態與導覽。實際前台路由以 `QMAH.Client/src/app` 為準。

## API、協定與錯誤格式

- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)：說明 path、operation、parameter、request body、response、schema 與 security metadata 的標準結構。QMAH 的實際文件由 `/openapi/v1.json` 與 OpenAPI transformer 產生。
- [RFC 9457 Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html)：說明 API 錯誤回應的媒體型別與欄位語意；此規格已取代前一版 Problem Details 規格。
- [RFC 9110 HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)：查閱 HTTP 方法、狀態碼與標頭的通用語意；QMAH 的端點清單另受 Controller 實作限制。

## 文件站與交付

- [VitePress Getting Started](https://vitepress.dev/guide/getting-started)、[Site Config](https://vitepress.dev/reference/site-config) 與 [Deploy Your VitePress Site](https://vitepress.dev/guide/deploy)：說明目前固定文件站框架、`base`、sidebar、local search 與部署設定。
- [`markdownlint-cli2` 官方 Repository](https://github.com/DavidAnson/markdownlint-cli2)：說明本專案使用的 CLI、glob、設定檔與 `--fix` 行為。
- [`markdownlint-cli2-action`](https://github.com/DavidAnson/markdownlint-cli2-action)：供 GitHub Actions 使用時查閱輸入參數與 glob 設定。
- [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)：說明 Pages 專案與部署來源的設定。
- [About Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)：說明 Release、tag 與 Release asset 的責任。QMAH 主 Repository 的 Release 目前只作版本導覽；完整 SQL Snapshot 由 QMAH-Database 提供。

## 資料來源與授權

- [故宮典藏資料檢索－Open Data](https://digitalarchive.npm.gov.tw/opendata/)：查閱文物資料與圖像頁面的授權標示、來源與欄位。
- [國立故宮博物院數位物件利用申請說明](https://www.npm.gov.tw/articles.aspx?l=1&sno=03012918)：素材不在 Open Data 授權範圍，或需要其他解析度與用途時，查閱官方利用申請流程。
- [智慧財產局－授課使用照片、圖片的合理範圍](https://www.tipo.gov.tw/tw/copyright/771-4942.html)：查閱課程使用公開素材時的法律說明。QMAH 文件不取代個案法律意見。

## 來源優先順序

說明不一致時，依下列順序核對：

1. 產品程式目前的執行行為與測試結果。
2. `QMAH/database/Schema.sql`、API OpenAPI JSON 與 QMAH-Database 的 manifest／tag。
3. 本文件站的正規頁面與工具說明。
4. 本頁列出的框架、協定與官方通用文件。

官方通用文件不能推導出 QMAH 尚未實作的功能；QMAH 專案特有的名稱、路徑、版本、資料數量與狀態，必須回到 Repository 證據確認。
