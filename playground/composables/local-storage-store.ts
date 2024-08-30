export const useLocalStorageStore = defineStore('local-storage', () => {
  const username = ref('prazdevs')

  return { username }
}, {
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  },
})
