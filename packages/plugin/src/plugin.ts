import type {
  PiniaPlugin,
  PiniaPluginContext,
  StateTree,
  Store,
  SubscriptionCallbackMutation,
} from 'pinia'

import { normalizeOptions } from './normalize'
import { pick } from './pick'
import {
  type PersistedStateFactoryOptions,
  type Serializer,
  type StorageLike,
} from './types'

function hydrateStore(
  store: Store,
  storage: StorageLike,
  serializer: Serializer,
  key: string,
  debug: boolean,
) {
  try {
    const fromStorage = storage?.getItem(key)
    if (fromStorage)
      store.$patch(serializer?.deserialize(fromStorage))
  }
  catch (error) {
    if (debug)
      console.error(error)
  }
}

/**
 * Creates a pinia persistence plugin
 * @param factoryOptions global persistence options
 * @returns pinia plugin
 */
export function createPersistedState(
  factoryOptions: PersistedStateFactoryOptions = {},
): PiniaPlugin {
  return (context: PiniaPluginContext) => {
    const {
      options: { persist },
      store,
    } = context

    if (!persist)
      return

    const persistences = (
      Array.isArray(persist)
        ? persist.map(p => normalizeOptions(p, factoryOptions))
        : [normalizeOptions(persist, factoryOptions)]
    ).map(
      ({
        storage = localStorage,
        beforeRestore = null,
        afterRestore = null,
        serializer = {
          serialize: JSON.stringify,
          deserialize: JSON.parse,
        },
        key = store.$id,
        paths = null,
        debug = false,
      }) => ({
        storage,
        beforeRestore,
        afterRestore,
        serializer,
        key,
        paths,
        debug,
      }),
    )

    persistences.forEach((persistence) => {
      const {
        storage,
        serializer,
        key,
        paths,
        beforeRestore,
        afterRestore,
        debug,
      } = persistence

      beforeRestore?.(context)

      hydrateStore(store, storage, serializer, key, debug)

      afterRestore?.(context)

      store.$subscribe(
        (
          _mutation: SubscriptionCallbackMutation<StateTree>,
          state: StateTree,
        ) => {
          try {
            const toStore = Array.isArray(paths) ? pick(state, paths) : state

            storage.setItem(key, serializer.serialize(toStore as StateTree))
          }
          catch (error) {
            if (debug)
              console.error(error)
          }
        },
        {
          detached: true,
        },
      )
    })

    store.$hydrate = ({ runHooks = true } = {}) => {
      persistences.forEach((persistence) => {
        const { beforeRestore, afterRestore, storage, serializer, key, debug }
          = persistence

        if (runHooks)
          beforeRestore?.(context)

        hydrateStore(store, storage, serializer, key, debug)

        if (runHooks)
          afterRestore?.(context)
      })
    }
  }
}
