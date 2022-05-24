import type {
  LocalStore,
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
      expiresIn = null,
    } = normalizeOptions(persist, factoryOptions)

    beforeRestore?.(context)

    try {
      const fromStorage = storage.getItem(key)

      if (fromStorage) {
        const localStore = serializer.deserialize(fromStorage)

        const { expiresAt = null, state = null } = localStore
        if ((expiresAt !== null && typeof expiresAt !== 'number') || !state)
          throw Error('Invalid local store')

        if (expiresAt === null || expiresAt >= Date.now()) store.$patch(state)
      }
    } catch (_error) {}

    afterRestore?.(context)

    store.$subscribe(
      (
        _mutation: SubscriptionCallbackMutation<StateTree>,
        state: StateTree,
      ) => {
        try {
          const toStore: LocalStore = {
            state: Array.isArray(paths) ? pick(state, paths) : state,
            expiresAt: expiresIn ? Date.now() + expiresIn * 1000 : null,
          }

          storage.setItem(key, serializer.serialize(toStore))
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
