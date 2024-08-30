import { defineConfig } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { en } from './en'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Pinia Plugin Persistedstate',
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  lastUpdated: true,
  markdown: {
    typographer: true,
    codeTransformers: [
      transformerTwoslash(),
    ],
    theme: {
      dark: 'catppuccin-mocha',
      light: 'catppuccin-latte',
    },
  },
  themeConfig: {
    logo: {
      light: '/logo-light.svg',
      dark: '/logo-dark.svg',
    },
    search: {
      provider: 'algolia',
      options: {
        appId: '90OL5Y5T3K',
        apiKey: '20f9f00e8b98bae16d443559f1879aa9',
        indexName: 'pinia-plugin-persistedstate',
      },
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/prazdevs/pinia-plugin-persistedstate' },
    ],
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      ...en,
    },
  },
})
