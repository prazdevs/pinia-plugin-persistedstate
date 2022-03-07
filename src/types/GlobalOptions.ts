import type { PersistBaseOptions } from './BaseOptions'
import type { PersistHook } from './utils'

export interface PersistGlobalOptions extends Partial<PersistBaseOptions> {
  /**
   * The Prefix for all storage items.
   * @default 'pinia-'
   */
  prefix?: string
  /**
   * Hook called before state is hydrated from storage. (and after the store hook)
   * @default null
   */
  globalBeforeRestore?: PersistHook | null

  /**
   * Hook called after state is hydrated from storage. (and after the store hook)
   * @default null
   */
  globalAfterRestore?: PersistHook | null
}
