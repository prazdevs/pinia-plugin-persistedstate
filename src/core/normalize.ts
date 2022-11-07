import type {
  PersistedStateOptions,
  PersistedStateFactoryOptions,
} from '~/core/types'

function isObject(v: unknown) {
  return typeof v === 'object' && v !== null
}

export default function normalizeOptions(
  options: boolean | PersistedStateOptions | undefined,
  factoryOptions: PersistedStateFactoryOptions,
  globalOrDefaultKey?: string,
): PersistedStateOptions {
  options = isObject(options) ? options : Object.create(null)

  return new Proxy(options as object, {
    get(target, key, receiver) {
      if (key === 'key') {
        return Reflect.get(target, key, receiver) || globalOrDefaultKey
      }

      return (
        Reflect.get(target, key, receiver) ||
        Reflect.get(factoryOptions, key, receiver)
      )
    },
  })
}
