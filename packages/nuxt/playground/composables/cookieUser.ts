import { defineStore } from 'pinia'
import { storages } from '#pinia-plugin-persistedstate'

export const useCookieUser = defineStore('cookiesuser', {
  state: () => ({
    username: 'PraZ',
  }),
  persist: {
    storage: storages.cookies(),
  },
})
