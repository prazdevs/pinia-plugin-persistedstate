import * as shvl from 'shvl'

import type { PiniaPluginContext } from 'pinia'

export type StorageLike = Pick<Storage, 'getItem' | 'removeItem' | 'setItem'>

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
}

declare module 'pinia' {
  export interface DefineStoreOptions<Id extends string, S extends StateTree, G, A> {
    /**
     * Persist store in storage.
     * @docs https://github.com/prazdevs/pinia-plugin-persistedstate.
     */
    persist?: boolean | PersistedStateOptions
  }
}

/**
 * Pinia plugin to persist stores in a storage based on vuex-persistedstate.
 * @param context Options
 */
export default function (context: PiniaPluginContext): void {
  const { options: { persist }, store } = context

  if (!persist) return

  const {
    storage = localStorage,
    key = store.$id,
    paths = null,
    overwrite = false,
  } = typeof persist != 'boolean' ? persist : {}

  try {
    const fromStorage = storage.getItem(key)
    if (fromStorage) {
      if (overwrite) store.$state = JSON.parse(fromStorage)
      else store.$patch(JSON.parse(fromStorage))
    }
  } catch (_error) {}

  store.$subscribe((_mutation: unknown, state: unknown) => {
    try {
      const toStore = Array.isArray(paths)
        ? paths.reduce((substate, path) => {
          return shvl.set(
            substate,
            path,
            shvl.get(state as Record<string, unknown>, path),
          )
        }, {})
        : state

      storage.setItem(key, JSON.stringify(toStore))
    } catch (_error) {}
  })
}
