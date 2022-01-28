/**
 * Compose two functions
 * @param f outer function
 * @param g inner function
 * @returns x => f(g(x))
 */
const _compose
  = <T1, T2, T3>(f: (x: T2) => T3, g: (x: T1) => T2) =>
    (x: T1) =>
      f(g(x))

/**
 * Reduce an array
 * @param reducer reducing function
 * @returns arr => init => arr.reduce(reducer, init)
 */
const _reduce
  = <C, A>(reducer: (cur: C) => (acc: A) => A) =>
    (init: A) =>
      (arr: readonly C[]) =>
        arr.reduce((acc, cur) => reducer(cur)(acc), init)

/**
 * Get a property from an object
 * @param prop property name
 * @returns obj[prop] || undefined
 */
const _prop = (prop: string) => (obj?: unknown) =>
  (obj as Record<string, unknown>)?.[prop]

/**
 * Split a string into an array of string
 * @param separator splitting character(s)
 * @returns str => str.split(separator)
 */
const _split = (separator: string) => (str: string) => str.split(separator)

/**
 * Gets nested property from path
 * @param obj object to read
 * @returns path => obj[path] || undefined
 */
export const _get: (obj: unknown) => (x: string) => unknown = (obj: unknown) =>
  _compose(_reduce(_prop)(obj), _split('.'))
