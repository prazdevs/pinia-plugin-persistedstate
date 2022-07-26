import type { CookieParseOptions, CookieSerializeOptions } from 'cookie-es'
import type { Ref } from 'vue'

import { createPersistedState } from '~/core/plugin'
import { PersistedStateFactoryOptions } from '~/core/types'

interface CookieOptions<T = any>
  extends Omit<
    CookieSerializeOptions & CookieParseOptions,
    'decode' | 'encode'
  > {
  decode?(value: string): T
  encode?(value: T): string
  default?: () => T | Ref<T>
}

type CookieRef<T> = Ref<T>

type UseCookie<T = string> = (
  name: string,
  _opts?: CookieOptions<T>,
) => CookieRef<T>

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
