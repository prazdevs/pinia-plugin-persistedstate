import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'
import { version } from '../../../package.json'

export const en: LocaleSpecificConfig<DefaultTheme.Config> = {
  description: 'Configurable persistence of Pinia stores.',
  themeConfig: {
    editLink: {
      text: 'Suggest changes to this page',
      pattern: 'https://github.com/prazdevs/pinia-plugin-persistedstate/edit/main/docs/:path',
    },
    nav: [
      { text: 'Guide', link: '/guide' },
      {
        text: 'Frameworks',
        items: [
          { text: 'Nuxt', link: '/frameworks/nuxt' },
          { text: 'Others', link: '/frameworks/others' },
        ],
      },
      {
        text: `v${version}`,
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
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ],
      },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2021-present Sacha Bouillez',
    },

  },
}
