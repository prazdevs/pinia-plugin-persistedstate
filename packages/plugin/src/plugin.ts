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

interface Persistence {
  storage: StorageLike
  serializer: Serializer
  key: string
  paths: string[] | null
  debug: boolean
}

function hydrateStore(
  store: Store,
  { storage, serializer, key, debug }: Persistence,
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

function persistState(
  state: StateTree,
  { storage, serializer, key, paths, debug }: Persistence,
) {
  try {
    const toStore = Array.isArray(paths) ? pick(state, paths) : state
    storage!.setItem(key!, serializer!.serialize(toStore as StateTree))
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
    const { auto = false } = factoryOptions
    const {
      options: { persist = auto },
      store,
      pinia,
    } = context

    if (!persist)
      return
    // if store is created when hmr, it will not be put in `pinia.state`.
    // see https://github.com/vuejs/pinia/blob/v2/packages/pinia/src/store.ts#L265-L272.
    /** is original store or hot store */
    const is_original = store.$id in pinia.state.value
    // if store is created as hot store, we're support to do nothing.
    /* c8 ignore next 3 */
    if (!is_original) {
      const original_id = store.$id.replace('__hot:', '')
      // @ts-expect-error `_s is a stripped @internal`
      const original_store = pinia._s.get(original_id)
      /* c8 ignore next 3 */
      if (original_store)
        // `$persist` original_store after anything finished
        Promise.resolve().then(() => original_store.$persist())
      return
    }

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
        key: (factoryOptions.key ?? (k => k))(typeof key == 'string' ? key : key(store.$id)),
        paths,
        debug,
      }),
    )

    store.$persist = () => {
      persistences.forEach((persistence) => {
        persistState(store.$state, persistence)
      })
    }

    store.$hydrate = ({ runHooks = true } = {}) => {
      persistences.forEach((persistence) => {
        const { beforeRestore, afterRestore } = persistence

        if (runHooks)
          beforeRestore?.(context)

        hydrateStore(store, persistence)

        if (runHooks)
          afterRestore?.(context)
      })
    }

    persistences.forEach((persistence) => {
      const { beforeRestore, afterRestore } = persistence

      beforeRestore?.(context)

      hydrateStore(store, persistence)

      afterRestore?.(context)

      store.$subscribe(
        (
          _mutation: SubscriptionCallbackMutation<StateTree>,
          state: StateTree,
        ) => {
          persistState(state, persistence)
        },
        {
          detached: true,
        },
      )
    })
  }
}
