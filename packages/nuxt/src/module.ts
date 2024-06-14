import { addImports, addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'
import type { CookieOptions } from 'nuxt/app'
import type { NuxtModule } from 'nuxt/schema'
import { defu } from 'defu'

export interface ModuleOptions {
  storage: 'cookies' | 'localStorage' | 'sessionStorage'
  debug: boolean
  cookieOptions: CookieOptions
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@pinia-plugin-persistedstate/nuxt',
    configKey: 'piniaPersistedstate',
    compatibility: {
      nuxt: '>=3.0.0',
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

    nuxt.options.build.transpile.push(resolve('./runtime'))

    // provides module options to runtime
    nuxt.options.runtimeConfig.public.persistedState
      = defu(nuxt.options.runtimeConfig.public.persistedState as ModuleOptions, options)

    // provides storages to runtime
    addImports({
      name: 'persistedState',
      from: resolve('./runtime/storages'),
    })

    // provides plugin
    nuxt.hook('modules:done', () => {
      addPlugin(resolve('./runtime/plugin'), { append: true })
    })
  },
}) satisfies NuxtModule<ModuleOptions>
