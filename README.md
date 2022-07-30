<p align="center">
  <img alt="" src="https://i.imgur.com/prUNzrf.png">
</p>

<p align="center">
  <i>Artwork from <a href="https://pinia.vuejs.org/">Pinia</a></i>
</p>

<h1 align="center">pinia-plugin-persistedstate</h1>
<p align="center">Configurable persistence and rehydration of Pinia stores.</p>

<p align="center">
  <a href="https://www.npmjs.com/package/pinia-plugin-persistedstate"><img alt="npm" src="https://img.shields.io/github/package-json/v/prazdevs/pinia-plugin-persistedstate?style=flat&color=orange" /></a>
  <a href="https://github.com/prazdevs/pinia-plugin-persistedstate/actions/workflows/push.yml"><img alt="CI" src="https://img.shields.io/github/workflow/status/prazdevs/pinia-plugin-persistedstate/Build,%20lint%20and%20test?label=ci&logo=github"></a>
<a href="https://app.codecov.io/gh/prazdevs/pinia-plugin-persistedstate"><img alt="Coverage" src="https://img.shields.io/codecov/c/github/prazdevs/pinia-plugin-persistedstate?logo=Codecov&logoColor=white&token=BYLAJJOOLS"></a>
  <a href="https://codeclimate.com/github/prazdevs/pinia-plugin-persistedstate/maintainability"><img src="https://img.shields.io/codeclimate/maintainability/prazdevs/pinia-plugin-persistedstate?logo=codeclimate" alt="Maintainability" /></a>
  <a href="https://github.com/prazdevs/pinia-plugin-persistedstate/tree/HEAD/LICENSE"><img alt="License" src="https://img.shields.io/github/license/prazdevs/pinia-plugin-persistedstate?style=flat&color=blue" /></a>
</p>


<p align="center">
  <a href="https://prazdevs.github.io/pinia-plugin-persistedstate/" alt="pinia-plugin-persistedstate docs" >
    <img src="https://img.shields.io/badge/PINIA--PLUGIN--PERSISTEDSTATE-READ%20THE%20DOCS%20-blueviolet?style=for-the-badge&logo=read-the-docs&logoColor=white" />
  </a>
</p>

## ✨ Features

- Persist Pinia stores with the same API as [`vuex-persistedstate`](https://github.com/robinvdvleuten/vuex-persistedstate) (and more).
- Configurable per Pinia store.
- Still compatible with Vue 2 and 3.
- No external dependencies.
- Supports a custom serializer for advanced needs.
- Super small (<1kB).

## ⚙️ Installing

1. Install with your favorite package manager:

   - **pnpm** : `pnpm i pinia-plugin-persistedstate`
   - npm : `npm i pinia-plugin-persistedstate`
   - yarn : `yarn add pinia-plugin-persistedstate`

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

//* using option store syntax
export const useStore = defineStore('main', {
  state: () => {
    return {
      someState: 'hello pinia',
    }
  },
  persist: true,
})

//* or using setup store syntax
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

In case you want to configure how the data should be persisted, `persist` can take options:

- `key: string` : Key to use in storage (defaults to the current store id).
- `storage` : Storage like object to persist state to. Must have `getItem` and `setItem` methods (defaults to `localStorage`).
- `paths: Array<string>` : Array of dot-notation paths to partially persist the state, `[]` means no state is persisted (defaults to `undefined` and persists the whole state).
- `beforeRestore: (context) => void` : Hook executed (if set) _before_ restoring the state from local storage.
- `afterRestore: (context) => void` : Hook executed (if set) _after_ restoring the state from local storage.

> The context passed to the hooks is the `PiniaPluginContext`. It exposes properties such as the current store. More infos [here](https://pinia.vuejs.org/core-concepts/plugins.html#introduction).

- `serializer: { serialize, deserialize }` : Custom serializer/deserializer :
  - `serialize: (state) => string` : Function to serialize the state before storing (defaults to `JSON.stringify`).
  - `deserialize: (string) => state` : Function to deserialize the stored stated before rehydrating (defaults to `JSON.parse`).

> The state used in `serialize` and `deserialize` is the generic state of the current store. More infos [here](https://pinia.vuejs.org/api/modules/pinia.html#statetree).

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
    key: 'store-key',
    storage: window.sessionStorage,
    paths: ['nested.data'],
    beforeRestore: context => {
      console.log('Before hydration...')
    },
    afterRestore: context => {
      console.log('After hydration...')
    },
  },
})
```

The config above will only persist the `nested.data` property in `sessionStorage` under `store-key`.

It will also execute the `beforeRestore` and `afterRestore` hooks respectively _before_ and _after_ hydration.

In case you want to restore state manually, you can use `$restoreManually` method

### Usage with Nuxt

Declare a [Nuxt Plugin](https://v3.nuxtjs.org/docs/directory-structure/plugins) to add the plugin to Pinia.

```ts
import { createNuxtPersistedState } from 'pinia-plugin-persistedstate'
import { defineNuxtPlugin, useCookie } from '#app'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.$pinia.use(createNuxtPersistedState(useCookie))
})
```

The plugin will use Nuxt's [`Cookies`](https://v3.nuxtjs.org/docs/usage/cookies/) and `useCookie` to define a `storage` to persist your stores with SSR.

```ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('ssr', {
  persist: true
})
```

> Warning: when using `createNuxtPersistedState`, overriding the `storage` option in the store definition will break server-side persistance/rehydration with `Cookies`.

## 🔧 Factory function configuration

Need to override default options? You can import and use `createPersistedState(options)`:

```ts
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(createPersistedState({
  storage: sessionStorage,
  beforeRestore: () => {},
  afterRestore: () => {},
  serializer: {
    serialize: JSON.stringify,
    deserialize: JSON.parse,
  }
}))
```

The options passed will be used in any store declaring `persist: true`. You can still override these defaults with per-store options.

You can also override default options in Nuxt with `createNuxtPersistedState(useCookie, options)`.

## ⚠️ Limitations

### **References do not persist**

Beware of the following:

```js
const a = {
  1: 'one',
  2: 'two',
  ...
}
const b = a

// Before hydration 'a' and 'b'
// point to the same object:
a === b -> true

// After hydration (page reload)
// 'a' and 'b' are different objects
// with the same content:
a === b -> false
```

As a consequence, reactivity between `a` and `b` is lost.

To get around this you can exclude either `a` or `b` from persisting and use the `afterRestore` hook to populate them after hydration. That way `a` and `b` have the same reference again and reactivity is restored after page reload.

### **Non primitive types are not persisted**

Due to serialization (`JSON.stringify`/`JSON.parse`) needed to persist in storage, non primitive typed data such as `Date` are no rehydrated as `Date` but as `string` instead.

To get around this you can use the `afterRestore` hook to reformat the data as needed.

### **Storage must be synchronous**

When providing a `storage` option, all methods (`getItem`, `setItem`) must be synchronous. This is due to Pinia's state subscription (`$subscribe`) being synchronous (like mutations).

If you want to add asynchronous behavior (such as async storages), you can try [subscribing to actions (`$onAction`)](https://pinia.vuejs.org/core-concepts/actions.html#subscribing-to-actions). Actions are made for asynchronous tasks and provide proper error handling.

## 🤝 Contributing

This project tries to bring `vuex-persistedstate`'s API to `Pinia` but I did not bring the whole API yet.

Run into a problem? Open an [issue](https://github.com/prazdevs/pinia-plugin-persistedstate/issues/new/choose).
Want to add some feature? PRs are welcome!

## 👤 About the author

Feel free to contact me:

- [![twitter: @prazdevs](https://img.shields.io/twitter/follow/prazdevs?style=social)](https://twitter.com/prazdevs)
- ![discord: PraZ#4184"](https://img.shields.io/badge/Discord-PraZ%234184-darkgrey?labelColor=7289DA&logo=discord&logoColor=white&style=flat)

## 📝 License

Copyright © 2022 [Sacha Bouillez](https://github.com/prazdevs).  
This project is under [MIT](https://github.com/prazdevs/pinia-plugin-persistedstate/blob/main/LICENCE) license.
