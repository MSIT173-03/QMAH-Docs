import { defineConfig } from 'vitepress'

const docsBase = '/QMAH-Docs/'

export default defineConfig({
  lang: 'zh-TW',
  title: 'QMAH 開發文件',
  description: 'QMAH 開發文件｜環境、架構、API、前端、管理後台與功能設計',
  base: docsBase,
  cleanUrls: true,
  head: [
    ['link', { rel: 'icon', href: `${docsBase}favicon.svg`, type: 'image/svg+xml' }]
  ],
  vite: {
    plugins: [
      {
        name: 'qmah-favicon-fallback',
        configureServer(server) {
          server.middlewares.use((request, response, next) => {
            if (request.url === '/favicon.ico') {
              response.statusCode = 302
              response.setHeader('Location', `${docsBase}favicon.svg`)
              response.end()
              return
            }
            next()
          })
        }
      }
    ]
  },
  transformHtml(code) {
    const designContract = `<!--
THESIS: QMAH-Docs makes the next development action visible without hiding the system boundary.
OWN-WORLD: Ink navy, porcelain blue, verdigris, and a restrained cinnabar mark; ruled index lines and accession-style labels.
STORY: A reader enters through a task, follows one canonical page, then returns to code, API, or the shared snapshot with less ambiguity.
OPENING SEQUENCE: The opening sequence shows the reading route, six quick-reference pages in Shared, Catalog, Game, Social, User, Store order, and the full directory in that order.
FORM: An accession-ledger field index with a visible task rail, a fixed quick-reference template, and readable dense-data fallbacks.
FINISH: The build is checked for content order, internal links, narrow-screen reflow, keyboard focus, and reduced motion; the current review is recorded in DESIGN.md.
-->`
    return code.replace(/<body([^>]*)>/, `<body$1>${designContract}`)
  },
  themeConfig: {
    nav: [
      { text: '文件首頁', link: '/' },
      { text: 'QMAH 專案', link: 'https://github.com/MSIT173-03/QMAH' },
      { text: 'QMAH-Docs 專案', link: 'https://github.com/MSIT173-03/QMAH-Docs' },
      { text: 'QMAH-Database 專案', link: 'https://github.com/MSIT173-03/QMAH-Database' }
    ],
    search: {
      provider: 'local'
    },
    sidebar: [
      {
        text: '六個入口快速查詢',
        collapsed: false,
        items: [
          { text: 'Shared｜共用基礎', link: '/quick-reference/shared' },
          { text: 'Catalog｜圖鑑與文物', link: '/quick-reference/catalog' },
          { text: 'Game｜遊戲與作答', link: '/quick-reference/game' },
          { text: 'Social｜社群與活動', link: '/quick-reference/social' },
          { text: 'User｜會員與 Identity', link: '/quick-reference/user' },
          { text: 'Store｜商城與訂單', link: '/quick-reference/store' }
        ]
      },
      {
        text: '開始開發',
        items: [
          { text: '開發環境與啟動', link: '/getting-started/development-environment' },
          { text: '開發資料與本機展示', link: '/getting-started/development-data' }
        ]
      },
      {
        text: '架構',
        items: [
          { text: '系統架構總覽', link: '/architecture/system-overview' },
          { text: 'Area 責任與資料界線', link: '/architecture/area-boundaries' },
          { text: '資料存取與 DB-first', link: '/architecture/data-access' },
          { text: '資料庫 Diagram 對照', link: '/architecture/database-diagram' },
          { text: '資料表參考', link: '/architecture/database-reference' }
        ]
      },
      {
        text: '前端',
        items: [
          { text: 'Angular 使用者前台開發', link: '/frontend/angular-development' },
          { text: '媒體交付設定', link: '/frontend/media-delivery' }
        ]
      },
      {
        text: '管理後台',
        items: [
          { text: '管理後台開發起點', link: '/admin/backend-development' },
          { text: 'Razor 與 Tabler 介面', link: '/admin/razor-admin-ui' }
        ]
      },
      {
        text: '功能',
        items: [
          { text: '文物資料匯入', link: '/features/catalog-import' },
          { text: '資料與圖片使用', link: '/features/data-and-media' },
          { text: '經濟與進程', link: '/features/economy-progression' },
          { text: 'Identity 與登入', link: '/features/identity-and-login' },
          { text: '地點與地圖串接', link: '/features/map-integration' }
        ]
      },
      {
        text: '參考',
        items: [
          { text: 'REST API 契約', link: '/reference/rest-api' },
          { text: 'API 名詞表', link: '/reference/api-glossary' },
          { text: 'CRUD 與 Scaffold', link: '/reference/crud-and-scaffolding' },
          { text: '資料工具', link: '/reference/data-tools' },
          { text: 'Git 與 GitHub 協作', link: '/reference/git-workflow' },
          { text: '官方參考索引', link: '/reference/official-references' }
        ]
      }
    ],
    outline: 'deep',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/MSIT173-03/QMAH-Docs' }
    ],
    footer: {
      message: 'QMAH 專題開發文件',
      copyright: 'QMAH'
    }
  }
})
