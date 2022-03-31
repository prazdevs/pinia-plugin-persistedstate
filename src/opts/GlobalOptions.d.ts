import type { PersistBaseOpts } from './BaseOptions'
import type { PersistHook } from './misc'

export interface PersistGlobalOpts extends PersistBaseOpts {
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

export type PersistNuxtOpts = Omit<PersistGlobalOpts, 'storage'>
