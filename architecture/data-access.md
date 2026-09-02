# 資料存取與 DB-first

`QmahDbContext` 是 QMAH 網站透過 EF Core 存取 SQL Server 的共同入口。

資料表結構以 [`QMAH/database/Schema.sql`](https://github.com/MSIT173-03/QMAH/blob/main/database/Schema.sql) 與已審核的 SQL Server Schema 為準。

Entity、Fluent mapping 與 `QmahDbContext` 只負責對照及操作既有資料表，不會建立或修改 Schema。

> **官方參考：** EF Core 需要先決定 Schema 的唯一來源。資料庫是來源時使用 Reverse Engineering 對照既有資料庫；C# 模型是來源時才使用 Migration。
>
> QMAH 採用前者，因此沒有 `InitialCreate`、`__EFMigrationsHistory` 或程式端建表。[Managing Database Schemas](https://learn.microsoft.com/en-us/ef/core/managing-schemas/)／[Reverse Engineering](https://learn.microsoft.com/en-us/ef/core/managing-schemas/scaffolding/)

## DbContext 在 QMAH 負責什麼

在一次 HTTP request 中，Controller 透過 `QmahDbContext` 讀取資料表、追蹤要修改的 Entity，最後以 `SaveChangesAsync()` 將變更寫回 SQL Server。

### 五個基本名詞

| 名詞 | 意思 | 專案例子 |
| --- | --- | --- |
| SQL Server | 真正保存資料的地方 | 本機的 `QMAH` 資料庫 |
| Entity | 一列資料在 C# 中的型別 | 一個 `Artifact` 物件代表一件文物 |
| `DbSet<TEntity>` | 某張資料表在 DbContext 中的入口 | `_db.Artifacts`、`_db.Products` |
| `QmahDbContext` | 將 LINQ 轉成 SQL，並追蹤這次 request 要寫回的變更 | Controller 注入的 `_db` |
| `SaveChangesAsync()` | 將已追蹤的新增、修改、刪除送到 SQL Server | 儲存表單變更 |

`QmahDbContext` 不是資料庫，也不會一次載入所有資料。`_db.Artifacts.Where(...)` 只是在組合查詢；執行 `ToListAsync()`、`SingleOrDefaultAsync()`、`AnyAsync()` 等方法時，EF Core 才會向 SQL Server 送出查詢。

### DI 的作用

`Program.cs` 已登記 `QmahDbContext` 與連線字串。Controller 在建構式宣告需要 DbContext，ASP.NET Core 會在每個 request 自動建立並傳入，request 結束後再釋放。

```csharp
public ArtifactController(QmahDbContext db)
{
    _db = db;
}
```

因此不需要在 Controller 重新讀取連線字串、建立 SQL 連線或使用 `new QmahDbContext()`。

### `QmahDbContext` 與連線字串的關係

`QmahDbContext` 仍透過 SQL Server 連線字串存取資料庫。連線設定集中在 `Program.cs`，Controller 只宣告需要 `QmahDbContext`。

`QMAH.Api/Program.cs` 與 `QMAH.Web/Program.cs` 會先呼叫 `QmahDatabaseConnectionResolver.ResolveAsync`，再把解析結果交給 `AddDbContext`。

解析器依 `QmahDatabaseDiscovery:Enabled` 決定是否執行本機資料庫探索。Controller 不需要重新處理這段邏輯。

```csharp
var resolution = await QmahDatabaseConnectionResolver.ResolveAsync(
    builder.Configuration.GetConnectionString("QmahDatabase"),
    builder.Configuration.GetValue("QmahDatabaseDiscovery:Enabled", true));

builder.Services.AddDbContext<QmahDbContext>(options =>
{
    // 使用設定或本機探索後選出的 SQL Server 連線。
    options.UseSqlServer(
        resolution.ConnectionString);
});
```

共用設定的預設 `QmahDatabase` 是 `Server=.;Database=QMAH`。它是第一個候選，也是在找不到可用資料庫時使用的 fallback。

自動探索會檢查設定候選、標準 LocalDB、本機預設 SQL Server instance `.`、`sqllocaldb info` 列出的 LocalDB instance，以及已註冊的本機 SQL Server instance。每個候選都會透過 `master.sys.databases` 確認 `QMAH` 處於 `ONLINE`。

這項探索不掃描網路、不自動附加 `.mdf`，也不還原 `.bak`。完整順序與關閉方式見[開發環境與啟動](../getting-started/development-environment.md)。

Controller 只取得已設定好的 `QmahDbContext`：

```csharp
public sealed class ArtifactController : Controller
{
    // 這個欄位代表目前 HTTP request 的資料庫工作區。
    private readonly QmahDbContext _db;

    // ASP.NET Core DI 在建立 Controller 時自動傳入 _db。
    public ArtifactController(QmahDbContext db)
    {
        _db = db;
    }
}
```

若改成在每個 Controller 手動使用連線字串，程式會變成下列形式：

```csharp
var connectionString = _configuration.GetConnectionString("QmahDatabase");
await using var connection = new SqlConnection(connectionString);
await connection.OpenAsync(cancellationToken);

await using var command = new SqlCommand(
    "SELECT [Id], [Name] FROM [catalog].[Artifacts] WHERE [IsActive] = @isActive",
    connection);
command.Parameters.AddWithValue("@isActive", true);

await using var reader = await command.ExecuteReaderAsync(cancellationToken);
while (await reader.ReadAsync(cancellationToken))
{
    // 手動用欄位名稱或索引，把每一列轉成 C# 物件。
    var id = reader.GetGuid(reader.GetOrdinal("Id"));
    var name = reader.GetString(reader.GetOrdinal("Name"));
}
```

這種寫法可使用，但每個查詢都要個別管理連線、SQL 字串、參數、Reader 與資料列 mapping。`QmahDbContext` 把這些共通工作集中處理：Entity 對應資料表、LINQ 轉 SQL、查詢參數化、同一 request 的 Change Tracking，以及 `SaveChangesAsync()` 的寫入交易。

一般 QMAH CRUD 使用 DbContext。只有報表、統計或非常特定的唯讀 SQL 明顯更適合手寫時，才評估 Dapper 或 ADO.NET；仍須使用相同連線字串與既有資料庫規則。

### 外鍵與 Navigation Property

`QmahDbContext` 已對應資料庫中的 63 個外鍵。常用關聯可以直接在 LINQ 中使用，例如訂單會員、貼文作者、貼文文物、遊戲回合文物與解鎖來源：

```csharp
var posts = await _db.SocialPosts
    .AsNoTracking()
    .OrderByDescending(post => post.CreatedAt)
    .Select(post => new SocialPostListItemViewModel
    {
        Id = post.Id,
        Title = post.Title,
        AuthorEmail = post.User.Email ?? string.Empty,
        ArtifactName = post.Artifact == null ? null : post.Artifact.Name
    })
    .ToListAsync(cancellationToken);
```

上例的 `post.User` 與 `post.Artifact` 會由 EF Core 轉成 SQL JOIN，不會先把整張使用者或文物資料表載入記憶體。

QMAH 沒有啟用 Lazy Loading。使用投影 `Select()` 時可以直接存取 Navigation Property；只有需要完整 Entity graph 時才使用 `Include()`／`ThenInclude()`。

### 讀取與修改

唯讀清單：

```csharp
var items = await _db.Artifacts
    .AsNoTracking()
    .ToListAsync(cancellationToken);
```

`AsNoTracking()` 表示這些 Entity 只供顯示，EF Core 不必記錄後續變更。

修改資料：

```csharp
var artifact = await _db.Artifacts
    .SingleAsync(item => item.Id == id, cancellationToken);

artifact.Name = input.Name.Trim();
await _db.SaveChangesAsync(cancellationToken);
```

修改時不加 `AsNoTracking()`。EF Core 會記住查回的 Entity，並在 `SaveChangesAsync()` 時更新變更欄位。

ViewModel 是 View 與 Controller 之間的資料；Entity 是 Controller／Service 與資料庫之間的資料。POST 使用 ViewModel，可避免表單修改價格、角色、UserId、狀態或其他未開放欄位。

| 想做的事 | QMAH 的實際入口 | 不該做的事 |
| --- | --- | --- |
| 顯示圖鑑文物與分類 | `_db.Artifacts`、`Category`、`EraBucket` | 在 View 內逐筆查資料庫 |
| 顯示或修改商城商品 | `_db.Products`、`Product.ArtifactId` | 用商品名稱或圖片路徑硬比對文物 |
| 修改會員暱稱或地址 | `_db.UserProfiles`、`_db.UserAddresses` | 直接改 `AspNetUsers` 的密碼欄位 |
| 註冊、登入、改密碼、角色 | `UserManager`、`SignInManager`、`RoleManager` | 直接 `INSERT`／`UPDATE` Identity 資料表 |

實際用法可參考下方的「圖鑑」、「商城」與「會員」範例；範例使用目前 QMAH 的 Entity、欄位與關聯。

## 開始前

1. 從 QMAH-Database 取得相容的 `QMAH.sql`，或使用同版本且已驗證的 `.bak`，資料庫名稱使用 `QMAH`。
2. 用 Visual Studio 開啟 `QMAH.sln`，確認網站可以按 `F5` 啟動。
3. 在所屬 Area 的 Controller 建構式注入 `QmahDbContext`。

`Program.cs` 已將 `QmahDbContext` 註冊為 scoped service，同一個 HTTP request 會共用同一份 DbContext。

Controller 不直接 `new QmahDbContext()`，也不建立 SQL Server 連線、執行 Migration 或改寫連線字串。

## 資料存取分工

```text
單一資料表 CRUD：Controller → QmahDbContext → SQL Server
跨表流程：Controller → 小型 Service → QmahDbContext → SQL Server
登入、密碼與角色：Controller → Identity API → SQL Server
```

不建立 Entity Wrapper、Generic Repository，也不規定每張表都要有 Service。EF Core 的 `DbContext` 與 `DbSet` 已經提供查詢、追蹤、新增、修改、刪除與交易；再包一層不會讓目前的 CRUD 更簡單。

符合下列任一條件時建立用途明確的 Service：同一交易更新多張表、狀態與失敗處理流程較長、呼叫外部服務、由多個入口共用，或需要獨立測試。短小的單表 CRUD 可留在 Controller。Service 不直接回傳 Razor View，也不作為全站通用資料庫入口。

Entity 只在 Controller／Service 與 EF Core 之間使用。View 一律使用所屬 Area 的 ViewModel；日後真的提供 JSON API 時，再建立 DTO，避免畫面或 API 直接綁定資料表 Entity。

> **官方參考：** Web 應用程式通常以一個 HTTP request 作為一個工作單位，`AddDbContext` 預設會把 DbContext 註冊為 scoped。
>
> DbContext 不支援多執行緒並行使用，也不應跨 request 長期保存。[DbContext Lifetime, Configuration, and Initialization](https://learn.microsoft.com/en-us/ef/core/dbcontext-configuration/)

```csharp
using Microsoft.AspNetCore.Mvc;
using QMAH.Infrastructure.Data;

namespace QMAH.Web.Areas.Catalog.Controllers;

[Area("Catalog")]
public class ArtifactController : Controller
{
    private readonly QmahDbContext _db;

    public ArtifactController(QmahDbContext db)
    {
        _db = db;
    }
}
```

## QMAH 查詢範例

### 圖鑑：讀取文物、分類與年代

圖鑑 Index 只要顯示名稱、分類、年代與縮圖，不必把整個 Entity 和所有導覽屬性送到畫面。直接由 `Artifacts` 投影成 ViewModel 即可：

```csharp
// 從注入的 DbContext 取得 catalog.Artifacts 資料表入口。
var items = await _db.Artifacts
    // 此頁只顯示資料，不會修改 Entity，因此不建立 Change Tracking。
    .AsNoTracking()
    // SQL WHERE：只取目前啟用的文物。
    .Where(artifact => artifact.IsActive)
    // SQL ORDER BY：依名稱排序。
    .OrderBy(artifact => artifact.Name)
    // SQL SELECT：直接建立畫面需要的 ViewModel，不把完整 Entity 傳進 View。
    .Select(artifact => new ArtifactListItemViewModel
    {
        Id = artifact.Id,
        Name = artifact.Name,
        // EF Core 依既有外鍵轉成 SQL JOIN，取得分類名稱。
        CategoryName = artifact.Category.Name,
        // EF Core 依既有外鍵轉成 SQL JOIN，取得年代名稱。
        EraName = artifact.EraBucket.Name,
        ThumbnailPath = artifact.ThumbnailPath
    })
    // 到此行才真正執行 SQL，並把查詢結果轉成 List。
    .ToListAsync(cancellationToken);
```

這裡的 `artifact.Category.Name` 和 `artifact.EraBucket.Name` 會由 EF Core 轉成同一個 SQL 查詢，不需要在 View 迴圈中另查分類或年代。

### 商城：由商品找到對應文物

商城的商品資料放在 `store.Products`，而 `Product.ArtifactId` 是商品與圖鑑的正式連結。需要顯示原作文物名稱或來源時，用 `Include` 讀取導覽屬性：

```csharp
var product = await _db.Products
    .AsNoTracking()
    .Include(item => item.Artifact)
    .SingleOrDefaultAsync(
        item => item.Id == id && item.IsActive,
        cancellationToken);

if (product is null)
{
    return NotFound();
}

var originalArtifactName = product.Artifact?.Name;
```

修改商品時，重新查出受追蹤的 `Product`，再逐欄指定 `Name`、`Description`、`Price`、`Stock` 或 `IsActive`。表單送回的整個 `Product` 不直接 `Update`。

### 會員：Identity 與會員資料分開拿

登入身分由 Identity 管理，暱稱、簡介與公開範圍則在 `user.UserProfiles`。使用 `UserManager` 取得目前登入者，再用同一個 UserId 查 Profile：

這段假設 Controller 已注入 `UserManager<ApplicationUser>`，而 `input` 是通過 `ModelState` 驗證的 `EditProfileViewModel`。不需要也不能從表單傳入另一位會員的 `UserId`。

```csharp
// 從登入 Cookie 取得目前登入的 ApplicationUser。
var user = await _userManager.GetUserAsync(User);
if (user is null)
{
    // 沒有登入身分時交給 ASP.NET Core 啟動登入流程。
    return Challenge();
}

// 用目前登入者的 UserId 查詢 QMAH 的 Profile 資料列。
var profile = await _db.UserProfiles
    .SingleOrDefaultAsync(
        item => item.UserId == user.Id,
        cancellationToken);

if (profile is null)
{
    return NotFound();
}

// profile 是受追蹤 Entity。只更新表單允許修改的欄位。
profile.Nickname = input.Nickname.Trim();
profile.Bio = input.Bio?.Trim();
profile.Visibility = input.Visibility;
profile.UpdatedAt = DateTime.UtcNow;

// EF Core 偵測上述欄位變更，產生 UPDATE 並寫回 SQL Server。
await _db.SaveChangesAsync(cancellationToken);
```

`ApplicationUser` 不是一般會員設定表。密碼、Email、角色、外部登入仍交給 Identity API；Profile 才是 User Area 的一般 CRUD 資料。

## 唯讀清單

清單與詳細頁通常不需要 EF Core 追蹤資料，加入 `AsNoTracking()` 可以減少記憶體與追蹤成本。

> **官方參考：** 不需要更新結果的查詢適合使用 no-tracking；通常執行較快，因為 EF Core 不必建立變更追蹤資訊。[Tracking vs. No-Tracking Queries](https://learn.microsoft.com/en-us/ef/core/querying/tracking)

```csharp
using Microsoft.EntityFrameworkCore;

public async Task<IActionResult> Index(CancellationToken cancellationToken)
{
    var artifacts = await _db.Artifacts
        .AsNoTracking()
        .Include(x => x.Category)
        .Include(x => x.EraBucket)
        .OrderBy(x => x.Name)
        .ToListAsync(cancellationToken);

    return View(artifacts);
}
```

查詢原則：

- 唯讀查詢使用 `AsNoTracking()`。
- 需要顯示關聯資料時才加入 `Include()`。
- 迴圈內不逐筆查分類、會員或商品，避免產生大量 SQL。
- 資料量可能增加的清單要加入排序、篩選與分頁，不一次載入全部資料。
- 使用 `ToListAsync()`、`SingleOrDefaultAsync()`、`AnyAsync()` 與 `SaveChangesAsync()` 等非同步方法。
- Action 可接收 `CancellationToken`，並傳給 EF Core 的非同步方法。

## 使用 ViewModel 控制畫面資料

每個 Razor View 都使用 ViewModel。清單、詳情與表單的 ViewModel 可以很小，只放畫面需要的欄位；這樣不會把資料表欄位、導覽屬性或不該由使用者修改的值暴露到畫面。

下列 ViewModel 都是範例型別，不是框架自動提供的類別。使用前要在所屬 Area 建立對應檔案。以圖鑑清單為例，可建立：

```text
QMAH.Web/Areas/Catalog/ViewModel/ArtifactListItemViewModel.cs
```

```csharp
namespace QMAH.Web.Areas.Catalog.ViewModel;

public sealed class ArtifactListItemViewModel
{
    public Guid Id { get; init; }

    public string Name { get; init; } = string.Empty;

    public string CategoryName { get; init; } = string.Empty;

    public string EraName { get; init; } = string.Empty;

    public string? ThumbnailPath { get; init; }
}
```

Controller 檔案要加入：

```csharp
using QMAH.Web.Areas.Catalog.ViewModel;
```

查詢時直接投影成 ViewModel，只取畫面需要的欄位：

```csharp
var items = await _db.Artifacts
    .AsNoTracking()
    .Where(x => x.IsActive)
    .OrderBy(x => x.Name)
    .Select(x => new ArtifactListItemViewModel
    {
        Id = x.Id,
        Name = x.Name,
        CategoryName = x.Category.Name,
        EraName = x.EraBucket.Name,
        ThumbnailPath = x.ThumbnailPath
    })
    .ToListAsync(cancellationToken);
```

ViewModel 應放在所屬 Area 容易找到的位置；純畫面欄位不放回資料庫 Entity。

商品與文物的正式關聯是 `Product.ArtifactId`。商城要顯示原作文物時，直接使用 `Product.Artifact` 導覽屬性；圖鑑要找對應商品時，則以目前文物 Id 查詢 `ArtifactId`：

```csharp
var product = await _db.Products
    .AsNoTracking()
    .Include(x => x.Artifact)
    .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

var linkedProduct = await _db.Products
    .AsNoTracking()
    .SingleOrDefaultAsync(
        x => x.ArtifactId == artifactId && x.IsActive,
        cancellationToken);
```

`ExternalRef` 只供資料匯入、匯出與查重；不拆解 `artifact-{ArtifactRef}`、不比對名稱，也不以圖片路徑建立關聯。

## 單筆查詢與不存在的資料

```csharp
public async Task<IActionResult> Details(Guid id, CancellationToken cancellationToken)
{
    var artifact = await _db.Artifacts
        .AsNoTracking()
        .Include(x => x.Category)
        .Include(x => x.EraBucket)
        .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

    if (artifact is null)
    {
        return NotFound();
    }

    return View(artifact);
}
```

網址傳入的 Id 不視為必然存在。詳細、修改、刪除與狀態操作都處理 `null`。

## 新增資料

POST Action 只接收畫面允許修改的欄位。價格、庫存、會員 Id、狀態、建立時間與外鍵是否合法，都要由後端重新確認。

在 `QMAH.Web/Areas/Catalog/ViewModel/CreateCategoryViewModel.cs` 建立輸入模型：

```csharp
using System.ComponentModel.DataAnnotations;

namespace QMAH.Web.Areas.Catalog.ViewModel;

public sealed class CreateCategoryViewModel
{
    [Required(ErrorMessage = "請輸入分類代碼。")]
    [StringLength(32, ErrorMessage = "分類代碼最多 32 個字元。")]
    public string Code { get; set; } = string.Empty;

    [Required(ErrorMessage = "請輸入分類名稱。")]
    [StringLength(80, ErrorMessage = "分類名稱最多 80 個字元。")]
    public string Name { get; set; } = string.Empty;
}
```

Controller 加入 `using QMAH.Web.Areas.Catalog.ViewModel;`，再建立 POST Action：

```csharp
[HttpPost]
[ValidateAntiForgeryToken]
public async Task<IActionResult> Create(
    CreateCategoryViewModel model,
    CancellationToken cancellationToken)
{
    if (!ModelState.IsValid)
    {
        return View(model);
    }

    var code = model.Code.Trim();
    var name = model.Name.Trim();

    var codeExists = await _db.ArtifactCategories
        .AnyAsync(x => x.Code == code, cancellationToken);

    if (codeExists)
    {
        ModelState.AddModelError(nameof(model.Code), "分類代碼已存在。");
        return View(model);
    }

    var category = new ArtifactCategory
    {
        Id = Guid.NewGuid(),
        Code = code,
        Name = name
    };

    _db.ArtifactCategories.Add(category);
    await _db.SaveChangesAsync(cancellationToken);

    return RedirectToAction(nameof(Index));
}
```

整個 Entity 不用於自動綁定 POST 欄位；隱藏欄位傳回的價格、角色、UserId 或狀態也不直接視為可信值。

## 修改資料

修改時依 Id 取回受追蹤的 Entity，再逐欄更新允許修改的內容。

在 `QMAH.Web/Areas/Store/ViewModels/EditProductViewModel.cs` 建立輸入模型：

```csharp
using System.ComponentModel.DataAnnotations;

namespace QMAH.Web.Areas.Store.ViewModels;

public sealed class EditProductViewModel
{
    public Guid Id { get; set; }

    [Required(ErrorMessage = "請輸入商品名稱。")]
    [StringLength(200, ErrorMessage = "商品名稱最多 200 個字元。")]
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "庫存不可小於 0。")]
    public int Stock { get; set; }

    public bool IsActive { get; set; }
}
```

Controller 加入 `using QMAH.Web.Areas.Store.ViewModels;`，再建立 POST Action：

```csharp
[HttpPost]
[ValidateAntiForgeryToken]
public async Task<IActionResult> Edit(
    Guid id,
    EditProductViewModel model,
    CancellationToken cancellationToken)
{
    if (id != model.Id)
    {
        return BadRequest();
    }

    if (!ModelState.IsValid)
    {
        return View(model);
    }

    var product = await _db.Products
        .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);
    if (product is null)
    {
        return NotFound();
    }

    product.Name = model.Name.Trim();
    product.Description = model.Description?.Trim();
    product.Stock = model.Stock;
    product.IsActive = model.IsActive;
    product.UpdatedAt = DateTime.UtcNow;

    await _db.SaveChangesAsync(cancellationToken);

    return RedirectToAction(nameof(Index));
}
```

避免使用 `_db.Update(model)` 或把 POST 收到的 Entity 整筆標記為修改。這類寫法容易覆蓋畫面未顯示的欄位，也增加 overposting 風險。

`Price` 沒有出現在這個 ViewModel，因此這個 Action 不會修改價格。若功能需要改價，應另外加入有範圍驗證的欄位，並明確寫出 `product.Price = model.Price`；不以整筆 Update 取代欄位更新。

## 同時修改同一筆資料

目前有 `RowVersion` 的資料表共有 18 張：

- 會員與活動紀錄：`user.Achievements`、`user.UserAchievements`、`user.UserAddresses`、`user.UserProfiles`、`common.DailyMemberActivities`
- 遊戲資料：`game.GameRooms`、`game.GamePlayers`、`game.GameRounds`、`game.RoundAnswers`、`game.Votes`、`game.GameRoomInvitations`、`game.GameEconomySettings`、`game.GameModeDefinitions`、`game.MiniGameAttempts`
- 商城、社群加碼與鑰匙規則：`store.ProductReviews`、`admin.CommunityRewardCampaigns`、`catalog.KeyExchangeRules`

它們在 Entity 中都是 8 bytes 的 `byte[]`，由 SQL Server 的 `rowversion` 自動產生。用途是判斷資料是否在開啟編輯頁之後，又被其他程序修改；它不是流水號，也不是由 Controller 遞增的欄位。

遊戲的 `GameRooms.StateVersion` 和 `GameRounds.StateVersion` 是另一件事。它們是遊戲流程用的整數版本，讓即時遊戲知道房間狀態是否前進；不與 SQL Server 的 `RowVersion` 混用。

編輯這些資料時，不改動或產生新的 `RowVersion`。Edit ViewModel 應保存查詢時取得的 `byte[] RowVersion`，View 使用 hidden input 傳回；儲存前將它設定為 EF Core 的 OriginalValue，再捕捉 `DbUpdateConcurrencyException`。

```html
<input asp-for="RowVersion" type="hidden" />
```

遇到衝突時不直接覆蓋資料庫。顯示「資料已被其他人修改，請重新確認」並重新載入最新內容，由使用者決定是否再次送出。

會員修改所屬資料時，可用下列方式處理並行衝突。ViewModel 的 `RowVersion` 必須是 8 bytes 的 `byte[]`，不可改成程式產生的 Guid 或時間：

```csharp
using System.ComponentModel.DataAnnotations;

public sealed class EditProfileViewModel
{
    public Guid UserId { get; set; }

    [Required]
    [StringLength(80)]
    public string Nickname { get; set; } = string.Empty;

    [StringLength(1000)]
    public string? Bio { get; set; }

    [Required]
    public string Visibility { get; set; } = "PUBLIC";

    [Required]
    [MinLength(8)]
    [MaxLength(8)]
    public byte[] RowVersion { get; set; } = [];
}
```

```csharp
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

[Authorize]
[HttpPost]
[ValidateAntiForgeryToken]
public async Task<IActionResult> Edit(
    Guid id,
    EditProfileViewModel model,
    CancellationToken cancellationToken)
{
    var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (!Guid.TryParse(userIdValue, out var currentUserId))
    {
        return Challenge();
    }

    if (id != model.UserId || id != currentUserId)
    {
        return Forbid();
    }

    if (model.Visibility is not ("PUBLIC" or "FRIENDS" or "PRIVATE"))
    {
        ModelState.AddModelError(
            nameof(model.Visibility),
            "請選擇有效的公開範圍。");
    }

    if (!ModelState.IsValid)
    {
        return View(model);
    }

    var profile = await _db.UserProfiles
        .SingleOrDefaultAsync(x => x.UserId == id, cancellationToken);

    if (profile is null)
    {
        return NotFound();
    }

    profile.Nickname = model.Nickname.Trim();
    profile.Bio = model.Bio?.Trim();
    profile.Visibility = model.Visibility;
    profile.UpdatedAt = DateTime.UtcNow;

    _db.Entry(profile)
        .Property(x => x.RowVersion)
        .OriginalValue = model.RowVersion;

    try
    {
        await _db.SaveChangesAsync(cancellationToken);
        return RedirectToAction(nameof(Index));
    }
    catch (DbUpdateConcurrencyException)
    {
        var databaseValues = await _db.Entry(profile)
            .GetDatabaseValuesAsync(cancellationToken);

        if (databaseValues is null)
        {
            return NotFound();
        }

        model.RowVersion = databaseValues
            .GetValue<byte[]>(nameof(UserProfile.RowVersion));

        ModelState.Remove(nameof(model.RowVersion));
        ModelState.AddModelError(
            string.Empty,
            "資料已被其他人修改，請重新確認後再儲存。");

        return View(model);
    }
}
```

這段程式會保留使用者剛輸入的內容，但把 hidden `RowVersion` 換成資料庫最新值。畫面應提示衝突，不能在 catch 裡直接再次呼叫 `SaveChangesAsync()`，否則會在使用者不知情時覆蓋新資料。

> **官方參考：** SQL Server 的 `rowversion` 可作為整列資料的並行權杖。EF Core 偵測到資料已被更新時會拋出 `DbUpdateConcurrencyException`，應由應用程式重新讀取並決定如何處理衝突。
>
> [Handling Concurrency Conflicts](https://learn.microsoft.com/en-us/ef/core/saving/concurrency)

## 刪除與停用

刪除前應確認外鍵與歷史資料用途。

文物會同時出現在圖鑑、遊戲題庫與商城。Catalog 後台執行上架或下架時，該 Controller 以同一個資料庫交易同步三張表即可。日後若同一套同步規則由前台、後台或排程共同使用，再抽出 Service。

訂單、付款、點數、遊戲回合、作答、投票、解鎖與會員紀錄通常需要保留。這些資料若已被其他資料表引用，優先使用 `IsActive`、狀態或取消時間等欄位停用，不直接刪除。

只有確定沒有歷史用途、沒有外鍵引用，而且需求明確要求刪除時，才呼叫 `Remove()`。

## 跨表操作與交易

同一個 request 的 `_db` 可以追蹤多張資料表。若所有變更只呼叫一次 `SaveChangesAsync()`，EF Core 會以交易提交該次變更。

當流程中有多次 `SaveChangesAsync()`，或必須明確控制多個步驟同時成功或失敗時，使用資料庫交易：

```csharp
await using var transaction =
    await _db.Database.BeginTransactionAsync(cancellationToken);

try
{
    // 1. 重新查詢庫存、點數、折價券或遊戲狀態。
    // 2. 建立主要資料與歷史紀錄。
    // 3. 更新餘額、庫存或狀態。

    await _db.SaveChangesAsync(cancellationToken);
    await transaction.CommitAsync(cancellationToken);
}
catch
{
    await transaction.RollbackAsync(cancellationToken);
    throw;
}
```

長時間網路請求不放在交易內。第三方付款、寄信或外部 API 應先定義成功、失敗與重試方式，再決定資料庫狀態如何落地。

預設連線已停用 `MultipleActiveResultSets`。微軟文件指出 SQL Server 啟用 MARS 時，EF Core 不會建立交易儲存點；本專案沒有需要 MARS 的流程，因此保持停用，讓錯誤復原行為較明確。

> **官方參考：** 單次 `SaveChanges` 預設已包在交易中，只有多次儲存必須視為同一整體時，才需要手動控制交易。[Using Transactions](https://learn.microsoft.com/en-us/ef/core/saving/transactions)

## 圖片與資料列

資料庫保存 `/media/` 起算的網站相對路徑，不保存 `C:\...` 等個人電腦路徑。

新增或替換圖片時要同時確認：

- 副檔名、檔案大小與實際內容是否合法。
- 目標檔名不會覆蓋其他文物或商品。
- 資料列寫入失敗時，不會留下無人使用的檔案。
- 檔案寫入失敗時，不會留下指向不存在圖片的資料列。
- 刪除舊圖前，沒有其他資料列共用同一路徑。

資料庫交易無法回復檔案系統操作，因此圖片寫入需安排暫存、完成與清理順序。

## Identity

帳號、角色、密碼、登入、Token 與角色指派必須使用 Identity API：

- `UserManager<ApplicationUser>`
- `RoleManager<IdentityRole<Guid>>`
- `SignInManager<ApplicationUser>`

不直接新增或修改 `user.AspNetUsers`、`user.AspNetRoles`、密碼雜湊或登入 Token。

會員個人資料、地址、通知等 QMAH 業務資料可以透過 `QmahDbContext` 操作；登入憑證與角色仍交給 Identity 管理。

日後若加入 Google 或 Microsoft 登入，標準 Identity 會使用既有 `user.AspNetUserLogins` 保存外部帳號對應。`ApplicationUser` 不需要先增加供應商專用欄位。

帳號綁定與 Secret 設定詳見 [`identity-and-login.md`](../features/identity-and-login.md)。

> **官方參考：** ASP.NET Core Identity 專門管理使用者、密碼、角色、Claim、Token 與登入流程，並透過依賴注入提供管理 API。
>
> 密碼與角色不可當成一般 Entity 直接更新。[Introduction to Identity on ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity?view=aspnetcore-10.0)

## Dapper 的使用邊界

Dapper 已預先安裝，適合報表、統計或 EF Core 不易表達的唯讀 SQL。

一般 CRUD、關聯追蹤、跨表寫入與 Identity 仍使用 `QmahDbContext`。Dapper 的 SQL 能力不取代既有 Entity、授權或交易規則。

SQL 必須參數化，不可把使用者輸入直接串進 SQL 字串。

## Schema 變更

Controller 或啟動程式不呼叫：

```csharp
Database.Migrate();
Database.EnsureCreated();
```

欄位、索引、外鍵或 CHECK constraint 需要調整時，依下列順序處理：

1. 修改 SQL Server 設計。
2. 更新 `QMAH/database/Schema.sql`。
3. 重新進行 EF Core Scaffold 核對。
4. 視需要更新 Entity 與 `QmahDbContext` 對照。
5. 更新 Diagram。
6. 在同一次匯出流程中更新 QMAH-Database 的 `QMAH.sql` 與已驗證的交付產物。

不新增 EF Migration，也不建立 `__EFMigrationsHistory`。

Migration 本身沒有問題，但 QMAH 必須只保留一個 Schema 來源。QMAH 以 SQL Server 為來源，因此資料庫變更後核對並更新 Entity 與 mapping，不另外建立 Migration 版本來源。

## 常見問題

### `Invalid object name` 或找不到資料表

通常代表連到錯誤資料庫，或尚未還原參考 `.bak`／執行 QMAH-Database 的完整 `QMAH.sql`。確認連線字串中的 Server 與 Database，再到 SSMS 檢查 `admin`、`catalog`、`game`、`social`、`store`、`user` schema。

### 查詢回傳重複資料

檢查 `Include()` 與關聯是否造成一對多展開。列表可改用 `Select()` 投影 ViewModel，或確認是否真的需要載入完整集合。

### 修改後沒有寫入

確認查詢沒有使用 `AsNoTracking()`、Entity 是由同一個 `_db` 取回、程式有呼叫 `SaveChangesAsync()`，並檢查 ModelState 與例外訊息。

### 需要使用同一份 DbContext 嗎

同一個 request 直接使用注入的 `_db`。DbContext 不存成 static、不跨 request 共用，也不延長生命週期。

## 開發完成前檢查

- 唯讀查詢已使用 `AsNoTracking()` 或投影。
- 清單具備排序，資料量大時有篩選與分頁。
- POST 有 `[ValidateAntiForgeryToken]` 與 ModelState 檢查。
- 後端重新驗證外鍵、身分、價格、庫存與狀態。
- 修改採取回 Entity 後逐欄更新。
- 歷史資料沒有被直接刪除。
- 跨表流程已確認交易範圍與失敗處理。
- Identity 由 `UserManager`、`RoleManager`、`SignInManager` 操作。
- 沒有加入 Migration、`EnsureCreated()` 或程式端建表。

完整 `DbSet`、關聯與欄位對照詳見 [`QmahDbContext.cs`](https://github.com/MSIT173-03/QMAH/blob/main/QMAH.Infrastructure/Data/QmahDbContext.cs)。

Entity 檔案位於 [`Models/Entities`](https://github.com/MSIT173-03/QMAH/tree/main/QMAH.Infrastructure/Models/Entities)。

## 跨主機與檔案界線

| 入口 | 讀寫契約 | 實作位置 |
| --- | --- | --- |
| Razor 管理後台 | Area ViewModel、Cookie、ModelState | `QMAH.Web/Areas/<Area>` |
| Angular 使用者前台 | `/api/v1` DTO、Cookie、Anti-forgery | `QMAH.Client/src/app` 與 `QMAH.Api/Controllers/V1` |
| 文物匯入 | JSON 欄位、預檢結果、冪等同步 | `QMAH.Infrastructure/Infrastructure/CatalogImport` 與資料工具 |
| Identity | `UserManager`、`SignInManager`、`RoleManager` | `QMAH.Infrastructure` 與各入口的 Controller |

Razor 與 API 可以使用不同主機與連接埠，但必須指向同一個 SQL Server 資料庫。

Angular 不直接連資料庫，也不把後端 Entity 複製成前端業務契約。完整 request、response、權限與錯誤狀態以 [REST API 契約](../reference/rest-api.md) 為準。

媒體網址由後端 Resolver 產生。前台不從 `ArtifactId`、分類代碼或檔名拼接網址。
