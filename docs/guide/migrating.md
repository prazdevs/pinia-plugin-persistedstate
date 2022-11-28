# Migrating from v2

## Breaking changes

- The `paths` config option does not support array notation (`nested.[].array`) anymore. Implementing this feature on v2 ended up adding a lot of hard to maintain code and making the bundle much bigger. Testability and performance were also a concern. This is not planned to be back in the v3, if you really need this feature, you may want to stick with v2.

- The base package (`pinia-plugin-persistedstate`) now only exports the plugin and its factory function. To use it within meta-frameworks (Nuxt, Quasar...), you can manually configure the plugin depending on how your meta-framework integrate Vue plugins.

## Usage with Nuxt

You no longer need to create a Nuxt plugin to add persistence to your pinia stores in Nuxt: the Nuxt module `@pinia-plugin-persistedstate/nuxt` will setup everything for you. More information in the [`dedicated documentation`](/frameworks/nuxt-3).

:::warning
At the moment, the module only supports Nuxt 3.
:::
