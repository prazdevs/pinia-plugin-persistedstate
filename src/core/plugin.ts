import {
  PiniaPluginContext,
  SubscriptionCallbackMutation,
  StateTree,
  Store,
  PiniaPlugin,
} from 'pinia'

import normalizeOptions from '~/core/normalize'
import pick from '~/core/pick'
import {
  PersistedStateFactoryOptions,
  Serializer,
  StorageLike,
} from '~/core/types'

function hydrateStore(
  store: Store,
  storage: StorageLike,
  serializer: Serializer,
  key: string,
  debug: boolean,
) {
  try {
    const fromStorage = storage?.getItem(key)
    if (fromStorage) store.$patch(serializer?.deserialize(fromStorage))
  } catch (error) {
    if (debug) console.error(error)
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
    const { options, store } = context
    const { persist } = options
    let globalOrDefaultKey = store.$id

    if (!persist) return

    if (typeof factoryOptions.key === 'function') {
      globalOrDefaultKey = factoryOptions.key(store)
    }

    const persistences = (
      Array.isArray(persist)
        ? persist.map(p =>
            normalizeOptions(p, factoryOptions, globalOrDefaultKey),
          )
        : [normalizeOptions(persist, factoryOptions, globalOrDefaultKey)]
    ).map(
      ({
        storage = localStorage,
        beforeRestore = null,
        afterRestore = null,
        serializer = {
          serialize: JSON.stringify,
          deserialize: JSON.parse,
        },
        key = globalOrDefaultKey,
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

    persistences.forEach(persistence => {
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
          } catch (error) {
            if (debug) console.error(error)
          }
        },
        {
          detached: true,
        },
      )
    })

    store.$hydrate = ({ runHooks = true } = {}) => {
      persistences.forEach(persistence => {
        const { beforeRestore, afterRestore, storage, serializer, key, debug } =
          persistence

        if (runHooks) beforeRestore?.(context)

        hydrateStore(store, storage, serializer, key, debug)

        if (runHooks) afterRestore?.(context)
      })
    }
  }
}
