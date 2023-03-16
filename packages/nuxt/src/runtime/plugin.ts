import { type Pinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

import { type ModuleOptions } from '../module'

import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { persistedState } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const { cookieOptions, debug, storage } = useRuntimeConfig().public.persistedState
  const pinia = nuxtApp.$pinia as Pinia

  pinia.use(createPersistedState({
    storage: storage === 'cookies'
      ? persistedState.cookiesWithOptions(cookieOptions)
      : persistedState[storage as ModuleOptions['storage']],
    debug,
  }))
})
