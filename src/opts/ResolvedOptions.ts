import type { PersistGlobalOpts } from './GlobalOptions'
import type { PersistStoreOpts } from './StoreOptions'

export interface PersistResolvedOpts
  extends Required<PersistStoreOpts>,
    Required<PersistGlobalOpts> {
  /**
   * The resolved key for the storage item.
   */
  readonly key: string
}
