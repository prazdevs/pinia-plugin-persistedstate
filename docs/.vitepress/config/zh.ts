import { version } from '../../../packages/plugin/package.json'

export const zh = {
  lang: 'zh',
  label: '简体中文',
  title: 'pinia-plugin-persistedstate',
  description: '🍍 适用于 Pinia 的持久化存储插件',
  themeConfig: {
    lastUpdatedText: '最近更新时间',
    outline: {
      label: '目录',
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
    editLink: {
      pattern: 'https://github.com/prazdevs/pinia-plugin-persistedstate/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面',
    },
    footer: {
      message: '根据 MIT 许可证发布',
      copyright: `Copyright © 2021-${new Date().getFullYear()} prazdevs & contributors`,
    },
    nav: [
      {
        text: '指南',
        link: '/zh/guide/',
        activeMatch: '/zh/guide/',
      },
      {
        text: '框架',
        activeMatch: '/zh/frameworks/',
        items: [
          {
            text: 'Nuxt 3',
            link: '/zh/frameworks/nuxt-3',
            activeMatch: '/zh/frameworks/nuxt-3',
          },
        ],
      },
      {
        text: `v${version}`,
        items: [
          {
            items: [
              {
                text: '发行说明',
                link: 'https://github.com/prazdevs/pinia-plugin-persistedstate/releases',
              },
            ],
          },
          {
            text: '版本',
            items: [
              {
                text: `v${version} (当前)`,
                activeMatch: '/zh/',
                link: '/zh/',
              },
              {
                text: 'v2.4.0',
                link: 'https://prazdevs.github.io/pinia-plugin-persistedstate-v2/',
              },
              {
                text: 'v1.6.3',
                link: 'https://github.com/prazdevs/pinia-plugin-persistedstate/blob/45046f09b62ff4f17fb432cc9ca61649675a6f75/README.md',
              },
            ],
          },
        ],
      },
    ],
    sidebar: [
      {
        text: '指南',
        items: [
          {
            text: '为什么你应该使用该插件？',
            link: '/zh/guide/why',
          },
          {
            text: '开始',
            link: '/zh/guide/',
          },
          {
            text: '配置',
            link: '/zh/guide/config',
          },
          {
            text: '局限性',
            link: '/zh/guide/limitations',
          },
          {
            text: '进阶用法',
            link: '/zh/guide/advanced',
          },
          {
            text: '从 v2 迁移',
            link: '/zh/guide/migrating',
          },
        ],
      },
      {
        text: '框架',
        items: [
          {
            text: 'Nuxt 3',
            link: '/zh/frameworks/nuxt-3',
          },
        ],
      },
    ],
  },
}
