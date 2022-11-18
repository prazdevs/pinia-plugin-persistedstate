import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/pinia-plugin-persistedstate/',
  title: 'pinia-plugin-persistedstate',
  description: '🍍 Configurable persistence and rehydration of Pinia stores.',
  head: [
    ['link', { rel: 'icon', href: '/pinia-plugin-persistedstate/favicon.ico' }],
  ],
  lastUpdated: true,
  markdown: {
    theme: {
      dark: 'vitesse-dark',
      light: 'vitesse-light',
    },
  },
  themeConfig: {
    logo: '/logo.png',
    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © 2021-${new Date().getFullYear()} Sacha Bouillez & contributors`,
    },
    editLink: {
      pattern: 'https://github.com/prazdevs/pinia-plugin-persistedstate/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/prazdevs/pinia-plugin-persistedstate',
      },
    ],
    nav: [
      {
        text: 'Guide',
        link: '/guide/',
        activeMatch: '/guide/',
      },
    ],
    sidebar: {
      '/': [
        {
          text: 'Guide',
          items: [
            {
              text: 'Why this plugin?',
              link: '/guide/why',
            },
            {
              text: 'Getting Started',
              link: '/guide/',
            },
            {
              text: 'Configuration',
              link: '/guide/config',
            },
            {
              text: 'Limitations',
              link: '/guide/limitations',
            },
            {
              text: 'Advanced Usage',
              link: '/guide/advanced',
            },
          ],
        },
      ],
    },
  },
})
