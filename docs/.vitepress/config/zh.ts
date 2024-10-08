import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'
import { version } from '../../../package.json'

export const zh: LocaleSpecificConfig<DefaultTheme.Config> = {
  description: 'Pinia stores的可配置持久性.',
  themeConfig: {
    editLink: {
      text: '建议对此页面进行更改',
      pattern: 'https://github.com/prazdevs/pinia-plugin-persistedstate/edit/main/docs/:path',
    },
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

    outline: {
      label: '页面导航',
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },
    nav: [
      {
        text: '指南',
        link: '/zh/guide/',
        activeMatch: '/zh/guide/',
      },
      {
        text: '框架',
        items: [
          { text: 'Nuxt', link: '/zh/frameworks/nuxt' },
          { text: '其他框架', link: '/zh/frameworks/others' },
        ],
      },
      {
        text: `v${version}`,
        items: [
          {
            items: [{
              text: '发行说明',
              link: 'https://github.com/prazdevs/pinia-plugin-persistedstate/releases',
            }],
          },
          {
            text: '版本',
            items: [
              {
                text: `${version} (Current)`,
                activeMatch: '/',
                link: '#',
              },
              {
                text: '3.2.2',
                link: 'https://github.com/prazdevs/pinia-plugin-persistedstate/tree/v3',
              },
              {
                text: '2.4.0',
                link: 'https://github.com/prazdevs/pinia-plugin-persistedstate/tree/v2',
              },
              {
                text: '1.6.3',
                link: 'https://github.com/prazdevs/pinia-plugin-persistedstate/tree/v2',
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
          { text: '为什么使用这个插件？', link: '/zh/guide/why' },
          { text: '开始', link: '/zh/guide/' },
          { text: '配置', link: '/zh/guide/config' },
          { text: '局限性', link: '/zh/guide/limitations' },
          { text: '高级用法', link: '/zh/guide/advanced' },
        ],
      },
      {
        text: '框架',
        items: [
          { text: 'Nuxt', link: '/zh/frameworks/nuxt' },
          { text: '其他框架', link: '/zh/frameworks/others' },
        ],
      },
    ],
    footer: {
      message: '基于 MIT 许可发布。',
      copyright: '版权所有 © 2021 年至今 Sacha Bouillez 及贡献者',
    },

  },
}
