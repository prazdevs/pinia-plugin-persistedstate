import type { CookieParseOptions, CookieSerializeOptions } from 'cookie-es'
import type { Ref } from 'vue'
import type {
  PersistedStateFactoryOptions,
  PersistedStateOptions,
} from '~/core/types'

import { createPersistedState } from '~/core/plugin'

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

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S extends StateTree, Store> {
    /**
     * Persist store in storage.
     * @see https://github.com/prazdevs/pinia-plugin-persistedstate
     */
    persist?: boolean | PersistedStateOptions | PersistedStateOptions[]
  }

  export interface PiniaCustomProperties {
    /**
     * Rehydrates store from persisted state
     * Warning: this is for advances usecases, make sure you know what you're doing.
     * @see https://github.com/prazdevs/pinia-plugin-persistedstate
     */
    $hydrate: (opts?: { runHooks?: boolean }) => void
  }
}

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
