import { defineStore } from 'pinia'

export const usePresetCookie = defineStore('preset-cookie', {
  state: () => ({
    access_token: 0,
    refresh_token: 0,
  }),
  actions: {
    setToken(token?: number) {
      this.access_token = token ?? this.access_token + 1
      this.refresh_token = token ?? this.refresh_token + 1
    },
  },
  persist: {
    storage: persistedState.cookies,
  },
})
