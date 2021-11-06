<h1 align="center">pinia-plugin-persistedstate</h1>
<p align="center">Configurable persistence and rehydration of Pinia stores.</p>

<p align="center">
  <img alt="" src="https://img.shields.io/github/package-json/v/prazdevs/pinia-plugin-persistedstate?style=flat&color=orange" />
  <img alt="" src="https://img.shields.io/github/workflow/status/prazdevs/pinia-plugin-persistedstate/Build,%20lint%20and%20test?label=ci&logo=github">
  <img alt="" src="https://img.shields.io/sonar/quality_gate/prazdevs_pinia-plugin-persistedstate?style=flat&logo=sonarcloud&server=https%3A%2F%2Fsonarcloud.io">
  <img alt="" src="https://img.shields.io/codecov/c/github/prazdevs/pinia-plugin-persistedstate?logo=Codecov&token=BYLAJJOOLS">
  <img alt="" src="https://img.shields.io/github/license/prazdevs/pinia-plugin-persistedstate?style=flat&color=blue" />
</p>

## ✨ Features

- Persist Pinia stores with the same API as [`vuex-persistedstate`](https://github.com/robinvdvleuten/vuex-persistedstate).
- Configurable per Pinia store.
- Still compatible with Vue 2 and 3.
- Super small (<1kB).

## ⚙️ Installing

1. Install with your favourite package manager (**pnpm**, npm, yarn).
2. Add the plugin to pinia:
```ts
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
```

## 🚀 Usage

You just need to add the `persist` option to the store you want to be persisted as follows:

```ts
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => {
    return {
      someState: 'hello pinia',
    }
  },
  persist: true
})
```

In case you want to configure how the data should be persisted, `persist` can take options:

- `key: string` : Key to use in storage (defaults to the current store id).
- `storage` : Storage like object to persist state to. Must have `getItem`, `setItem` and `removeItem` methods (defaults to `localStorage`).
- `paths: Array<string>` : Array of dot-notation paths to partially persist the state, `[]` means no state is persisted (defaults to `undefined` and persists the whole state).
- `overwrite: boolean` : Whether you want to ovewrite the initial state on hydration (defaults to `false` and [patches](https://pinia.esm.dev/api/interfaces/pinia._StoreWithState.html#patch) the state).


```ts
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => {
    return {
      someState: 'hello pinia',
      nested: {
        data: 'nested pinia',
      },
    }
  },
  persist: {
    key: 'storekey',
    storage: window.sessionStorage,
    paths: ['nested.data'],
    overwrite: true,
  }
})
```
The config above will only persist the `nested.data` property in `sessionStorage` under `storekey` and will overwrite the state on hydration.

## 🤝 Contributing

This project tries to bring `vuex-persistedstate`'s API to `Pinia` but I did not bring the whole API yet. 

Run into a problem? Open an [issue](https://github.com/prazdevs/pinia-plugin-persistedstate/issues/new/choose).  
Want to add some feature? PRs are welcome!

## 👤 About the author

Feel free to contact me:

- <a href="https://twitter.com/prazdevs"><img src="https://img.shields.io/twitter/follow/prazdevs?style=social" /></a>
- <img src="https://img.shields.io/badge/Discord-PraZ%234184-darkgrey?labelColor=7289DA&logo=discord&logoColor=white&style=flat" />

## 📝 Licence

Copyright © 2021 [Sacha Bouillez](https://github.com/prazdevs).<br />
This project is under [MIT](https://github.com/prazdevs/pinia-plugin-persistedstate/blob/main/LICENCE) license.
