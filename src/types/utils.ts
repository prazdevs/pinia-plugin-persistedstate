import type { PersistResolvedOptions } from './ResolvedOptions'
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

export type PersistHook = (
  context: PiniaPluginContext,
  opts: PersistResolvedOptions,
) => void
