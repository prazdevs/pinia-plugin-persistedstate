import type { CookieOptions } from '#app'
import type { StorageLike } from '../types'
import { useCookie, useRuntimeConfig } from '#app'

export type CookiesStorageOptions = Omit<
  CookieOptions,
  'default' | 'watch' | 'readonly' | 'filter'
>

/**
 * Cookie-based storage. Cookie options can be passed as parameter.
 * Uses Nuxt's `useCookie` under the hood.
 */
function cookies(options?: CookiesStorageOptions): StorageLike {
  return {
    getItem: key => useCookie<string | null>(
      key,
      {
        ...(options ?? useRuntimeConfig().public.piniaPluginPersistedstate.cookieOptions ?? {}),
        decode: options?.decode ?? decodeURIComponent,
        readonly: true,
      },
    ).value,
    setItem: (key, value) => useCookie<string>(
      key,
      {
        ...(options ?? useRuntimeConfig().public.piniaPluginPersistedstate.cookieOptions ?? {}),
        encode: options?.encode ?? encodeURIComponent,
      },
    ).value = value,
  }
}

/**
 * LocalStorage-based storage.
 * Warning: only works client-side.
 */
function localStorage(): StorageLike {
  return {
    getItem: key => import.meta.client
      ? window.localStorage.getItem(key)
      : null,
    setItem: (key, value) => import.meta.client
      ? window.localStorage.setItem(key, value)
      : null,
  }
}

/**
 * SessionStorage-based storage.
 * Warning: only works client-side.
 */
function sessionStorage(): StorageLike {
  return {
    getItem: key => import.meta.client
      ? window.sessionStorage.getItem(key)
      : null,
    setItem: (key, value) => import.meta.client
      ? window.sessionStorage.setItem(key, value)
      : null,
  }
}

export const storages = {
  cookies,
  localStorage,
  sessionStorage,
}
