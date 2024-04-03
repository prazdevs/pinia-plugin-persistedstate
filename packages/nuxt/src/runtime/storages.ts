import type { StorageLike } from 'pinia-plugin-persistedstate'
import { type CookieOptions, useCookie, useNuxtApp } from '#app'

function usePersistedstateCookies(
  cookieOptions?: Omit<CookieOptions<string>, 'encode' | 'decode'>,
): StorageLike {
  return ({
    getItem: key =>
      cookieOptions?.readonly
        ? useCookie<string>(key, {
          ...cookieOptions,
          encode: encodeURIComponent,
          decode: decodeURIComponent,
          readonly: true,
        }).value
        : useCookie<string>(key, {
          ...cookieOptions,
          encode: encodeURIComponent,
          decode: decodeURIComponent,
          readonly: false,
        }).value,
    setItem: (key, value) => {
      if (cookieOptions?.readonly)
        throw new Error('Cannot set a readonly cookie.')

      useCookie<string>(key, {
        ...cookieOptions,
        encode: encodeURIComponent,
        decode: decodeURIComponent,
        readonly: false,
      }).value = value
    },
  })
}

function usePersistedstateLocalStorage(): StorageLike {
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
  })
}

function usePersistedstateSessionStorage(): StorageLike {
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
  })
}

export const persistedState = {
  localStorage: usePersistedstateLocalStorage(),
  sessionStorage: usePersistedstateSessionStorage(),
  cookies: usePersistedstateCookies(),
  cookiesWithOptions: usePersistedstateCookies,
}
