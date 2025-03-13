import type { CookiesStorageOptions } from './runtime/storages'
import type { PersistenceOptions } from './types'
import {
  addImports,
  addPlugin,
  createResolver,
  defineNuxtModule,
  hasNuxtModule,
  useLogger,
} from '@nuxt/kit'
import { defu } from 'defu'

type ModuleOptions = Pick<PersistenceOptions, 'debug'> & {
  /**
   * Default storage for persistence. Only accepts presets.
   */
  storage?: 'cookies' | 'localStorage' | 'sessionStorage'

  /**
   * Global key template, allow pre/postfixing store keys.
   * @example 'my-%id-persistence' will yield 'my-<store-id>-persistence'
   */
  key?: `${string}%id${string}`

  /**
   * Options used globally by default cookie storage.
   * Ignored for other storages.
   */
  cookieOptions?: Omit<CookiesStorageOptions, 'encode' | 'decode'>

  /**
   * Automatically persist all stores with global defaults, opt-out individually.
   */
  auto?: boolean
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

    if (!hasNuxtModule('pinia', nuxt)) {
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

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    piniaPluginPersistedstate: ModuleOptions
  }
}
