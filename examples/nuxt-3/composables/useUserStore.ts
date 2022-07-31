import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    username: 'PraZ',
  }),
  persist: true,
})
