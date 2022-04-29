import type {
  PiniaPluginContext,
  StateTree,
  SubscriptionCallbackMutation,
} from 'pinia'

import { normalizeOptions } from './normalize'
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

export type PersistedStateNuxtFactoryOptions = Omit<
  PersistedStateFactoryOptions,
  'storage'
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
      storage = localStorage,
      beforeRestore = null,
      afterRestore = null,
      serializer = {
        serialize: JSON.stringify,
        deserialize: JSON.parse,
      },
      key = store.$id,
      paths = null,
    } = normalizeOptions(persist, factoryOptions)

    beforeRestore?.(context)

    try {
      const fromStorage = storage.getItem(key)
      if (fromStorage) store.$patch(serializer.deserialize(fromStorage))
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

interface CookieOptions<T> {
  decode: (value: string) => T
  encode: (value: T) => string
  [key: string]: unknown
}

interface CookieRef<T> {
  value: T
}

export function createNuxtPersistedState(
  useCookie: <T>(key: string, opts: CookieOptions<T>) => CookieRef<T>,
  factoryOptions?: PersistedStateNuxtFactoryOptions,
): (context: PiniaPluginContext) => void {
  return createPersistedState({
    storage: {
      getItem: key => {
        return useCookie(key, {
          encode: x => x as string,
          decode: x => x,
        }).value as string
      },
      setItem: (key, value) => {
        useCookie(key, {
          encode: x => x as string,
          decode: x => x,
        }).value = value
      },
    },
    ...factoryOptions,
  })
}

export default createPersistedState()
