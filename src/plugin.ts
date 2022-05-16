import type {
  PiniaPluginContext,
  StateTree,
  SubscriptionCallbackMutation,
} from 'pinia'

import { normalizeOptions } from './normalize'
import { pick } from './pick'
import {
  CookieOptions,
  CookieRef,
  PersistedStateFactoryOptions,
  PersistedStateNuxtFactoryOptions,
} from './types'

export function createPersistedState(
  factoryOptions: PersistedStateFactoryOptions = {},
) {
  return function (context: PiniaPluginContext): void {
    const {
      options: { persist },
      store,
    } = context

    if (!persist) return

    const {
      storage = localStorage,
      beforeRestore = null,
      afterRestore = null,
      serializer = {
        serialize: JSON.stringify,
        deserialize: JSON.parse,
      },
      key = store.$id,
      paths = null,
    } = normalizeOptions(persist, factoryOptions)

    beforeRestore?.(context)

    try {
      const fromStorage = storage.getItem(key)
      if (fromStorage) store.$patch(serializer.deserialize(fromStorage))
    } catch (_error) {}

    afterRestore?.(context)

    store.$subscribe(
      (
        _mutation: SubscriptionCallbackMutation<StateTree>,
        state: StateTree,
      ) => {
        try {
          const toStore = Array.isArray(paths) ? pick(state, paths) : state

          storage.setItem(key, serializer.serialize(toStore as StateTree))
        } catch (_error) {}
      },
      { detached: true },
    )
  }
}

export function createNuxtPersistedState(
  useCookie: <T>(key: string, opts: CookieOptions<T>) => CookieRef<T>,
  factoryOptions?: PersistedStateNuxtFactoryOptions,
): (context: PiniaPluginContext) => void {
  return createPersistedState({
    storage: {
      getItem: key => {
        return useCookie<string>(key, {
          encode: encodeURIComponent,
          decode: decodeURIComponent,
        }).value
      },
      setItem: (key, value) => {
        useCookie<string>(key, {
          encode: encodeURIComponent,
          decode: decodeURIComponent,
        }).value = value
      },
    },
    ...factoryOptions,
  })
}

export const persistedState = createPersistedState()
