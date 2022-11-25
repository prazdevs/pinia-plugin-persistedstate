import { fileURLToPath } from 'url'
import { defineNuxtConfig } from 'nuxt/config'
import piniaPersistedState from '../src/module'

export default defineNuxtConfig({
  alias: {
    'pinia-plugin-persistedstate': fileURLToPath(new URL('../../plugin/src/index.ts', import.meta.url)),
  },
  modules: [
    '@pinia/nuxt',
    piniaPersistedState,
  ],
  piniaPersistedstate: {
    cookieOptions: {
      sameSite: true,
    },
  },
})
