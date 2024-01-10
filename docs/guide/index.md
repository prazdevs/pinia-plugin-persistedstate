# Getting Started

## Overview

This plugin is compatible with `pinia^2.0.0`, make sure you have [Pinia installed](https://pinia.vuejs.org/getting-started.html) before proceeding. `pinia-plugin-persistedstate` comes with many features to make persistence of Pinia stores effortless and configurable with:
- An API similar to [`vuex-persistedstate`](https://github.com/robinvdvleuten/vuex-persistedstate).
- Per-store configuration.
- Custom storage and custom data serializer.
- Pre and post hydration hooks.
- Multiple configurations per store.
- Compatibility with Vue 2 and 3.
- No external dependencies.

## Installation

1. Install the dependency with your favorite package manager:
  ::: code-group
  ```sh [pnpm]
  pnpm i pinia-plugin-persistedstate
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

::: code-group
```ts [option syntax]
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
```ts [setup syntax]
import { defineStore } from 'pinia'

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
:::

Your whole store will now be saved with the [default persistence settings](/guide/config).
