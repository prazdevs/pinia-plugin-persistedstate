import type {
  PersistGlobalOpts,
  PersistNuxtOpts,
  PersistStoreOpts,
  StorageLike,
} from './opts'
import type { PiniaPluginContext } from 'pinia'

import { UseCookie } from './opts/misc'
import { ResolveOpts, pick } from './utils'

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S extends StateTree, Store> {
    /**
     * Persist store in storage.
     * @docs https://github.com/prazdevs/pinia-plugin-persistedstate.
     */
    persist?: boolean | PersistStoreOpts
  }
}

export default function PersistState(globalOpts: PersistGlobalOpts = {}) {
  return function (context: PiniaPluginContext): void {
    const {
      options: { persist },
      store,
    } = context

    if (!persist) return

    const opts = ResolveOpts(
      globalOpts,
      typeof persist != 'boolean' ? persist : {},
      context,
    )

    opts.beforeRestore?.(context, opts)

    try {
      const fromStorage = opts.storage.getItem(opts.name)
      if (fromStorage) store.$patch(opts.serializer.deserialize(fromStorage))
    } catch (_error) {}

    opts.afterRestore?.(context, opts)

    store.$subscribe(
      (_mutation, state) => {
        try {
          const toStore = Array.isArray(opts.paths)
            ? pick(state, opts.paths)
            : state

          opts.storage.setItem(opts.name, opts.serializer.serialize(toStore))
        } catch (_error) {}
      },
      { detached: true },
    )
  }
}

export function createUseCookieStorage(useCookie: UseCookie): StorageLike {
  return {
    getItem: key => {
      return useCookie<string>(key, {
        encode: x => x,
        decode: x => x,
      }).value
    },
    setItem: (key, value) => {
      useCookie<string>(key, {
        encode: x => x,
        decode: x => x,
      }).value = value
    },
  }
}

export function NuxtPersistState(
  useCookie: UseCookie,
  globalOpts?: PersistNuxtOpts,
): (context: PiniaPluginContext) => void {
  return PersistState({
    storage: createUseCookieStorage(useCookie),
    ...globalOpts,
  })
}

export type {
  CookieOptions,
  CookieRef,
  PersistBaseOpts,
  PersistGlobalOpts,
  PersistHook,
  PersistNuxtOpts,
  PersistResolvedOpts,
  PersistStoreOpts,
  Serializer,
  StorageLike,
  UseCookie,
} from './opts'
