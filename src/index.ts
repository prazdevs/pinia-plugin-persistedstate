import type { PiniaPluginContext } from 'pinia'
import { destr } from 'destr'
import { createPersistence } from './core'
import type { PersistenceOptions, Serializer, StorageLike } from './types'

export type { PersistenceOptions, Serializer, StorageLike }
export type PluginOptions = Pick<PersistenceOptions, 'storage'>

/**
 * Create a Pinia persistence plugin.
 * @see https://prazdevs.github.io/pinia-plugin-persistedstate/
 */
export function createPersistedState(options: PluginOptions = {}) {
  return function (context: PiniaPluginContext) {
    createPersistence(context, p => ({
      key: p.key ?? context.store.$id,
      debug: p.debug,
      serializer: p.serializer ?? {
        serialize: data => JSON.stringify(data),
        deserialize: data => destr(data),
      },
      storage: p.storage ?? options.storage ?? window.localStorage,
      beforeHydrate: p.beforeHydrate,
      afterHydrate: p.afterHydrate,
      beforePersist: p.beforePersist,
      afterPersist: p.afterPersist,
      pick: p.pick,
      omit: p.omit,
    }))
  }
}

/**
 * Pinia plugin to persist stores.
 * @see https://prazdevs.github.io/pinia-plugin-persistedstate/
 */
export default createPersistedState()
