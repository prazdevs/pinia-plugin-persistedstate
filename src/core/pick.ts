import type { StateTree } from 'pinia'

import { isObject, isArray, isUndefined } from './is'

export type Mergeable = Record<string, unknown>

function merge(destination: Mergeable, source: Mergeable): Mergeable {
  const mergingArrays = isArray(destination) && isArray(source)
  const mergingObjects = isObject(destination) && isObject(source)

  if (!mergingArrays && !mergingObjects) {
    throw new Error('Can only merge object with object or array with array')
  }

  const result = (mergingArrays ? [] : {}) as Mergeable

  const keys: string[] = [...Object.keys(destination), ...Object.keys(source)]
  keys.forEach((key: string): void => {
    if (isArray(destination[key]) && isArray(source[key])) {
      result[key] = [
        ...Object.values(
          merge(destination[key] as Mergeable, source[key] as Mergeable),
        ),
      ]
    } else if (isObject(source[key]) && typeof destination[key] === 'object') {
      result[key] = merge(
        destination[key] as Mergeable,
        source[key] as Mergeable,
      )
    } else if (!isUndefined(destination[key]) && isUndefined(source[key])) {
      result[key] = destination[key]
    } else if (isUndefined(destination[key]) && !isUndefined(source[key])) {
      result[key] = source[key]
    }
  })

  return result
}

function get(state: StateTree, path: Array<string>): unknown {
  return path.reduce((obj, p) => {
    if (p === '[]' && isArray(obj)) return obj
    return obj?.[p]
  }, state)
}

function set(state: StateTree, path: Array<string>, val: unknown): StateTree {
  const modifiedState = path.slice(0, -1).reduce((obj, p) => {
    if (!/^(__proto__)$/.test(p)) return (obj[p] = obj[p] || {})
    else return {}
  }, state)

  if (isArray(modifiedState[path[path.length - 1]]) && isArray(val)) {
    const merged = modifiedState[path[path.length - 1]].map(
      (item: Mergeable, index: number) => {
        if (isArray(item) && typeof item !== 'object') {
          return [...item, ...val[index]]
        }

        if (
          isObject(item) &&
          Object.keys(item).some(key => isArray(item[key]))
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
    isUndefined(path[path.length - 1]) &&
    isArray(modifiedState) &&
    isArray(val)
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
          (isArray(item) || typeof item === 'object')
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
    isArray(baseState) ? [] : {},
  )
}
