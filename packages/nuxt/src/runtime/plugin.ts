import { type Pinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

import { type ModuleOptions } from '../module'

import { defineNuxtPlugin } from '#app'
import { persistedState } from '#imports'
// @ts-expect-error runtime template
import options from '#persistedstate'

export default defineNuxtPlugin((nuxtApp) => {
  const { cookieOptions, debug, storage } = options as ModuleOptions

  (nuxtApp.$pinia as Pinia).use(createPersistedState({
    storage: storage === 'cookies'
      ? persistedState.cookiesWithOptions(cookieOptions)
      : persistedState[storage],
    debug,
  }))
})
