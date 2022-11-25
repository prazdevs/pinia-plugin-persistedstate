import { fileURLToPath } from 'url'
import { addImports, addPlugin, addTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'
import { type CookieOptions } from 'nuxt/app'

export interface ModuleOptions {
  storage: 'cookies' | 'localStorage' | 'sessionStorage'
  debug: boolean
  cookieOptions: CookieOptions
}

const module = defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@pinia-plugin-persistedstate/nuxt',
    configKey: 'piniaPersistedstate',
    compatibility: {
      nuxt: '^3.0.0',
      bridge: false,
    },
  },
  defaults: {
    storage: 'cookies',
    debug: false,
    cookieOptions: { },
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    nuxt.options.build.transpile.push(runtimeDir)

    // provides module options to runtime
    nuxt.options.alias['#persistedstate'] = addTemplate({
      filename: 'persistedstate.mjs',
      getContents: () => `export default ${JSON.stringify(options, null, 2)}`,
    }).dst

    // provides storages to runtime
    addImports({
      name: 'persistedState',
      from: resolve(runtimeDir, 'storages'),
    })

    // provides plugin
    nuxt.hook('modules:done', () => {
      addPlugin(resolve(runtimeDir, 'plugin'), { append: true })
    })
  },
})

export default module
