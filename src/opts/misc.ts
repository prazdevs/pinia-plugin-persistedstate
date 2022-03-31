import type { PersistResolvedOpts } from './ResolvedOptions'
import type { StateTree, PiniaPluginContext } from 'pinia'

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

export interface PersistHook {
  (ctx: PiniaPluginContext, opts: PersistResolvedOpts): void
  order?: 'before' | 'after' | null
}

export interface CookieOptions<T> {
  decode: (value: string) => T
  encode: (value: T) => string
  [key: string]: unknown
}

export interface CookieRef<T> {
  value: T
}

export type UseCookie = <T>(key: string, opts: CookieOptions<T>) => CookieRef<T>
