import { StorageLike, Serializer, PersistHook } from './utils'

export interface PersistBaseOptions {
  /**
   * Where to store persisted state.
   * @default localStorage
   */
  storage?: StorageLike

  /**
   * Overwrite initial state (patch otherwise).
   * @default false
   */
  overwrite?: boolean

  /**
   * Serializer to use
   */
  serializer?: Serializer

  /**
   * Hook called before state is hydrated from storage.
   * @default undefined
   */
  beforeRestore?: PersistHook | null

  /**
   * Hook called after state is hydrated from storage.
   * @default undefined
   */
  afterRestore?: PersistHook | null
}
