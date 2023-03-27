import { defineStore } from 'pinia'

export const useLocalUser = defineStore('localuser', {
  state: () => ({
    username: 'PraZ',
  }),
  persist: true,
})
