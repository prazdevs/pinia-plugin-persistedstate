# Usage with Nuxt3

Persisting pinia stores in Nuxt is easier thanks to the dedicated module.

## Installation

1. Install the dependency with your favorite package manager:
    - pnpm:
    ```sh
    pnpm i -D @pinia-plugin-persistedstate/nuxt
    ```
    - npm:
    ```sh
    npm i -D @pinia-plugin-persistedstate/nuxt
    ```
    - yarn:
    ```sh
    yarn add -D @pinia-plugin-persistedstate/nuxt
    ```

2. Add the module to the Nuxt config (`nuxt.config.ts`):
```ts
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
  ],
})
```

## Usage

When declaring your store, set the new `persist` option to `true`.

```ts
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

## Choosing a storage

By default, your stores will be persisted in cookies (using Nuxt's [`useCookie`](https://nuxt.com/docs/api/composables/use-cookie) under the hood). You can configure what storage you want to use by using the storages available under the auto-imported `persistedState` variable.

:::info
Using other storages than the ones exposed by `persistedState` may have unexpected behaviors.
:::

### `localStorage`

```ts
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => {
    return {
      someState: 'hello pinia',
    }
  },
  persist: {
    storage: persistedState.localStorage,
  },
})
```

:::warning
`localStorage` is client side only.
:::

### `sessionStorage`

```ts
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => {
    return {
      someState: 'hello pinia',
    }
  },
  persist: {
    storage: persistedState.sessionStorage,
  },
})
```

:::warning
`sessionStorage` is client side only.
:::

### `cookiesWithOptions`

```ts
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => {
    return {
      someState: 'hello pinia',
    }
  },
  persist: {
    storage: persistedState.cookiesWithOptions({
      sameSite: 'strict',
    }),
  },
})
```

:::tip
Using `cookiesWithOptions()` allows you to [configure cookies](https://nuxt.com/docs/api/composables/use-cookie#options). Passing no options is the same as using `cookies`, which is the default behavior.
:::

## Global options

The module accepts some options defined in `nuxt.config.ts` under the `piniaPersistedstate` key:

```ts
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt'
  ],
  runtimeConfig: {
	public: {
		persistedState: {
		    cookieOptions: {
			    sameSite: 'strict',
			},
			storage: 'localStorage',
		},
	},
  },
})
```

- `storage`: sets the storage used to persist by default (`'localStorage'`, `'sessionStorage'` or `'cookies'`).
- `cookieOptions`: default [cookie options](https://nuxt.com/docs/api/composables/use-cookie#options) (only used when persisting in cookies).
- `debug`: see [`debug`](/guide/config.html#debug).
