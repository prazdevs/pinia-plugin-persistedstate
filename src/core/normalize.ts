import type {
  PersistedStateOptions,
  PersistedStateFactoryOptions,
} from '~/core/types'

function isObject(v: unknown) {
  return typeof v === 'object' && v !== null
}

function identity<T>(v: T) {
  return v
}

export default function normalizeOptions(
  options: boolean | PersistedStateOptions | undefined,
  factoryOptions: PersistedStateFactoryOptions,
): PersistedStateOptions {
  options = isObject(options) ? options : Object.create(null)

  return new Proxy(options as object, {
    get(target, key, receiver) {
      if (key === 'key') {
        return (factoryOptions.key ?? identity)(
          Reflect.get(target, key, receiver),
        )
      }

      return (
        Reflect.get(target, key, receiver) ||
        Reflect.get(factoryOptions, key, receiver)
      )
    },
  })
}
