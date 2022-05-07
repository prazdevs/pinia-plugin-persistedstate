import type { PersistedStateOptions } from './types'

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S extends StateTree, Store> {
    /**
     * Persist store in storage.
     * @docs https://github.com/prazdevs/pinia-plugin-persistedstate.
     */
    persist?: boolean | PersistedStateOptions
  }
}

export type {
  PersistedStateOptions,
  PersistedStateFactoryOptions,
  PersistedStateNuxtFactoryOptions,
  Serializer,
  StorageLike,
} from './types'

export {
  createPersistedState,
  createNuxtPersistedState,
  persistedState as default,
} from './plugin'
