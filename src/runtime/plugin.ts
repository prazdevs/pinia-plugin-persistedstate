import type { Pinia, PiniaPluginContext } from 'pinia'
import { defineNuxtPlugin, useNuxtApp, useRuntimeConfig } from '#app'
import { destr } from 'destr'
import { createPersistence } from './core'
import { storages } from './storages'

function piniaPlugin(context: PiniaPluginContext) {
  const nuxtApp = useNuxtApp()
  const config = useRuntimeConfig()
  const options = config.public.piniaPluginPersistedstate

  createPersistence(context, p => ({
    key: options.key
      ? options.key.replace(/%id/g, p.key ?? context.store.$id)
      : (p.key ?? context.store.$id),
    debug: p.debug ?? options.debug ?? false,
    serializer: p.serializer ?? {
      serialize: data => JSON.stringify(data),
      deserialize: data => destr(data),
    },
    storage: p.storage ?? (options.storage
      ? options.storage === 'cookies'
        ? storages.cookies(options.cookieOptions)
        : storages[options.storage]()
      : storages.cookies()),
    beforeHydrate: p.beforeHydrate,
    afterHydrate: p.afterHydrate,
    pick: p.pick,
    omit: p.omit,
  }), nuxtApp.runWithContext)
}

export default defineNuxtPlugin(({ $pinia }) => {
  ($pinia as Pinia).use(piniaPlugin)
})
