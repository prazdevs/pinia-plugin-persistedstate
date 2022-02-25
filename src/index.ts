import type {
  PiniaPluginContext,
  StateTree,
  SubscriptionCallbackMutation,
} from 'pinia'

import pick from './pick'

export type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

export interface Serializer {
  serialize: (value: StateTree) => string
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
   * Dot-notation paths to partially save state.
   * @default undefined
   */
  paths?: Array<string>

  /**
   * Overwrite initial state (patch otherwise).
   * @default false
   */
  overwrite?: boolean

  /**
   * Serializer to use
   * @default { serialize: JSON.stringify, deserialize: JSON.parse }
   */
  serialize?: Serializer

  /**
   * Hook called before state is hydrated from storage.
   * @default undefined
   */
  beforeRestore?: (context: PiniaPluginContext) => void

  /**
   * Hook called after state is hydrated from storage.
   * @default undefined
   */
  afterRestore?: (context: PiniaPluginContext) => void
}

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S extends StateTree, Store> {
    /**
     * Persist store in storage.
     * @docs https://github.com/prazdevs/pinia-plugin-persistedstate.
     */
    persist?: boolean | PersistedStateOptions
  }
}

/**
 * Pinia plugin to persist stores in a storage based on vuex-persistedstate.
 */
export default function PiniaPersistState (context: PiniaPluginContext): void {
  const {
    options: { persist },
    store,
  } = context

  if (!persist) return

  const {
    storage = localStorage,
    key = store.$id,
    paths = null,
    overwrite = false,
    beforeRestore = null,
    afterRestore = null,
    serialize = {
      serialize: JSON.stringify,
      deserialize: JSON.parse,
    } as Serializer,
  } = typeof persist != 'boolean' ? persist : {}

  beforeRestore?.(context)

  try {
    const fromStorage = storage.getItem(key)
    if (fromStorage) {
      const storageState = serialize.deserialize(fromStorage)
      if (overwrite) store.$state = storageState
      else store.$patch(storageState)
    }
  } catch (_error) {}

  afterRestore?.(context)

  store.$subscribe(
    (_mutation: SubscriptionCallbackMutation<StateTree>, state: StateTree) => {
      try {
        const toStore = Array.isArray(paths) ? pick(state, paths) : state

        storage.setItem(key, JSON.stringify(toStore))
      } catch (_error) {}
    },
    { detached: true },
  )
}
