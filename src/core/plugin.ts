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
  PersistenceHydrator,
  PersitenceOperationsCache,
  DefineStorePersistOption,
} from '~/core/types'
import { consoleError, consoleWarn, safeAttachWindowEvent } from '~/utils'

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

function persistenceOperationValidator(
  persistanceIndex: number,
  persist: DefineStorePersistOption,
  factoryOptions: PersistedStateFactoryOptions,
) {
  if (!Array.isArray(persist)) {
    return true
  }

  const totalPersistences = persist.length
  const isIndexValid =
    typeof persistanceIndex === 'number' &&
    persistanceIndex >= 0 &&
    persistanceIndex < totalPersistences

  if (!isIndexValid) {
    if (factoryOptions.debug)
      consoleError(
        `'persistanceIndex' ${persistanceIndex} is not valid as a persistence object against it does not exist`,
      )

    return false
  }

  return true
}

/**
 * Creates a pinia persistence plugin
 * @param factoryOptions global persistence options
 * @returns pinia plugin
 */
export function createPersistedState(
  factoryOptions: PersistedStateFactoryOptions = {},
): PiniaPlugin {
  const storageUpdatersCache: PersitenceOperationsCache<PersistanceStorageUpdater> =
    {}
  const storeHydratorsCache: PersitenceOperationsCache<PersistenceHydrator> = {}

  return (context: PiniaPluginContext) => {
    const {
      options: { persist },
      store,
    } = context

    if (!persist) return

    storageUpdatersCache[store.$id] = storageUpdatersCache[store.$id] || []
    storeHydratorsCache[store.$id] = storeHydratorsCache[store.$id] || []

    const areThereMultiplePersistences = Array.isArray(persist)
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
        updationTriggers = ['subscribe'],
        hydrationTriggers = ['created'],
      }) => ({
        storage,
        beforeRestore,
        afterRestore,
        serializer,
        key,
        paths,
        debug,
        updationTriggers,
        hydrationTriggers,
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
        hydrationTriggers,
      } = persistence

      const hydrator: (opts?: { runHooks?: boolean }) => void = ({
        runHooks,
      } = {}) => {
        if (runHooks) beforeRestore?.(context)

        hydrateStore(store, storage, serializer, key, debug)

        if (runHooks) afterRestore?.(context)
      }

      const updater: PersistanceStorageUpdater = (state: StateTree) => {
        try {
          const toStore = Array.isArray(paths) ? pick(state, paths) : state

          storage.setItem(key, serializer.serialize(toStore as StateTree))
        } catch (error) {
          if (debug) consoleError(error)
        }
      }

      storageUpdatersCache[store.$id].push(updater)
      storeHydratorsCache[store.$id].push(hydrator)

      if (hydrationTriggers.includes('created')) hydrator({ runHooks: true })

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

    store.$persist = {
      updateStorage: (persistanceIndex = -1) => {
        const isValid = persistenceOperationValidator(
          persistanceIndex,
          persist,
          factoryOptions,
        )

        if (!isValid) {
          return
        }

        if (!areThereMultiplePersistences || persistanceIndex < 0) {
          storeHydratorsCache[store.$id].forEach(h => h(store.$state))
          return
        }

        storageUpdatersCache[store.$id][persistanceIndex](store.$state)
      },

      hydrate: (persistanceIndex = -1, { runHooks = true } = {}) => {
        const isValid = persistenceOperationValidator(
          persistanceIndex,
          persist,
          factoryOptions,
        )

        if (!isValid) {
          return
        }

        if (!areThereMultiplePersistences || persistanceIndex < 0) {
          storeHydratorsCache[store.$id].forEach(h => h({ runHooks }))
          return
        }

        storeHydratorsCache[store.$id][persistanceIndex]({ runHooks })
      },
    }

    store.$hydrate = ({ runHooks = true } = {}) => {
      if (factoryOptions.debug)
        consoleWarn('"$hydrate" is deprecated. Use "$persist.hydrate" instead')

      persistences.forEach((_persistence, index) =>
        store.$persist.hydrate(index, { runHooks }),
      )
    }
  }
}
