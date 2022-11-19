import { type Pinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { defineNuxtPlugin } from '#app'
import { storages } from '#pinia-plugin-persistedstate'

export default defineNuxtPlugin((nuxtApp) => {
  (nuxtApp.$pinia as Pinia).use(createPersistedState({
    storage: storages.cookies(),
  }))
})
