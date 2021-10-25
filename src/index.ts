import { PiniaPluginContext } from 'pinia'
import * as shvl from 'shvl'

declare module 'pinia' {
  export interface DefineStoreOptions<Id extends string, S extends StateTree, G, A> {
    persist?: boolean | PersistedStateOptions
  }
}

export type StorageLike = Pick<Storage, 'getItem' | 'removeItem' | 'setItem'>

export interface PersistedStateOptions {
  key?: string
  storage?: StorageLike
  paths?: Array<string>
  overwrite?: boolean
}

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
  } catch (_) { }
  
  store.$subscribe((_: unknown, state: unknown) => {
    try {
      const toStore = Array.isArray(paths)
        ? paths.reduce((substate, path) => {
            return shvl.set(substate, path, shvl.get(state as Object, path))
          }, {})
        : state

      storage.setItem(key, JSON.stringify(toStore))
    } catch (_) { }
    
  })
}
