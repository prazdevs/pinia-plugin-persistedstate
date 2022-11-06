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
  PersistanceStorageUpdater,
} from '~/core/types'
import { consoleError, safeAttachWindowEvent } from '~/utils'

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
    if (debug) consoleError(error)
  }
}

const storageUpdatersCache: Record<
  PiniaPluginContext['store']['$id'],
  Array<PersistanceStorageUpdater>
> = {}

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

    storageUpdatersCache[store.$id] = storageUpdatersCache[store.$id] || []

    if (typeof factoryOptions.key === 'function') {
      globalOrDefaultKey = factoryOptions.key(store)
    }

    const areThereMultiplePersistences = Array.isArray(persist)
    const persistences = (
      areThereMultiplePersistences
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
        updationTriggers = ['subscribe'],
      }) => ({
        storage,
        beforeRestore,
        afterRestore,
        serializer,
        key,
        paths,
        debug,
        updationTriggers,
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
        updationTriggers,
      } = persistence
      beforeRestore?.(context)

      hydrateStore(store, storage, serializer, key, debug)

      afterRestore?.(context)

      const updater: PersistanceStorageUpdater = (state: StateTree) => {
        try {
          const toStore = Array.isArray(paths) ? pick(state, paths) : state

          storage.setItem(key, serializer.serialize(toStore as StateTree))
        } catch (error) {
          if (debug) consoleError(error)
        }
      }

      storageUpdatersCache[store.$id].push(updater)

      if (updationTriggers.includes('subscribe')) {
        store.$subscribe(
          (
            _mutation: SubscriptionCallbackMutation<StateTree>,
            state: StateTree = store.$state,
          ) => updater(state),
          {
            detached: true,
          },
        )
      }

      if (updationTriggers.includes('beforeunload')) {
        safeAttachWindowEvent('beforeunload', () => updater(store.$state), {
          debug,
        })
      }
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

    store.$persist = {
      updateInStorage: persistanceIndex => {
        if (!areThereMultiplePersistences) {
          storageUpdatersCache[store.$id][0](store.$state)
          return
        }

        const isIndexValid =
          typeof persistanceIndex === 'number' &&
          persistanceIndex >= 0 &&
          persistanceIndex < persistences.length

        if (!isIndexValid) {
          if (factoryOptions.debug)
            consoleError(
              `updateInStorage: 'persistanceIndex' ${persistanceIndex} is not valid as a persistence object against it does not exist`,
            )

          return
        }

        storageUpdatersCache[store.$id][persistanceIndex](store.$state)
      },
    }
  }
}
