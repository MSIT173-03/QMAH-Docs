# Tailwind CSS：排版與響應式

要調間距、排列方式、寬度或手機版面，從這頁開始。QMAH.Client 已安裝 Tailwind CSS 4，直接在 Component 的 HTML 加 class 即可。

## 先試一個排版

```html
<section class="mx-auto grid max-w-6xl gap-6 p-6 md:grid-cols-3">
  <div>文物一</div>
  <div>文物二</div>
  <div>文物三</div>
</section>
```

這段會把內容置中、限制最大寬度，並加上內距與項目間距。小螢幕預設一欄，到 `md` 斷點改為三欄。樣式 class 寫在 HTML；資料與操作仍由 Angular 處理。

## 常用 class 對照

| 一般 CSS 需求 | Tailwind |
| --- | --- |
| `display: flex` | `flex` |
| `display: grid` | `grid` |
| `gap: 1rem` | `gap-4` |
| `padding: 1.5rem` | `p-6` |
| `margin-inline: auto` | `mx-auto` |
| `width: 100%` | `w-full` |
| `align-items: center` | `items-center` |
| `justify-content: space-between` | `justify-between` |
| 圓角 | `rounded-*` |
| `font-weight: 700` | `font-bold` |
| media query | `md:*`、`lg:*` |
| `:hover`／`:focus` | `hover:*`／`focus:*` |
| transition | `transition` |

更多 class 直接查 [Tailwind utilities](https://tailwindcss.com/docs/styling-with-utility-classes)、[responsive design](https://tailwindcss.com/docs/responsive-design) 與 [state variants](https://tailwindcss.com/docs/hover-focus-and-other-states)。

## 什麼時候改用其他工具

- 按鈕、卡片、輸入框的外觀：用 [daisyUI](daisyui-guide.md)。
- 想找整段頁面排版：參考 [HyperUI](hyperui-guide.md)。
- 複雜動畫、特殊 selector，或 class 太多難讀：寫在 Component SCSS，詳見 [SCSS 與全域 CSS 分工](angular-development.md#ui-and-styling)。

既有 CSS／SCSS 正常就保留，不必為了使用 Tailwind 全部重寫。
