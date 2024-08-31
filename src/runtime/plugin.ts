import { destr } from 'destr'
import type { Pinia, PiniaPluginContext } from 'pinia'
import type { Persistence } from '../types'
import { createPersistence } from './core'
import { storages } from './storages'
import { defineNuxtPlugin, useNuxtApp } from '#app'

function piniaPlugin(context: PiniaPluginContext) {
  const nuxtApp = useNuxtApp()

  createPersistence(context, p => ({
    key: p.key ?? context.store.$id,
    debug: p.debug,
    serializer: p.serializer ?? {
      serialize: data => JSON.stringify(data),
      deserialize: data => destr(data),
    },
    storage: p.storage ?? storages.cookies(),
    beforeHydrate: p.beforeHydrate,
    afterHydrate: p.afterHydrate,
    beforePersist: p.beforePersist,
    afterPersist: p.afterPersist,
    pick: p.pick,
    omit: p.omit,
  } satisfies Persistence), nuxtApp.runWithContext)
}

export default defineNuxtPlugin(({ $pinia }) => {
  ($pinia as Pinia).use(piniaPlugin)
})
