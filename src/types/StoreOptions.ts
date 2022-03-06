import type { PersistBaseOptions } from './BaseOptions'

export interface PersistStoreOptions extends PersistBaseOptions {
  /**
   * Storage key to use.
   * @default $store.id
   */
  name?: string

  /**
   * Dot-notation paths to partially save state.
   * @default undefined
   */
  paths?: Array<string> | undefined | null
}
