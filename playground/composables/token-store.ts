export const useTokenStore = defineStore('token', () => {
  const token = ref('')

  return { token }
}, {
  persist: true,
})
