import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-TW',
  title: 'QMAH 開發文件',
  description: 'QMAH 開發文件｜環境、架構、API、前端、管理後台與功能設計',
  base: '/QMAH-Docs/',
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: '文件首頁', link: '/' },
      { text: 'QMAH 專案', link: 'https://github.com/MSIT173-03/QMAH' },
      { text: '開發資料庫', link: 'https://github.com/MSIT173-03/QMAH-Database' }
    ],
    search: {
      provider: 'local'
    },
    sidebar: [
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
          { text: '資料庫 Diagram 對照', link: '/architecture/database-diagram' }
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
          { text: 'Git 與 GitHub 協作', link: '/reference/git-workflow' }
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
