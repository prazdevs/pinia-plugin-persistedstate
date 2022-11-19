import { defineStore } from 'pinia'
import { piniaLocalStorage } from '#pinia-plugin-persistedstate/storages'

export const useLocalUser = defineStore('localuser', {
  state: () => ({
    username: 'PraZ',
  }),
  persist: {
    storage: piniaLocalStorage(),
  },
})
