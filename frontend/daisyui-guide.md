# daisyUI：按鈕、卡片與表單外觀

要做按鈕、卡片、輸入框或載入狀態，從這頁開始。QMAH.Client 已安裝 daisyUI 5；直接在 HTML 使用 class，不需要另外匯入 Angular UI 元件。

## daisyUI 的日常用法

基本按鈕使用 daisyUI：

```html
<button class="btn btn-primary" type="button">儲存</button>
```

需要排版時，在同一個元素加 Tailwind class：

```html
<button class="btn btn-primary w-full md:w-auto" type="button">
  加入收藏
</button>
```

互動狀態由 Angular 管理，呈現使用 daisyUI：

```html
<button
  class="btn btn-primary"
  type="button"
  [disabled]="saving()"
  (click)="save()"
>
  @if (saving()) {
    <span class="loading loading-spinner"></span>
  }
  儲存
</button>
```

`[disabled]`、`(click)`、`@if` 與 `saving()` 是 Angular；`btn`、`btn-primary`、`loading` 與 `loading-spinner` 是 daisyUI。

## Theme 與頁面自由度

共用 UI 優先使用 daisyUI semantic classes：

- 品牌操作：`primary`、`secondary`、`accent`。
- 頁面表面：`bg-base-100`、`bg-base-200`、`bg-base-300`、`text-base-content`、`border-base-300`。
- 狀態：`info`、`success`、`warning`、`error`。

共用 Button、Input、Form、狀態色、字體基線、間距節奏與表面語言應維持一致，避免各頁到處使用 `bg-[#xxxxxx]` 或 `text-[#xxxxxx]` 另建一套色彩。Arbitrary values 仍可用於 illustration、裝飾、Domain artwork 與局部視覺效果。

Catalog 可以採圖鑑 gallery，Store 可以採商品 grid，Social 可以採 feed／thread layout；各 Domain 可自行決定 page layout、hero、內容密度、card composition、圖片、section structure 與 responsive arrangement。共同按鈕、form control、semantic colors 與 surface treatment 沿用同一基線。

## 常用元件去哪裡查

| 想做什麼 | 常用 class | 範例 |
| --- | --- | --- |
| 按鈕 | `btn btn-primary` | [Button](https://daisyui.com/components/button/) |
| 卡片 | `card`、`card-body`、`card-title` | [Card](https://daisyui.com/components/card/) |
| 文字輸入 | `input` | [Input](https://daisyui.com/components/input/) |
| 提示標籤 | `badge` | [Badge](https://daisyui.com/components/badge/) |
| 載入中 | `loading loading-spinner` | [Loading](https://daisyui.com/components/loading/) |
| 對話框 | `modal`、`modal-box` | [Modal](https://daisyui.com/components/modal/) |

class 只負責外觀。表單驗證、送出、防重送、對話框開關與 API 呼叫仍需接上 Angular 邏輯；上面的 `saving()` 和 `save()` 也需要由 Component 實作。

搭配 [Tailwind 排版](tailwind-guide.md)，或參考 [HyperUI 頁面組合](hyperui-guide.md)。共用設定與 SCSS 規則見 [Angular UI 與樣式](angular-development.md#ui-and-styling)。
