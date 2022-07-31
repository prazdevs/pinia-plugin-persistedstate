import type { Cookies } from 'quasar'

import { createPersistedState } from '~/core/plugin'
import {
  PersistedStateOptions,
  PersistedStateFactoryOptions,
} from '~/core/types'

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

export type PersistedStateQuasarCookiesOptions = Omit<
  PersistedStateFactoryOptions,
  'storage'
>

/**
 * Creates a Quasar-specific SSR-ready pinia persistence plugin based on cookies
 * @param cookies pass the imported Cookies from 'quasar'
 * @param factoryOptions global persistence options
 * @returns pinia plugin
 */
export function createQuasarCookiesPersistedState(
  cookies: Cookies,
  ssrContext: unknown,
  factoryOptions?: PersistedStateQuasarCookiesOptions,
) {
  return createPersistedState({
    storage: {
      getItem: key => {
        const c = process.env.SERVER ? cookies.parseSSR(ssrContext) : cookies
        return JSON.stringify(c.get(key))
      },
      setItem: (key, value) => {
        const c = process.env.SERVER ? cookies.parseSSR(ssrContext) : cookies
        c.set(key, JSON.parse(value))
      },
    },
    ...factoryOptions,
  })
}
