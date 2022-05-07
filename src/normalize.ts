import type {
  PersistedStateOptions,
  PersistedStateFactoryOptions,
} from './types'

function isObject(v: unknown) {
  return typeof v === 'object' && v !== null
}

export function normalizeOptions(
  options: boolean | PersistedStateOptions | undefined,
  globalOptions: PersistedStateFactoryOptions,
): PersistedStateOptions {
  options = isObject(options) ? options : Object.create(null)

  return new Proxy(options as object, {
    get(target, key, receiver) {
      return (
        Reflect.get(target, key, receiver) ||
        Reflect.get(globalOptions, key, receiver)
      )
    },
  })
}
