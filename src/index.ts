import * as shvl from 'shvl'

import type { PiniaPluginContext } from 'pinia'

import { _get } from './dot-notation'

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
 */
export default function (context: PiniaPluginContext): void {
  const { options: { persist }, store } = context

  const t = typeof store

  if (!persist) return

  const {
    storage = localStorage,
    key = store.$id,
    paths = null,
    overwrite = false,
    beforeRestore = null,
    afterRestore = null,
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

  store.$subscribe((_mutation: unknown, state: unknown) => {
    try {
      const toStore = Array.isArray(paths)
        ? paths.reduce((substate, path) => {
          return shvl.set(
            substate,
            path,
            _get(state)(path),
          )
        }, {})
        : state

      storage.setItem(key, JSON.stringify(toStore))
    } catch (_error) {}
  })
}
