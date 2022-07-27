import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'pinia-plugin-persistedstate',
  description: '🍍 Configurable persistence and rehydration of Pinia stores.',
  themeConfig: {
    logo: '/logo.png',
    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © 2021-${new Date().getFullYear()} Sacha Bouillez & contributors`
    }
  },
})
