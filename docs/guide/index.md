# Getting Started

## Overview

This plugin is compatible with `pinia>=2.0.0`, make sure you have [Pinia installed](https://pinia.vuejs.org/getting-started.html) before proceeding. `pinia-plugin-persistedstate` comes with many features to make persistence of Pinia stores effortless and configurable with:

- An API similar to [`vuex-persistedstate`](https://github.com/robinvdvleuten/vuex-persistedstate).
- Per-store configuration.
- Custom storage and custom data serializer.
- Pre/post persistence/hydration hooks.
- Multiple configurations per store.

> [!TIP] USING NUXT ?
> This package exports a module for better integration with Nuxt and out of the box SSR support. Learn more about it in its [documentation](/frameworks/nuxt).

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

2. Add the plugin to your pinia instance:

```ts
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
```

## Usage

When declaring your store, set the new `persist` option to `true`.

```ts{11}
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

Your whole store will now be saved with the [default persistence settings](/guide/config).
