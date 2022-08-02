import { useCookie, CookieOptions } from 'nuxt/app'

import { createPersistedState } from '~/core/plugin'
import { PersistedStateFactoryOptions } from '~/core/types'

type UseCookie = typeof useCookie

export type PersistedStateNuxtFactoryOptions = Omit<
  PersistedStateFactoryOptions,
  'storage'
> & { cookieOptions?: CookieOptions<string> }

/**
 * Creates a Nuxt-specific SSR-ready pinia persistence plugin based on cookies
 * @param useCookie pass the auto-imported useCookie from '#app'
 * @param factoryOptions global persistence options
 * @returns pinia plugin
 */
export function createNuxtPersistedState(
  useCookie: UseCookie,
  factoryOptions?: PersistedStateNuxtFactoryOptions,
) {
  return createPersistedState({
    storage: {
      getItem: key => {
        return useCookie(key, {
          encode: encodeURIComponent,
          decode: decodeURIComponent,
          ...factoryOptions?.cookieOptions,
        }).value
      },
      setItem: (key, value) => {
        useCookie(key, {
          encode: encodeURIComponent,
          decode: decodeURIComponent,
          ...factoryOptions?.cookieOptions,
        }).value = value
      },
    },
    ...factoryOptions,
  })
}
