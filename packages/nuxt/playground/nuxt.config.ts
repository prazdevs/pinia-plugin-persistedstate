import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    '@nuxt/devtools',
    '@pinia/nuxt',
    '../src/module',
  ],
  piniaPersistedstate: {
    storage: 'localStorage',
    cookieOptions: {
      sameSite: true,
    },
  },
})
