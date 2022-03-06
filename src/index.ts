import type {
  PersistGlobalOptions,
  PersistStoreOptions,
  PersistResolvedOptions,
} from './types'
import type { PiniaPlugin, PiniaPluginContext, StateTree } from 'pinia'

import pick from './pick'

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S extends StateTree, Store> {
    /**
     * Persist store in storage.
     * @docs https://github.com/prazdevs/pinia-plugin-persistedstate.
     */
    persist?: boolean | PersistStoreOptions
  }
}

/**
 * Pinia plugin to persist stores in a storage based on vuex-persistedstate.
 */
export function PiniaPersistState(
  gOptions: PersistGlobalOptions = {},
): PiniaPlugin {
  const opts: Required<PersistGlobalOptions> = {
    ...gOptions,
    prefix: 'pinia-',
    overwrite: false,
    serializer: {
      serialize: JSON.stringify,
      deserialize: JSON.parse,
    },
    storage: localStorage,
    beforeRestore: null,
    afterRestore: null,
  }

  return function PiniaPersistedState(context: PiniaPluginContext): void {
    const {
      options: { persist },
      store,
    } = context

    if (!persist) return

    const {
      storage = opts.storage,
      name = store.$id,
      paths = null,
      overwrite = !!opts.overwrite,
      beforeRestore = opts.beforeRestore,
      afterRestore = opts.afterRestore,
      serializer = opts.serializer,
    } = typeof persist != 'boolean' ? persist : {}

    const key = opts.prefix + name

    const resolved: PersistResolvedOptions = {
      key,
      paths,
      overwrite,
      beforeRestore,
      afterRestore,
      serializer,
      name,
      prefix: opts.prefix,
      storage,
    }

    beforeRestore?.(context, resolved)

    try {
      const fromStorage = storage.getItem(key)
      if (fromStorage) {
        const storageState = serializer.deserialize(fromStorage)
        if (overwrite) store.$state = storageState
        else store.$patch(storageState)
      }
    } catch (_error) {}

    afterRestore?.(context, resolved)

    store.$subscribe(
      (_mutation, state) => {
        try {
          const toStore = Array.isArray(paths) ? pick(state, paths) : state

          storage.setItem(key, serializer.serialize(toStore as StateTree))
        } catch (_error) {}
      },
      { detached: true },
    )
  }
}

export default PiniaPersistState()
