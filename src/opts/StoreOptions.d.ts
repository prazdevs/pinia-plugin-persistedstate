import type { PersistBaseOpts } from './BaseOptions'
import type { PersistHook } from './misc'

export interface PersistStoreOpts extends PersistBaseOpts {
  /**
   * Storage key to use.
   * @default $store.id
   */
  name?: string

  /**
   * Dot-notation paths to partially save state.
   * @default null
   */
  paths?: Array<string> | null

  /**
   * Hook called before state is hydrated from storage.
   * @default null
   */
  beforeRestore?: PersistHook | null

  /**
   * Hook called after state is hydrated from storage.
   * @default null
   */
  afterRestore?: PersistHook | null
}
