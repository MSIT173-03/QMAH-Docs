# 文件圖表來源與重建

本目錄的每張圖有三個層次：

- `.json`：Diagram IR（圖表中介格式），是內容、節點座標、連線方向與固定端點的來源。
- `.drawio`：由 IR 編譯出的可編輯檔，供 draw.io Desktop 調整視覺細節或人工檢視。
- `rendered/*.svg`：文件站引用的靜態輸出；不可直接把 SVG 當成下一次修改的來源。

## 圖表對照

資產說明圖使用 Agents365-ai/drawio-skill 的 XML 與驗證規則。執行 `node diagrams/render-ledger.mjs` 產生 `asset-adjustment-flow.drawio`、`asset-ledger-map.drawio`；再用 draw.io Desktop 的 `-x -f svg -e --embed-svg-images` 匯出到同名 `rendered/*.svg`。原始資料與版面保存在腳本，可編輯檔保存在 `.drawio`。第一張表示操作順序，第二張表示查帳用途，均不是 SQL 外鍵圖。

| IR 來源 | 可編輯檔 | 文件站輸出 | 用途 |
| --- | --- | --- | --- |
| `system-architecture.json` | `system-architecture.drawio` | `rendered/system-architecture.svg` | 前台、後台、API、共用服務、資料庫、資料工具、媒體與文件交付 |
| `data-relationships.json` | `data-relationships.drawio` | `rendered/data-relationships.svg` | 共用、Catalog、Game、Social、Store 的常用資料主線 |
| `api-auth-flow.json` | `api-auth-flow.drawio` | `rendered/api-auth-flow.svg` | 防偽 Cookie、登入 Cookie 與會員查詢流程 |
| `order-lifecycle.json` | `order-lifecycle.drawio` | `rendered/order-lifecycle.svg` | `StoreOrders` 與 `Payments` 的狀態流程 |
| `snapshot-pipeline.json` | `snapshot-pipeline.drawio` | `rendered/snapshot-pipeline.svg` | 隔離資料庫、展示資料、驗證與 QMAH-Database Snapshot 交付 |

資料表完整欄位、外鍵與限制不放進總覽圖，集中維護於 [資料表參考](../architecture/database-reference.md) 與 `QMAH/database/Schema.sql`。圖中的連線只表示方向與關係；欄位、方法與流程條件放在節點、圖例或對應正文，不把文字壓在連線上。未來需要補充關係文字時，使用獨立旁註節點並安排在連線外側。

## 重建環境

圖表使用已安裝的 `drawio-diagram-engineer` Skill。工具需要 Python 3.9 以上；若需要輸出正式 SVG 或 PNG，另需 draw.io Desktop。安裝位置可依執行環境調整，以下以目前工作區的安裝位置為例：

```powershell
$SkillRoot = 'C:\Users\Hsuan\.codex\skills\drawio-diagram-engineer'
$Tool = Join-Path $SkillRoot 'scripts\drawio_tool.py'
$Theme = Join-Path $SkillRoot 'assets\themes\corporate.json'
python $Tool doctor --format json
```

## 重新產生一張圖

`-o` 指定暫存 bundle 位置，`--name` 指定編輯檔名稱。來源檔、輸出檔與圖表名稱必須保持同一個 basename。

```powershell
$Name = 'system-architecture'
$Source = ".\diagrams\$Name.json"
$Bundle = Join-Path $env:TEMP "qmah-diagram-$Name"

python $Tool build $Source `
  -o $Bundle `
  --name $Name `
  --theme-file $Theme `
  --strict `
  --force

Copy-Item (Join-Path $Bundle "$Name.drawio") ".\diagrams\$Name.drawio" -Force
python $Tool render ".\diagrams\$Name.drawio" `
  -o ".\diagrams\rendered\$Name.svg" `
  -f svg
```

`build --strict` 必須通過結構、重疊、端點與連線交叉檢查；`render` 會再次驗證輸出檔。人工調整 `.drawio` 後，若要保留調整結果，需先以 `extract` 產回相同 basename 的 `.json`，再重新檢查文件引用：

```powershell
python $Tool extract ".\diagrams\$Name.drawio" `
  -o ".\diagrams\$Name.json" `
  --strict
```

新增節點或連線時，先修改 `.json`；連線端點只有在自動路由仍無法清楚表達關係時才固定為 `north`、`east`、`south` 或 `west`，並以 `source_offset`／`target_offset` 分開同一節點的多條線。連線保留無文字的線與箭頭；需要解釋時，將短文字放在節點描述或連線外側的旁註。輸出後需檢查正常縮放與手機寬度下的標籤、箭頭、節點邊界與群組標題。
