import { defineConfig } from 'vitepress'
import { version } from '../../package.json'

const currentVersion = `v${version}`

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
      copyright: `Copyright © 2021-${new Date().getFullYear()} prazdevs & contributors`,
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
      {
        text: currentVersion,
        items: [
          {
            items: [{
              text: 'Release Notes',
              link: 'https://github.com/prazdevs/pinia-plugin-persistedstate/releases',
            }],
          },
          {
            text: 'Versions',
            items: [
              {
                text: `${currentVersion} (Current)`,
                activeMatch: '/',
                link: '/',
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
