import { type Pinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { defineNuxtPlugin } from '#app'
import { piniaCookies } from '#pinia-plugin-persistedstate/storages'

export default defineNuxtPlugin((nuxtApp) => {
  (nuxtApp.$pinia as Pinia).use(createPersistedState({
    storage: piniaCookies(),
  }))
})
