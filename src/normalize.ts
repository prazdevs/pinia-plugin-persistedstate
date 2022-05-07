import type {
  PersistedStateOptions,
  PersistedStateFactoryOptions,
} from './index'

const isObject = (v: unknown) => typeof v === 'object' && v !== null

export const normalizeOptions = (
  options: boolean | PersistedStateOptions | undefined,
  globalOptions: PersistedStateFactoryOptions,
): PersistedStateOptions => {
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
