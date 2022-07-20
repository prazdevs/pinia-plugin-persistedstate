import type {
  PersistedStateFactoryOptions,
  PersistedStateNuxtFactoryOptions,
  UseCookie,
} from './types'
import type {
  PiniaPluginContext,
  StateTree,
  SubscriptionCallbackMutation,
} from 'pinia'

import { normalizeOptions } from './normalize'
import { pick } from './pick'

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
      const fromStorage: unknown = storage.getItem(key)
      if (fromStorage instanceof Promise) {
        Promise.resolve(fromStorage).then(value => {
          if (value) store.$patch(serializer.deserialize(value as string))
          afterRestore?.(context)
        })
      } else if (fromStorage) {
        store.$patch(serializer.deserialize(fromStorage as string))
        afterRestore?.(context)
      }
    } catch (_error) {
      afterRestore?.(context)
    }

    store.$subscribe(
      async (
        _mutation: SubscriptionCallbackMutation<StateTree>,
        state: StateTree,
      ) => {
        try {
          const toStore = Array.isArray(paths) ? pick(state, paths) : state
          await storage.setItem(key, serializer.serialize(toStore as StateTree))
        } catch (_error) {}
      },
      { detached: true },
    )
  }
}

export function createNuxtPersistedState(
  useCookie: UseCookie,
  factoryOptions?: PersistedStateNuxtFactoryOptions,
): (context: PiniaPluginContext) => void {
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

export const persistedState = createPersistedState()
