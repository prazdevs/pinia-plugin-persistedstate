import type { PublicRuntimeConfig } from '@nuxt/schema'
import type { StorageLike } from '../types'
import { useCookie, useRuntimeConfig } from '#app'

type CookiesStorageOptions = PublicRuntimeConfig['piniaPluginPersistedstate']['cookieOptions']

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
        decode: decodeURIComponent,
        readonly: true,
      },
    ).value,
    setItem: (key, value) => useCookie<string>(
      key,
      {
        ...(options ?? useRuntimeConfig().public.piniaPluginPersistedstate.cookieOptions ?? {}),
        encode: encodeURIComponent,
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
