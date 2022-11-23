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
    const {
      options: { persist },
      store,
    } = context

    if (!persist) return

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

      /**
       * Nuxt 2 specific change, we don't need to hydrate the client because
       * the @pinia/nuxt module already hydrates all the state on the client side.
       *
       * Without this change, pinia state will not be valid after client-side hydration
       * because of a conflict with the @pinia/nuxt module.
       */
      if (!process.client) {
        hydrateStore(store, storage, serializer, key, debug)
      }

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
