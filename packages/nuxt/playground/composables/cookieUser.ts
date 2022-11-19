import { defineStore } from 'pinia'
import { piniaCookies } from '#pinia-plugin-persistedstate/storages'

export const useCookieUser = defineStore('cookiesuser', {
  state: () => ({
    username: 'PraZ',
  }),
  persist: {
    storage: piniaCookies(),
  },
})
