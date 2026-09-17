# 圖鑑與鑰匙背包串接

本頁供圖鑑前端開發者實作「點解鎖 → 選鑰匙 → 確認 → 顯示收藏卡」。後端負責驗證範圍、扣鑰匙與保存解鎖；前端負責選擇、顯示結果與刷新資料。契約核對日期：2026-09-17；程式已建置驗證，尚未完成實際資料庫端到端測試。

## 頁面要讀哪些 API

所有路徑以下皆以 `/api/v1` 開頭。

| 用途 | 方法與路徑 | 畫面使用的欄位 |
| --- | --- | --- |
| 會員圖鑑 | GET `/api/v1/me/catalog/artifacts` | `id`、`name`、`categoryId`、`eraBucketId`、`thumbnailPath`、`isUnlocked`、`unlockedAt` |
| 鑰匙背包 | GET `/api/v1/me/economy` | `keys` 中的 `code`、`name`、`scopeType`、`categoryId`、`eraBucketId`、`balance`、`eligibleArtifactCount` |
| 解鎖歷史 | GET `/api/v1/me/catalog/unlocks` | `artifactId`、`artifactName`、`unlockMethod`、`keyCode`、`keyName`、`gameRoundId`、`unlockedAt` |
| 收藏卡詳情 | GET `/api/v1/catalog/artifacts/{id}` | 文物完整內容、圖片與來源授權 |

注意：背包的鑰匙代碼欄位是 `keys[].code`，歷史才叫 `keyCode`。不要自行拼代碼，也不要把 `CATEGORY` 等範圍類型當成路徑值。

圖鑑與歷史皆支援 `q`、`categoryCode`、`eraCode`、`page`、`pageSize`。分類／年代選項可由 GET `/api/v1/catalog/categories` 與 `/api/v1/catalog/eras` 取得。會員由登入 Cookie 決定，請求不傳 `userId`。

## 點文物的解鎖按鈕

### 獨立查詢鑰匙定義

需要呈現鑰匙規則或單把鑰匙詳情時，使用以下登入後 API：

| 方法與路徑 | 回應 |
| --- | --- |
| GET `/api/v1/catalog/key-definitions` | 所有啟用定義的 JSON 陣列 |
| GET `/api/v1/catalog/key-definitions/{keyCode}` | 單一定義；不存在或停用為 404 |

每筆包含 `id`、`code`、`name`、`scopeType`、`categoryId`、`categoryCode`、`categoryName`、`eraBucketId`、`eraCode`、`eraName`、`recyclePointValue`、`canSelectArtifact`。不適用的分類／年代欄位為 null。定義不含會員餘額，以 `id` 或 `code` 對應 `/me/economy` 的 `keys`。

`canSelectArtifact` 為 false 的一般鑰匙只能隨機解鎖；true 仍須核對分類／年代、會員餘額與候選數。使用定義回傳的 `code` 呼叫既有 POST `/api/v1/me/keys/{keyCode}/unlock`；查詢定義本身不扣鑰匙、不解鎖。停用與新建規則由資料庫即時反映，不需前端新增硬編碼。

### 選擇與送出

1. 若 `isUnlocked` 為 true，直接開收藏卡；否則開啟鑰匙選擇視窗。
2. 重新讀取 `/api/v1/me/economy`，篩出還有餘額且適用這件文物的鑰匙。
3. 顯示鑰匙名稱、持有數量與「本次消耗 1 把」，讓使用者選一把。
4. 尚未選擇或正在送出時，停用確認按鈕。沒有可用選項時顯示空狀態。
5. 確認後送出指定文物的解鎖請求。

| 鑰匙 scopeType | 可否解鎖眼前這件文物 |
| --- | --- |
| `NORMAL` | 不可指定，僅放在背包的隨機解鎖入口 |
| `CATEGORY` | `key.categoryId === artifact.categoryId` |
| `ERA` | `key.eraBucketId === artifact.eraBucketId` |
| `UNIVERSAL` | 可指定任一啟用且未解鎖文物 |

所有選項都必須符合 `balance > 0`、`eligibleArtifactCount > 0`，且文物尚未解鎖。這是介面篩選，後端仍會重新驗證。每把只解鎖一件，並非整個分類或年代。

以下片段放入既有 Angular API service；`http` 是已注入的 HttpClient，`environment.apiBaseUrl` 為 `/api/v1`：

```ts
unlockArtifact(keyCode: string, artifactId?: string) {
  return this.http.post<{
    unlocked: boolean;
    artifactId: string | null;
    artifactName: string | null;
    remainingEligibleArtifactCount: number;
    message: string | null;
  }>(
    `${environment.apiBaseUrl}/me/keys/${encodeURIComponent(keyCode)}/unlock`,
    artifactId ? { artifactId } : {},
  );
}
```

指定解鎖呼叫 `unlockArtifact(selectedKey.code, selectedArtifact.id)`。背包隨機解鎖呼叫 `unlockArtifact(selectedKey.code)`，後端依鑰匙綁定範圍抽選，前端不要自行抽文物。

## 登入與防偽驗證

沿用專案 HttpClient 登入設定與同源 `/api/v1` 路徑。寫入前確保已取得 GET `/api/v1/account/antiforgery-token`；使用 `XSRF-TOKEN-API` Cookie 和 `X-XSRF-TOKEN` 標頭。不要在圖鑑另存會員密碼或自行建立登入機制。詳細流程見 [REST API 契約](../reference/rest-api.md)。

## 成功後刷新畫面

HTTP 200 後仍要判斷 `unlocked`。true 才顯示解鎖成功，使用回傳 `artifactId` 讀取收藏卡詳情；false 表示沒有候選且未扣鑰匙，顯示 `message`。

重新讀取背包與會員圖鑑；若畫面有解鎖歷史，也一併刷新。保留目前搜尋、分類、年代及頁碼，不要每次跳回首頁。以 API 回應更新數量，避免只在前端減一把造成資料不同步。

解鎖已成功但刷新失敗時，顯示「已解鎖，列表更新失敗」，只重試 GET。逾時或斷線時先查詢背包及解鎖狀態，不要自動重送 POST，尤其隨機解鎖可能再次扣鑰匙並取得另一件文物。

| 回應 | 介面處理 |
| --- | --- |
| 400 | 顯示錯誤原因；可能是目標不符或防偽驗證失敗 |
| 401 | 引導登入 |
| 403 | 顯示權限不足 |
| 404 | 刷新資料，鑰匙或文物可能已停用 |
| 409 | 顯示餘額／狀態衝突並刷新背包 |

業務錯誤通常以 ProblemDetails 的 `detail` 說明原因；仍需處理空本文或非 JSON 錯誤回應。

## 遊戲、管理員與解鎖列表

多人遊戲在 POST `/api/v1/game/rooms/{id}/reward` 成功結算時寫入 `GAME` 解鎖。必須呼叫這個結算入口，不是房間完成就會自行觸發。Mini Game 完成目前只發點數及鑰匙進度，不直接解鎖文物。

管理員使用 POST `/api/v1/admin/catalog/members/{userId}/artifacts/{artifactId}/unlock`，要求 Admin 角色，來源為 `ADMIN`，不扣鑰匙，重複操作回傳 `created=false`。普通會員畫面不呼叫此端點。

歷史的 `unlockMethod` 為 `KEY` 時顯示 `keyName`，`GAME` 顯示遊戲取得，`ADMIN` 顯示管理員發放。重新進入圖鑑時查詢會員列表即可取得最新狀態，不以 localStorage 保存的解鎖狀態為準。

目前歷史 API 沒有縮圖欄位；會員圖鑑清單有 `thumbnailPath`。目前也沒有會員圖鑑的 `isUnlocked` 查詢參數，不能只篩當頁資料卻當成全部已收藏數量。灰階與是否開啟收藏卡屬於介面行為；公開文物詳情 API 本身不以會員解鎖狀態限制讀取。

## 串好後的驗收

測試指定文物、範圍不符、餘額不足、無候選、連點與斷線情況。確認成功後背包減一、文物變成已解鎖、歷史來源正確；失敗不應先播放成功效果。切換會員後重新取得所有會員資料。
