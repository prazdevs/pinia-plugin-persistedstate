import { Cookies, LocalStorage, SessionStorage } from 'quasar'

import { createPersistedState } from '~/core/plugin'
import { PersistedStateFactoryOptions } from '~/core/types'

type CookieOptions = Parameters<Cookies['set']>[2]

export type PersistedStateQuasarFactoryOptions = Omit<
  PersistedStateFactoryOptions,
  'storage'
> & { cookiesOptions: CookieOptions }

/**
 * Creates a Quasar-specific SSR-ready pinia persistence plugin based on cookies
 * @param cookies pass the imported Cookies from 'quasar'
 * @param ssrContext SSR context destructured from boot/store wrapper callback
 * @param factoryOptions global persistence options
 * @returns pinia plugin
 */
export function createQuasarCookiesPersistedState(
  cookies: Cookies,
  factoryOptions?: PersistedStateQuasarFactoryOptions,
) {
  return createPersistedState({
    storage: {
      getItem: key => {
        return JSON.stringify(cookies.get(key))
      },
      setItem: (key, value) => {
        cookies.set(key, JSON.parse(value), factoryOptions?.cookiesOptions)
      },
    },
    ...factoryOptions,
  })
}

/**
 * Creates a Quasar-specific pinia persistence plugin based on Quasar WebStorage plugins
 * @param webStorage pass the imported SessionStorage/LocalStorage from 'quasar'
 * @param factoryOptions global persistence options
 * @returns pinia plugin
 */
export function createQuasarWebStoragePersistedState(
  webStorage: SessionStorage | LocalStorage,
  factoryOptions?: PersistedStateQuasarFactoryOptions,
) {
  return createPersistedState({
    storage: {
      getItem: webStorage.getItem,
      setItem: webStorage.set,
    },
    ...factoryOptions,
  })
}
