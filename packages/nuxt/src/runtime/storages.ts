import type { StorageLike } from 'pinia-plugin-persistedstate'
import { type CookieOptions, useCookie, useNuxtApp } from '#app'

/**
 * Use Nuxt's cookies to persist pinia store
 * @param cookieOptions options to apply to cookies
 */
const piniaCookies = (cookieOptions?: CookieOptions<string>) => ({
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

/**
 * Use `localStorage` to persist pinia store
 * Note: this storage is client-only
 */
const piniaLocalStorage = () => ({
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

/**
 * Use `sessionStorage` to persist pinia store
 * Note: this storage is client-only
 */
const piniaSessionStorage = () => ({
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

export const storages: Record<string, () => StorageLike> = {
  cookies: piniaCookies,
  localStorage: piniaLocalStorage,
  sessionStorage: piniaSessionStorage,
}
