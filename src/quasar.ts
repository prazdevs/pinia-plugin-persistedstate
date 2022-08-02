import type { Cookies } from 'quasar'

import { createPersistedState } from '~/core/plugin'
import { PersistedStateFactoryOptions } from '~/core/types'

type CookieOptions = Parameters<Cookies['set']>[2]

export type PersistedStateQuasarCookiesOptions = Omit<
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
        c.set(key, JSON.parse(value), factoryOptions?.cookiesOptions)
      },
    },
    ...factoryOptions,
  })
}
