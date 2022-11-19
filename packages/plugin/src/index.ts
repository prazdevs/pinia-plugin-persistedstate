import { createPersistedState } from './plugin'

export {
  type PersistedStateOptions,
  type PersistedStateFactoryOptions,
  type Serializer,
  type StorageLike,
} from './types'

export { createPersistedState }
export default createPersistedState()
