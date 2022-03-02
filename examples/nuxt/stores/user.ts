import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    username: 'PraZ',
  }),
  persist: {
    storage: {
      getItem: key => {
        return useCookie(key, { encode: x => x, decode: x => x }).value
      },
      setItem: (key, value) => {
        useCookie(key, { encode: x => x, decode: x => x }).value = value
      },
    },
  },
})
