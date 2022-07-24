import type { PersistedStateOptions } from './core/types'

import { createPersistedState } from './core/plugin'

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S extends StateTree, Store> {
    /**
     * Persist store in storage.
     * @see https://github.com/prazdevs/pinia-plugin-persistedstate
     */
    persist?: boolean | PersistedStateOptions | PersistedStateOptions[]
  }

  export interface PiniaCustomProperties {
    /**
     * Rehydrates store from persisted state
     * Warning: this is for advances usecases, make sure you know what you're doing.
     * @see https://github.com/prazdevs/pinia-plugin-persistedstate
     */
    $hydrate: (opts?: { runHooks?: boolean }) => void
  }
  export interface PiniaCustomProperties {
    /**
     * @
     * Forces the pinia store to be rehydrated with stored data.
     * Warning: this shouldn't be used in most cases
     */
    $restoreManually: () => void
  }
}

export type {
  PersistedStateOptions,
  PersistedStateFactoryOptions,
} from './core/types'

export { createPersistedState } from './core/plugin'

export default createPersistedState()
