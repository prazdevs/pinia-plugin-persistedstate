import type { PiniaPluginContext, StateTree } from 'pinia'

export type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

export interface Serializer {
  /**
   * Serializes state into string before storing
   * @default JSON.stringify
   */
  serialize: (value: StateTree) => string

  /**
   * Deserializes string into state before hydrating
   * @default JSON.parse
   */
  deserialize: (value: string) => StateTree
}

export interface PersistedStateOptions {
  /**
   * Storage key to use.
   * @default $store.id
   */
  key?: string

  /**
   * Where to store persisted state.
   * @default localStorage
   */
  storage?: StorageLike

  /**
   * Dot-notation paths to partially save state. Saves everything if undefined.
   * @default undefined
   */
  paths?: Array<string>

  /**
   * Customer serializer to serialize/deserialize state.
   */
  serializer?: Serializer

  /**
   * Hook called before state is hydrated from storage.
   * @default null
   */
  beforeRestore?: (context: PiniaPluginContext) => void

  /**
   * Hook called after state is hydrated from storage.
   * @default undefined
   */
  afterRestore?: (context: PiniaPluginContext) => void

  /**
   * Logs errors in console when enabled.
   * @default false
   */
  debug?: boolean
}

export type PersistedStateFactoryOptions = Pick<
  PersistedStateOptions,
  'storage' | 'serializer' | 'afterRestore' | 'beforeRestore' | 'debug'
>

export type PersistenceHydrator = (opts?: { runHooks?: boolean }) => void

export type PersistanceStorageUpdater = (state: StateTree) => void

export type PersitenceOperationsCache<T> = Record<
  PiniaPluginContext['store']['$id'],
  Array<T>
>

export type DefineStorePersistOption =
  | boolean
  | PersistedStateOptions
  | PersistedStateOptions[]

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
     * @deprecated use `$persist.hydrate` instead
     */
    $hydrate: (opts?: { runHooks?: boolean }) => void

    $persist: {
      /**
       * Manually updates storage with the persisted state
       * @see https://github.com/prazdevs/pinia-plugin-persistedstate
       * @param {number} [persistanceIndex=-1] - the index of the persistence you want to hydrate store from. `-1` will update for all
       */
      updateStorage: (persistanceIndex?: number) => void

      /**
       * Rehydrates store from persisted state
       * Warning: this is for advances usecases, make sure you know what you're doing.
       * @see https://github.com/prazdevs/pinia-plugin-persistedstate
       * @param {number} [persistanceIndex=-1] - the index of the persistence you want to hydrate store from. `-1` will update for all
       * @param {Object} [opts]
       * @param {boolean} [opts.runHooks] - whether to run restore hooks
       */
      hydrate: (
        persistanceIndex?: number,
        opts?: { runHooks?: boolean },
      ) => void
    }
  }
}
