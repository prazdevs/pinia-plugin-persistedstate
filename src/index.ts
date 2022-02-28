import type {
  PiniaPluginContext,
  StateTree,
  SubscriptionCallbackMutation,
} from 'pinia'

import pick from './pick'

export type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

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

export type PersistedStateDefaultOptions = Pick<
  PersistedStateOptions,
  "storage" | "overwrite" | "beforeRestore" | "afterRestore"
>;

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
 export const createPiniaPluginPersistedstate =
 (options: PersistedStateDefaultOptions = {}) =>
 (context: PiniaPluginContext): void => {
  const { options: { persist }, store } = context

  if (!persist) return

  const {
    storage = options?.storage ?? localStorage,
    key = store.$id,
    paths = null,
    overwrite = options?.overwrite ?? false,
    beforeRestore = options?.beforeRestore,
    afterRestore = options?.afterRestore,
  } = typeof persist != 'boolean' ? persist : {}

  beforeRestore?.(context)

  try {
    const fromStorage = storage.getItem(key)
    if (fromStorage) {
      if (overwrite) store.$state = JSON.parse(fromStorage)
      else store.$patch(JSON.parse(fromStorage))
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

const piniaPluginPersistedState = createPiniaPluginPersistedstate()
export default piniaPluginPersistedState
