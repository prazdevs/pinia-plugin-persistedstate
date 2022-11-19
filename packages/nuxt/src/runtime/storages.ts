import type { StorageLike } from 'pinia-plugin-persistedstate'
import { type CookieOptions, useCookie, useNuxtApp } from '#app'

export const piniaCookies = (cookieOptions: CookieOptions) => ({
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

export const piniaLocalStorage = () => ({
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
