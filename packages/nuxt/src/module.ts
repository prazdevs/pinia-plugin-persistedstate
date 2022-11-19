import { fileURLToPath } from 'url'
import { addPlugin, addTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'

export interface ModuleOptions { }

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'pinia-persisted-state',
    configKey: 'piniaPersistedState',
    compatibility: {
      nuxt: '^3.0.0',
      bridge: false,
    },
  },
  defaults: { },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

    nuxt.options.alias['#pinia-plugin-persistedstate'] = addTemplate({
      filename: 'storages.ts',
      write: true,
      src: resolve(runtimeDir, 'storages.ts'),
    }).dst

    nuxt.hook('modules:done', () => {
      nuxt.options.build.transpile.push(runtimeDir)
      addPlugin(resolve(runtimeDir, 'plugin'), { append: true })
    })
  },
})

