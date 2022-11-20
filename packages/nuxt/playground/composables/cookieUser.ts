import { defineStore } from 'pinia'

export const useCookieUser = defineStore('cookiesuser', {
  state: () => ({
    username: 'PraZ',
  }),
  persist: {
    storage: persistedState.cookies,
  },
})
