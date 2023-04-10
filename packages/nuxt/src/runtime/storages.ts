import type { StorageLike } from 'pinia-plugin-persistedstate'
import { type CookieOptions, useCookie, useNuxtApp } from '#app'

function usePersistedstateCookies(cookieOptions?: Omit<CookieOptions<string>, 'encode' | 'decode'>) {
  return ({
    getItem: (key) => {
      return useCookie<string>(key, {
        ...cookieOptions,
        encode: encodeURIComponent,
        decode: decodeURIComponent,
      }).value
    },
    setItem: (key, value) => {
      useCookie<string>(key, {
        ...cookieOptions,
        encode: encodeURIComponent,
        decode: decodeURIComponent,
      }).value = value
    },
  }) as StorageLike
}

function usePersistedstateLocalStorage() {
  return ({
    getItem: (key) => {
      return !useNuxtApp().ssrContext
        ? localStorage.getItem(key)
        : null
    },
    setItem: (key, value) => {
      if (!useNuxtApp().ssrContext)
        localStorage.setItem(key, value)
    },
  }) as StorageLike
}

function usePersistedstateSessionStorage() {
  return ({
    getItem: (key) => {
      return !useNuxtApp().ssrContext
        ? sessionStorage.getItem(key)
        : null
    },
    setItem: (key, value) => {
      if (!useNuxtApp().ssrContext)
        sessionStorage.setItem(key, value)
    },
  }) as StorageLike
}

export const persistedState = {
  localStorage: usePersistedstateLocalStorage(),
  sessionStorage: usePersistedstateSessionStorage(),
  cookies: usePersistedstateCookies(),
  cookiesWithOptions: usePersistedstateCookies,
}
