import type { StateTree } from 'pinia'

function get(object: StateTree, path: string[]) {
  return path.reduce((obj: StateTree, p: string) => {
    return obj?.[p] as StateTree
  }, object)
}

function set(object: StateTree, path: string[], val: unknown) {
  return (
    (path.slice(0, -1).reduce((obj, p) => {
      if (!/^(__proto__)$/.test(p)) return (obj[p] = obj[p] || {})
      else return {}
    }, object)[path[path.length - 1]] = val),
    object
  )
}

export default function pick(object: StateTree, paths: string[]): StateTree {
  return paths.reduce<StateTree>((substate: StateTree, path: string) => {
    const pathArray = path.split('.')
    return set(substate, pathArray, get(object, pathArray))
  }, {} as StateTree)
}
