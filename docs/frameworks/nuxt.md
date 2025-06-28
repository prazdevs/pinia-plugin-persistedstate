# Usage with Nuxt

The `pinia-plugin-persistedstate` package comes with a Nuxt module to offer an SSR-friendly experience out of the box.

## Installation

1. Install the dependency with your favorite package manager:

::: code-group

```sh [pnpm]
pnpm add pinia-plugin-persistedstate
```

```sh [npm]
npm i pinia-plugin-persistedstate
```

```sh [yarn]
yarn add pinia-plugin-persistedstate
```

:::

1. Add the module to the Nuxt config:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
  ],
})
```

## Usage

When declaring your store, set the new `persist` option to `true`.

::: code-group

```ts{11} [setup syntax]
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStore = defineStore(
  'main',
  () => {
    const someState = ref('hello pinia')
    return { someState }
  },
  {
    persist: true,
  },
)
```

```ts{9} [option syntax]
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => {
    return {
      someState: 'hello pinia',
    }
  },
  persist: true,
})
```

:::

## Defaults

The Nuxt module comes pre-configured with the following:

- [`cookies`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies) as storage.
- [`store.$id`](https://pinia.vuejs.org/api/interfaces/pinia.StoreProperties.html) as default key for storage.
- [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)/[`destr`](https://github.com/unjs/destr) as serializer/deserializer.
- The whole state is persisted to the storage.

## Choosing a storage

You can configure what storage you want to use by using the storages available under the auto-imported `piniaPluginPersistedstate` variable.

> [!WARNING]
> Using other storages than the ones exposed by `persistedState` may have unexpected behaviors.

### `cookies`

```ts{10}
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => {
    return {
      someState: 'hello pinia',
    }
  },
  persist: {
    storage: piniaPluginPersistedstate.cookies(),
  },
})
```

> [!TIP]
> The `persistedState.cookies` method accept an object parameter to configure cookies with the following options (inherited from Nuxt's `useCookie`):
>
> - [`domain`](https://nuxt.com/docs/api/composables/use-cookie#domain)
> - [`encode`](https://nuxt.com/docs/api/composables/use-cookie#encode)/[`decode`](https://nuxt.com/docs/api/composables/use-cookie#decode)
> - [`expires`](https://nuxt.com/docs/api/composables/use-cookie#maxage-expires)
> - [`httpOnly`](https://nuxt.com/docs/api/composables/use-cookie#httponly)
> - [`maxAge`](https://nuxt.com/docs/api/composables/use-cookie#maxage-expires)
> - [`partitioned`](https://nuxt.com/docs/api/composables/use-cookie#partitioned)
> - [`path`](https://nuxt.com/docs/api/composables/use-cookie#path)
> - [`sameSite`](https://nuxt.com/docs/api/composables/use-cookie#samesite)
> - [`secure`](https://nuxt.com/docs/api/composables/use-cookie#secure)

> [!WARNING]
> Be careful when saving stores with a lot of data as cookie size is **limited to 4098 bytes**. More on cookie storage in [the MDN documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#data_storage).

### `localStorage`

```ts{10}
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => {
    return {
      someState: 'hello pinia',
    }
  },
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  },
})
```

> [!WARNING] > `localStorage` is client side only.

### `sessionStorage`

```ts{10}
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => {
    return {
      someState: 'hello pinia',
    }
  },
  persist: {
    storage: piniaPluginPersistedstate.sessionStorage(),
  },
})
```

> [!WARNING] > `sessionStorage` is client side only.

## Global options

The module accepts some options defined in `nuxt.config.ts` under the `piniaPluginPersistedstate` key:

- [`cookieOptions`](#cookies) (except `decode` and `encode` as functions are not supported)
- `debug`
- [`key`](#global-key)
- `storage`

> [!NOTE]
> The global storage option only accepts string values of pre-configured storages (`'cookies'`, `'localStorage'`, `'sessionStorage'`). This is due Nuxt's way of [passing module options to runtime](https://nuxt.com/docs/guide/going-further/modules#exposing-options-to-runtime).

```ts{6-12} [nuxt.config.ts]
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt'
  ],
  piniaPluginPersistedstate: {
    storage: 'cookies',
    cookieOptions: {
      sameSite: 'lax',
    },
    debug: true,
  },
})
```

## Global key

You can provide a template string to prefix/postfix keys used globally. The provided key must include the token `%id` which will be replaced by the corresponding store's id.

```ts{6} [nuxt.config.ts]
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt'
  ],
  piniaPluginPersistedstate: {
    key: 'prefix_%id_postfix',
  },
})
```

Any store with `my-store` as persistence key (user-provided or infered from store id) will be persisted under the `prefix_my-store_postfix` key.

## Limitations

### Usage in middleware and SSR with `cookies`

While accessing a store within middleware is okay at any time, persisting/hydrating data from `cookies` can fail and throw a `[nuxt] A composable that requires access to the Nuxt instance was called outside of a plugin, Nuxt hook, Nuxt middleware, or Vue setup function.` error.
This is due to Pinia stores being available and instantiating before Nuxt instance, while `pinia-plugin-persistedstate` needs a Nuxt instance to access `useCookie`.

:::tip Workaround
To work around this limitation you can:

- Make sure to access the store once Nuxt instance is available (be wary of middlewares).
- Use the `useCookie` composable directly instead of the store for this specific usecase.

These solutions are far from perfect and may not fit your usecase. Keep in mind this is a Pinia plugin before being a Nuxt module.
:::

### Using `cookies` with `expires` on Cloudflare workers

Due to a [limitation](https://community.cloudflare.com/t/date-in-worker-is-reporting-thu-jan-01-1970-0000-gmt-0000/236503/3) with Cloudflare workers, you cannot set a Javascript `Date` in the global worker context. As a workaround, prefer using `maxAge` instead of `expires`.

```ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStore = defineStore(
  'main',
  () => {
    const someState = ref('hello pinia')
    return { someState }
  },
  {
    persist: piniaPluginPersistedstate.cookies({
      // DO NOT USE - the date in cloudflare worker will return 1970-01-01 // [!code --]
      expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // [!code --]
      // USE THIS INSTEAD // [!code ++]
      maxAge: 365 * 24 * 60 * 60, // [!code ++]
    }),
  },
)
```
