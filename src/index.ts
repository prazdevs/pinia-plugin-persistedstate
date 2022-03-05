import type {
  PiniaPluginContext,
  StateTree,
  SubscriptionCallbackMutation,
} from 'pinia'

import pick from './pick'

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
   * Dot-notation paths to partially save state.
   * @default undefined
   */
  paths?: Array<string>

  /**
   * Serializer to use
   */
  serializer?: Serializer

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

export type PersistedStateFactoryOptions = Pick<
  PersistedStateOptions,
  'storage' | 'serializer' | 'afterRestore' | 'beforeRestore'
>

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S extends StateTree, Store> {
    /**
     * Persist store in storage.
     * @docs https://github.com/prazdevs/pinia-plugin-persistedstate.
     */
    persist?: boolean | PersistedStateOptions
  }
}

export function createPersistedState(
  factoryOptions: PersistedStateFactoryOptions = {},
) {
  return function (context: PiniaPluginContext): void {
    const {
      options: { persist },
      store,
    } = context

    if (!persist) return

    const {
      storage = factoryOptions.storage ?? localStorage,
      beforeRestore = factoryOptions.beforeRestore ?? null,
      afterRestore = factoryOptions.afterRestore ?? null,
      serializer = factoryOptions.serializer ?? {
        serialize: JSON.stringify,
        deserialize: JSON.parse,
      },
      key = store.$id,
      paths = null,
    } = typeof persist != 'boolean' ? persist : {}

    beforeRestore?.(context)

    try {
      const fromStorage = storage.getItem(key)
      if (fromStorage) {
        store.$patch(serializer.deserialize(fromStorage))
      }
    } catch (_error) {}

    afterRestore?.(context)

    store.$subscribe(
      (
        _mutation: SubscriptionCallbackMutation<StateTree>,
        state: StateTree,
      ) => {
        try {
          const toStore = Array.isArray(paths) ? pick(state, paths) : state

          storage.setItem(key, serializer.serialize(toStore as StateTree))
        } catch (_error) {}
      },
      { detached: true },
    )
  }
}

export default createPersistedState()
