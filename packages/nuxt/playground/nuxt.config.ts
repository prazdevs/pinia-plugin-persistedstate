import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: true,
  modules: [
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
