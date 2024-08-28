import { defineConfig } from 'vitepress'
import { version } from '../../package.json'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Pinia Plugin Persistedstate',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],
  themeConfig: {
    logo: '/logo.svg',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/prazdevs/pinia-plugin-persistedstate' },
    ],
  },

  locales: {
    root: {
      label: 'English',
      lang: 'en',
      description: 'Configurable persistence of Pinia stores.',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/guide' },
          { text: 'Nuxt', link: '/nuxt' },
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
                    text: '3.2.1',
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
      },
    },
  },
})
