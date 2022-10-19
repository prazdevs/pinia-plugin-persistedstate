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
  keyPrefix: string,
  key: string,
  debug: boolean,
) {
  try {
    const fromStorage = storage?.getItem(
      [keyPrefix, key].filter(Boolean).join(''),
    )
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
        keyPrefix = undefined,
        key = store.$id,
        paths = null,
        debug = false,
      }) => ({
        storage,
        beforeRestore,
        afterRestore,
        serializer,
        keyPrefix,
        key,
        paths,
        debug,
      }),
    )

    persistences.forEach(persistence => {
      const {
        storage,
        serializer,
        keyPrefix,
        key,
        paths,
        beforeRestore,
        afterRestore,
        debug,
      } = persistence

      beforeRestore?.(context)

      hydrateStore(
        store,
        storage,
        serializer,
        [keyPrefix, key].filter(Boolean).join(''),
        debug,
      )

      afterRestore?.(context)

      store.$subscribe(
        (
          _mutation: SubscriptionCallbackMutation<StateTree>,
          state: StateTree,
        ) => {
          try {
            const toStore = Array.isArray(paths) ? pick(state, paths) : state

            storage.setItem(
              [keyPrefix, key].filter(Boolean).join(''),
              serializer.serialize(toStore as StateTree),
            )
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
        const {
          beforeRestore,
          afterRestore,
          storage,
          serializer,
          keyPrefix,
          key,
          debug,
        } = persistence

        if (runHooks) beforeRestore?.(context)

        hydrateStore(
          store,
          storage,
          serializer,
          [keyPrefix, key].filter(Boolean).join(''),
          debug,
        )

        if (runHooks) afterRestore?.(context)
      })
    }
  }
}
