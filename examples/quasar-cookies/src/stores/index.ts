import { store } from 'quasar/wrappers'
import { Cookies } from 'quasar'
import { createPinia } from 'pinia'
import { createQuasarCookiesPersistedState } from 'pinia-plugin-persistedstate/quasar'

export default store(({ ssrContext }) => {
  const pinia = createPinia()
  
  const cookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies
  pinia.use(createQuasarCookiesPersistedState(cookies))

  return pinia
})
