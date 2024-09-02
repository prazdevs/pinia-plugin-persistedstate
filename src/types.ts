import type { PiniaPluginContext, StateTree } from 'pinia'
import type { Path } from 'deep-pick-omit'

/**
 * Synchronous storage based on Web Storage API.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Storage
 */
export interface StorageLike {
  /**
   * Get a key's value if it exists.
   */
  getItem: (key: string) => string | null

  /**
   * Set a key with a value, or update it if it exists.
   */
  setItem: (key: string, value: string) => void
}

/**
 * Serializer implementation to stringify/parse state.
 */
export interface Serializer {
  /**
   * Serialize state into string before storing.
   * @default JSON.stringify
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
   */
  serialize: (data: StateTree) => string

  /**
   * Deserializes string into state before hydrating.
   * @default destr
   * @see https://github.com/unjs/destr
   */
  deserialize: (data: string) => StateTree
}

export interface Persistence<State extends StateTree = StateTree> {
  /**
   * Storage key to use.
   * @default $store.id
   */
  key: string

  /**
   * Log errors in console.
   * @default false
   */
  debug: boolean

  /**
   * Synchronous storage to persist the state.
   */
  storage: StorageLike

  /**
   * Serializer to serialize/deserialize state into storage.
   */
  serializer: Serializer

  /**
   * Hook called before hydrating store.
   */
  beforeHydrate?: (context: PiniaPluginContext) => void

  /**
   * Hook called after hydrating store.
   */
  afterHydrate?: (context: PiniaPluginContext) => void

  /**
   * Dot-notation paths to pick from state before persisting.
   */
  pick?: Path<State>[] | string[]

  /**
   * Dot-notation paths to omit from state before persisting.
   */
  omit?: Path<State>[] | string[]
}

export type PersistenceOptions<State extends StateTree = StateTree> = Partial<Persistence<State>>

declare module 'pinia' {
  // eslint-disable-next-line unused-imports/no-unused-vars
  export interface DefineStoreOptionsBase<S extends StateTree, Store> {
    /**
     * Persist store in storage
     * @see https://prazdevs.github.io/pinia-plugin-persistedstate
     */
    persist?: boolean | PersistenceOptions<S> | PersistenceOptions<S>[]
  }

  export interface PiniaCustomProperties {
    /**
     * Hydrate store from configured storage
     * Warning: this is for advances usecases, make sure you know what you're doing
     */
    $hydrate: (opts?: { runHooks?: boolean }) => void

    /**
     * Persist store into configured storage
     * Warning: this is for advances usecases, make sure you know what you're doing
     */
    $persist: () => void
  }
}
