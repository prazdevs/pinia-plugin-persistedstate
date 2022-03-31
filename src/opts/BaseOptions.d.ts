import type { StorageLike, Serializer } from './misc'

export interface PersistBaseOpts {
  /**
   * Where to store persisted state.
   * @default localStorage
   */
  storage?: StorageLike

  /**
   * Serializer to use
   */
  serializer?: Serializer
}
