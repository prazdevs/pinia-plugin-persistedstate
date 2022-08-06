import { CookieOptions } from 'nuxt/app'

import { createPersistedState } from '~/core/plugin'
import { PersistedStateFactoryOptions } from '~/core/types'

export type PersistedStateNuxtFactoryOptions = Omit<
  PersistedStateFactoryOptions,
  'storage'
> & { cookieOptions?: CookieOptions<string> } & { splitCookies: number }

/**
 * Creates a Nuxt-specific SSR-ready pinia persistence plugin based on cookies
 * @param useCookie pass the auto-imported useCookie from '#app'
 * @param factoryOptions global persistence options
 * @returns pinia plugin
 */

interface UseCookie {
  get: (key: string) => string | undefined
  set: (key: string, value: string, options?: CookieOptions<string>) => void
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function createNuxtPersistedState(
  useCookie: UseCookie,
  factoryOptions?: PersistedStateNuxtFactoryOptions,
) {
  const handleCookie = (
    data: UseCookie['get'] | UseCookie['set'],
    key: string,
    value = '',
    cookie = '',
  ) => {
    const numberOfCookies = factoryOptions?.splitCookies
      ? factoryOptions?.splitCookies
      : 1
    for (let i = 0; i < numberOfCookies; i++)
      if (value) {
        const length = Math.ceil(value.length / numberOfCookies)
        const start = i * length
        const end = start + length
        data(key + (i || ''), value.toString().substring(start, end), {
          ...factoryOptions?.cookieOptions,
        })
        // @ts-ignore
      } else cookie += data(key + (i || ''))

    return cookie
  }
  return createPersistedState({
    storage: {
      getItem: key => {
        return handleCookie(useCookie.get, key)
      },
      setItem: (key, value) => {
        handleCookie(useCookie.set, key, value)
      },
    },
    ...factoryOptions,
  })
}
