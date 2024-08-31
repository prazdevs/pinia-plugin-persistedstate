import {
  addImports,
  addPlugin,
  createResolver,
  defineNuxtModule,
  hasNuxtModule,
  useLogger,
} from '@nuxt/kit'

interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'pinia-plugin-persistedstate',
    configKey: 'piniaPluginPersistedstate',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  defaults: {},
  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const logger = useLogger()

    if (!hasNuxtModule('@pinia/nuxt', nuxt)) {
      logger.warn('The `@pinia/nuxt` module was not found, `pinia-plugin-persistedstate/nuxt` will not work.')
      return
    }

    nuxt.options.build.transpile.push(resolver.resolve('./runtime'))

    addImports({
      name: 'storages',
      from: resolver.resolve('./runtime/storages'),
      as: 'piniaPluginPersistedstate',
    })
    addPlugin(resolver.resolve('./runtime/plugin'))
  },
})
