import type { StateTree } from 'pinia'
import type { Mergeable } from '~/core/types'

function merge(destination: Mergeable, source: Mergeable): Mergeable {
  const mergingArrays = Array.isArray(destination) && Array.isArray(source)
  const mergingObjects =
    typeof destination === 'object' &&
    typeof source === 'object' &&
    destination !== null &&
    source !== null

  if (!mergingArrays && !mergingObjects) {
    throw new Error('Can only merge object with object or array with array')
  }

  const result = (mergingArrays ? [] : {}) as Mergeable

  const keys: string[] = [...Object.keys(destination), ...Object.keys(source)]
  keys.forEach((key: string) => {
    if (Array.isArray(destination[key]) && Array.isArray(source[key])) {
      return (result[key] = [
        ...Object.values(
          merge(destination[key] as Mergeable, source[key] as Mergeable),
        ),
      ])
    }

    if (
      source[key] !== null &&
      typeof source[key] === 'object' &&
      typeof destination[key] === 'object'
    ) {
      return (result[key] = merge(
        destination[key] as Mergeable,
        source[key] as Mergeable,
      ))
    }

    if (destination[key] !== undefined && source[key] === undefined) {
      return (result[key] = destination[key])
    }

    if (destination[key] === undefined && source[key] !== undefined) {
      return (result[key] = source[key])
    }
  })

  return result
}

function get(state: StateTree, path: Array<string>): unknown {
  return path.reduce((obj, p) => {
    if (p === '[]' && Array.isArray(obj)) return obj
    return obj?.[p]
  }, state)
}

function set(state: StateTree, path: Array<string>, val: unknown): StateTree {
  const modifiedState = path.slice(0, -1).reduce((obj, p) => {
    if (!/^(__proto__)$/.test(p)) return (obj[p] = obj[p] || {})
    else return {}
  }, state)

  if (
    Array.isArray(modifiedState[path[path.length - 1]]) &&
    Array.isArray(val)
  ) {
    const merged = modifiedState[path[path.length - 1]].map(
      (item: Mergeable, index: number) => {
        if (Array.isArray(item) && typeof item !== 'object') {
          return [...item, ...val[index]]
        }

        if (
          typeof item === 'object' &&
          item !== null &&
          Object.keys(item).some(key => Array.isArray(item[key]))
        ) {
          return merge(item, val[index])
        }

        return {
          ...item,
          ...val[index],
        }
      },
    )
    modifiedState[path[path.length - 1]] = merged
  } else if (
    path[path.length - 1] === undefined &&
    Array.isArray(modifiedState) &&
    Array.isArray(val)
  ) {
    modifiedState.push(...val)
  } else {
    modifiedState[path[path.length - 1]] = val
  }

  return state
}

export default function pick(baseState: StateTree, paths: string[]): StateTree {
  return paths.reduce<StateTree>(
    (substate, path) => {
      const pathArray = path.split('.')
      if (!pathArray.includes('[]')) {
        return set(substate, pathArray, get(baseState, pathArray))
      }
      const arrayIndex = pathArray.indexOf('[]')
      const pathArrayBeforeArray = pathArray.slice(0, arrayIndex)
      const pathArrayUntilArray = pathArray.slice(0, arrayIndex + 1)
      const pathArrayAfterArray = pathArray.slice(arrayIndex + 1)
      const referencedArray = get(
        baseState,
        pathArrayUntilArray,
      ) as Array<StateTree>
      const referencedArraySubstate = []
      for (const item of referencedArray) {
        if (
          pathArrayAfterArray.length !== 0 &&
          (Array.isArray(item) || typeof item === 'object')
        ) {
          referencedArraySubstate.push(
            pick(item, [pathArrayAfterArray.join('.')]),
          )
        } else {
          referencedArraySubstate.push(item)
        }
      }
      return set(substate, pathArrayBeforeArray, referencedArraySubstate)
    },
    Array.isArray(baseState) ? [] : {},
  )
}
