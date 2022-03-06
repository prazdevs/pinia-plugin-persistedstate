import type { PersistGlobalOptions } from './GlobalOptions'
import type { PersistStoreOptions } from './StoreOptions'

export interface PersistResolvedOptions
  extends Required<PersistStoreOptions>,
    Required<PersistGlobalOptions> {
  /**
   * The resolved key for the storage item.
   */
  readonly key: string
}
