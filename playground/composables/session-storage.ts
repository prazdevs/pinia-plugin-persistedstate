export const useSessionStorageStore = defineStore('session-storage', () => {
  const username = ref('prazdevs')

  return { username }
}, {
  persist: {
    storage: piniaPluginPersistedstate.sessionStorage,
  },
})
