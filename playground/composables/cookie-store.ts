export const useCookieStore = defineStore('cookie', () => {
  const username = ref('prazdevs')

  return { username }
}, {
  persist: {
    storage: piniaPluginPersistedstate.cookies,
  },
})
