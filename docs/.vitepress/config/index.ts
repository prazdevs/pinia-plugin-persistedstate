import { defineConfig } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'

import { algolia } from './locales/algolia'
import { root } from './locales/root'
import { zh } from './locales/zh'

export default defineConfig({
  base: '/pinia-plugin-persistedstate/',
  head: [
    ['link', { rel: 'icon', href: '/pinia-plugin-persistedstate/favicon.ico' }],
  ],
  lastUpdated: true,
  markdown: {
    codeTransformers: [
      transformerTwoslash({
        twoslashOptions: {
          compilerOptions: {
            types: ['pinia-plugin-persistedstate'],
          },
        },
      }),
    ],
    theme: {
      light: 'catppuccin-latte',
      dark: 'catppuccin-mocha',
    },
  },
  themeConfig: {
    logo: '/logo.svg',
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/prazdevs/pinia-plugin-persistedstate',
      },
    ],
    search: {
      provider: 'algolia',
      options: {
        appId: '90OL5Y5T3K',
        apiKey: '20f9f00e8b98bae16d443559f1879aa9',
        indexName: 'pinia-plugin-persistedstate',
        locales: algolia,
      },
    },
  },
  locales: {
    root,
    zh,
  },
})
