# HyperUI：複製排版，再接上 Angular

想找商品列表、卡片組合或頁面區塊時，到 [HyperUI](https://hyperui.dev/) 挑範例。它提供可複製的 HTML 與 Tailwind classes；QMAH 把它當排版參考，不是 npm 套件。

## 搬進 Angular 的步驟

1. 到 HyperUI 找適合的 block，複製 HTML 與 Tailwind classes。
2. 放進 Angular component template。
3. Static data 改成 Angular binding，loop 改成 `@for`，condition 改成 `@if`。
4. Interaction 改成 Angular event 與 state，不搬 `document.querySelector`、手動 DOM state 或 vanilla JavaScript toggle。
5. 檢查固定品牌色是否應改成 QMAH／daisyUI semantic theme。
6. `grid`、`gap-*`、`max-w-*`、`md:*`、`lg:*`、`aspect-*`、`object-cover` 等 layout utilities 通常可保留。

例如 `bg-white`、`text-gray-900`、`border-gray-200`、`bg-indigo-600` 應先判斷是否改為 `bg-base-100`、`text-base-content`、`border-base-300` 或 `btn-primary`，不要機械替換。不要執行 `npm install hyperui`。

## 搬入後的 Angular 範例

以下是假設 Component 已提供 `artifacts()` 與 `openArtifact(id)` 的組合範例：

```html
<section class="grid gap-6 md:grid-cols-3">
  @for (artifact of artifacts(); track artifact.id) {
    <article class="card bg-base-100 shadow-sm">
      <div class="card-body">
        <h2 class="card-title">{{ artifact.name }}</h2>
        <button class="btn btn-primary" type="button"
                (click)="openArtifact(artifact.id)">查看文物</button>
      </div>
    </article>
  }
</section>
```

- `grid`、`gap-6`、`md:grid-cols-3`：保留 Tailwind 的排版方式。
- `card`、`btn`、`bg-base-100`：沿用 daisyUI 共用外觀與色彩。
- `@for`、插值、`(click)`：接上 Angular 的資料與操作。

搬入後確認手機版面、鍵盤操作及按鈕事件，再用真實資料檢查空資料與載入狀態。不要把範例中的假連結或 JavaScript 開關直接當成功能完成。

查 class 用法：[Tailwind](tailwind-guide.md)、[daisyUI](daisyui-guide.md)。共用規則見 [Angular UI 與樣式](angular-development.md#ui-and-styling)。
