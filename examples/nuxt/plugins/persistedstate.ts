import { createNuxtPersistedState } from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin(() => {
  usePinia().use(createNuxtPersistedState(useCookie))
})
