import type { PersistBaseOptions } from './BaseOptions'

export interface PersistGlobalOptions extends Partial<PersistBaseOptions> {
  /**
   * The Prefix for all storage items.
   * @default 'pinia'
   */
  prefix?: string
  /**
   * TODO: Global Hooks (run even when normal ones are set on the store)
   * ? run before or after the store ones?
   */
}
