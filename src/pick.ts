function get (object: unknown, path: Array<string>): unknown {
  return path.reduce((obj: Record<string, unknown>, p: string) => {
    return obj?.[p] as Record<string, unknown>
  }, object as Record<string, unknown>)
}

function set (object: unknown, path: Array<string>, val: unknown): unknown {
  return (
    (path.slice(0, -1).reduce((obj: Record<string, unknown>, p: string) => {
      return !/^(__proto__)$/.test(p)
        ? ((obj[p] = obj[p] || {}) as Record<string, unknown>)
        : {}
    }, object as Record<string, unknown>)[path[path.length - 1]] = val),
    object
  )
}

export default function pick (object: unknown, paths: Array<string>): unknown {
  return paths.reduce((substate: unknown, path: string) => {
    const pathArray = path.split('.')
    return set(substate, pathArray, get(object, pathArray))
  }, {})
}
