# Usage With Nuxt 3

The plugin provides a factory function to make integration with Nuxt 3 a breeze. It is assumed you have Pinia already installed with [`@nuxt/pinia`](https://pinia.vuejs.org/ssr/nuxt.html).

## SSR-enabled persistence

Using Nuxt Cookies allows for persistence with full SSR support.   
Declare a plugin by creating a `persistedstate.ts` under the `plugins/` directory:

```ts
// /plugins/persistedstate.ts

import { createNuxtPersistedState } from 'pinia-plugin-persistedstate/nuxt'
import { useCookie } from '#app' // optional import as Nuxt will auto-import it

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.$pinia.use(createNuxtPersistedState(useCookie))
})
```

`createNuxtPersistedState` accepts [global options](/guide/advanced#global-persistence-options) as second parameter with the following options available:

- [`serializer`](/guide/config#serializer)
- [`beforeRestore`](/guide/config#beforeRestore)
- [`afterRestore`](/guide/config#afterRestore)
- `cookieOptions`

:::info
You can specify the [cookie options](https://v3.nuxtjs.org/api/composables/use-cookie#options) to the `cookieOptions` property:

```ts
import { createNuxtPersistedState } from 'pinia-plugin-persistedstate/nuxt'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.$pinia.use(createNuxtPersistedState(useCookie, {
    cookieOptions: {
      expires: 3600, 
      maxAge: 3600,
      sameSite: 'strict',
    }
  }))
})
```
:::

:::warning
Overriding the `storage` option in a store will break its server-side persistence/rehydration with cookies.
:::

## Client-side persistence

In case you do not want to use cookies, you can use the default `createPersistedState` in a client-only plugin.
Declare a plugin by creating a `persistedstate.client.ts` under the `plugins/` directory.

```ts
// /plugins/persistedstate.client.ts

import { createPersistedState } from 'pinia-plugin-persistedstate'


export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.$pinia.use(createPersistedState())
})
```

:::warning
Using client-only persistence when server-side rendering, the store state will most likely be the initial state and **not** the persisted state.
:::
