import { defineConfig } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { algolia } from './algolia'
import { en } from './en'

export default defineConfig({
  title: 'Pinia Plugin Persistedstate',
  base: '/pinia-plugin-persistedstate/',
  head: [
    ['link', {
      rel: 'icon',
      href: '/pinia-plugin-persistedstate/favicon.ico',
    }],
  ],
  lastUpdated: true,
  markdown: {
    typographer: true,
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
      options: algolia,
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/prazdevs/pinia-plugin-persistedstate',
      },
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
