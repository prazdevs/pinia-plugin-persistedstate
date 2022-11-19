import { defineStore } from 'pinia'
import { storages } from '#pinia-plugin-persistedstate'

export const useLocalUser = defineStore('localuser', {
  state: () => ({
    username: 'PraZ',
  }),
  persist: {
    storage: storages.localStorage(),
  },
})
