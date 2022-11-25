import type { StorageLike } from 'pinia-plugin-persistedstate'
import { type CookieOptions, useCookie, useNuxtApp } from '#app'

const usePersistedstateCookies = (
  cookieOptions?: Omit<CookieOptions<string>, 'encode' | 'decode'>,
) => ({
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

const usePersistedstateLocalStorage = () => ({
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

const usePersistedstateSessionStorage = () => ({
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

export const persistedState = {
  localStorage: usePersistedstateLocalStorage(),
  sessionStorage: usePersistedstateSessionStorage(),
  cookies: usePersistedstateCookies(),
  cookiesWithOptions: usePersistedstateCookies,
}
