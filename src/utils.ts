import type {
  PersistGlobalOpts,
  PersistHook,
  PersistResolvedOpts,
  PersistStoreOpts,
} from './opts'
import type { PiniaPluginContext, StateTree } from 'pinia'

function get(state: StateTree, path: Array<string>): unknown {
  return path.reduce((obj, p) => {
    return obj?.[p]
  }, state)
}

function set(state: StateTree, path: Array<string>, val: unknown): StateTree {
  return (
    (path.slice(0, -1).reduce((obj, p) => {
      if (!/^(__proto__)$/.test(p)) return (obj[p] = obj[p] || {})
      else return {}
    }, state)[path[path.length - 1]] = val),
    state
  )
}

export function pick(baseState: StateTree, paths: string[]): StateTree {
  return paths.reduce<StateTree>((substate, path) => {
    const pathArray = path.split('.')
    return set(substate, pathArray, get(baseState, pathArray))
  }, {})
}

export function SortHooksBasic(a: PersistHook, b: PersistHook): number {
  if (a.order === b.order) return 0
  else if (a.order === 'before' || b.order === 'after') return -1
  else if (b.order === 'before' || a.order === 'after') return 1
  return 0
}

export function SortHooks(last: PersistHook) {
  return (a: PersistHook, b: PersistHook): number =>
    SortHooksBasic(a, b) || (a === last ? -1 : 1)
}

export function runHooks(
  global: PersistHook,
  store: PersistHook,
  ctx: PiniaPluginContext,
  opts: PersistResolvedOpts,
): void {
  ;[store, global].sort(SortHooks(global)).forEach(hook => hook(ctx, opts))
}

export function ResolveOpts(
  global: PersistGlobalOpts,
  store: PersistStoreOpts,
  ctx: PiniaPluginContext,
): PersistResolvedOpts {
  const {
    prefix = 'pinia-',
    storage: globalStorage = localStorage,
    serializer: globalSerializer = {
      serialize: JSON.stringify,
      deserialize: JSON.parse,
    },
    globalBeforeRestore = null,
    globalAfterRestore = null,
  } = global

  const {
    name = ctx.store.$id,
    storage = globalStorage,
    paths = null,
    serializer = globalSerializer,
    beforeRestore = null,
    afterRestore = null,
  } = store

  return {
    key: prefix + name,
    name,
    prefix,
    storage,
    paths,
    serializer,
    globalBeforeRestore,
    globalAfterRestore,
    beforeRestore,
    afterRestore,
  }
}
