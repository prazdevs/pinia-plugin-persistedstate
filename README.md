<p align="center">
  <img src="https://raw.githubusercontent.com/prazdevs/pinia-plugin-persistedstate/main/docs/public/logo-dark.svg" style="width: 100px">
</p>

<h1 align="center">
  Pinia Plugin Persistedstate
</h1>
<p align="center">
  Configurable persistence and rehydration of Pinia stores.
</p>
<p align="center">
  <a href="https://npmjs.com/package/pinia-plugin-persistedstate"><img src="https://img.shields.io/npm/v/pinia-plugin-persistedstate?style=flat-square&labelColor=313244&color=cba6f7" alt="npm"></a>
  <a href="https://bundlephobia.com/result?p=pinia-plugin-persistedstate"><img src="https://img.shields.io/bundlephobia/minzip/pinia-plugin-persistedstate?style=flat-square&labelColor=313244&color=cba6f7" alt="minizipped size"></a>
  <a href="https://github.com/prazdevs/pinia-plugin-persistedstate/blob/main/LICENSE"><img src="https://img.shields.io/github/license/prazdevs/pinia-plugin-persistedstate?style=flat-square&labelColor=313244&color=cba6f7" alt="license"></a>
</p>
<p align="center">
  <a href="https://prazdevs.github.io/pinia-plugin-persistedstate"><b>Documentation</b></a>
</p>

## Features

- Persist Pinia stores with a friendly API inspired by [`vuex-persistedstate`](https://github.com/robinvdvleuten/vuex-persistedstate).
- Highly customizable (storage, serializer, paths picking/omitting).
- Out of the box SSR-friendly support for [`Nuxt`](#usage-with-nuxt).
- Very smol (<2kB minzipped).

## Quickstart

1. Install with your favorite package manager:
   - **pnpm** : `pnpm add pinia-plugin-persistedstate`
   - npm : `npm i pinia-plugin-persistedstate`
   - yarn : `yarn add pinia-plugin-persistedstate`

2. Add the plugin to pinia:

```ts
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
```

3. Add the `persist` option to the store you want to be persisted:

```ts
import { defineStore } from 'pinia'

export const useStore = defineStore('store', {
  state: () => ({
    someState: 'hello pinia',
  }),
  persist: true,
})
```

## Configuration

You can configure how a store is persisted by specifying options to the `persist` property:

```ts
export const useStore = defineStore('store', () => {
  const someState = ref('hello pinia')
  return { someState }
}, {
  persist: {
    storage: sessionStorage,
    pick: ['someState'],
  },
})
```

All the available configuration options are explained [here](https://prazdevs.github.io/pinia-plugin-persistedstate/guide/config).

## Usage with Nuxt

Nuxt support comes out of the box thanks to the included module. You just need to install the package and add the module to your `nuxt.config.ts` as follows:

```ts
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt', // required
    'pinia-plugin-persistedstate/nuxt',
  ],
})
```

More information on storages and configuration in Nuxt [here](https://prazdevs.github.io/pinia-plugin-persistedstate/frameworks/nuxt).

## Limitations

There are several limitations that should be considered, more on those [here](https://prazdevs.github.io/pinia-plugin-persistedstate/guide/limitations).

## Contributing

See the [contribution guide](https://github.com/prazdevs/pinia-plugin-persistedstate/blob/main/CONTRIBUTING.md).

## License

[MIT](https://github.com/prazdevs/pinia-plugin-persistedstate/blob/main/LICENSE) © 2021-present [Sacha Bouillez](https://github.com/prazdevs)
