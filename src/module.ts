import {
  addImports,
  addPlugin,
  createResolver,
  defineNuxtModule,
  hasNuxtModule,
  useLogger,
} from '@nuxt/kit'
import { defu } from 'defu'
import type { CookieOptions } from 'nuxt/app'
import type { PersistenceOptions } from './types'

type ModuleOptions = Pick<PersistenceOptions, 'debug'> & {
  storage?: 'cookies' | 'localStorage' | 'sessionStorage'
  cookieOptions?: Omit<
    CookieOptions,
  'encode' | 'decode' | 'default' | 'watch' | 'readonly' | 'filter'
  >
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'pinia-plugin-persistedstate',
    configKey: 'piniaPluginPersistedstate',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  defaults: {},
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const logger = useLogger()

    if (!hasNuxtModule('@pinia/nuxt', nuxt)) {
      logger.warn('The `@pinia/nuxt` module was not found, `pinia-plugin-persistedstate/nuxt` will not work.')
      return
    }

    nuxt.options.build.transpile.push(resolver.resolve('./runtime'))

    nuxt.options.runtimeConfig.public.piniaPluginPersistedstate
      = defu(nuxt.options.runtimeConfig.public.piniaPluginPersistedstate, options)

    addImports({
      name: 'storages',
      from: resolver.resolve('./runtime/storages'),
      as: 'piniaPluginPersistedstate',
    })

    addPlugin(resolver.resolve('./runtime/plugin'))
  },
})

declare module 'nuxt/schema' {
  interface PublicRuntimeConfig {
    piniaPluginPersistedstate: ModuleOptions
  }
}
