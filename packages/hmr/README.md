# `@pinia-plugin-persistedstate/hmr`

> Override for Pinia's `acceptHMRUpdate`

## 🚀 Quickstart

1. Install with your favorite package manager:
   - **pnpm** : `pnpm i -D @pinia-plugin-persistedstate/hmr`
   - npm : `npm i -D @pinia-plugin-persistedstate/hmr`
   - yarn : `yarn add -D @pinia-plugin-persistedstate/hmr`

2. Replace `acceptHMRUpdate` in your store definition file with:
```ts
import { defineStore } from 'pinia'
import { acceptHMRUpdateWithHydration } from '@pinia-plugin-persistedstate/hmr'

const useStore = defineStore('store', {
  // ...
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdateWithHydration(useStore, import.meta.hot))
```

## ⚠️ Warning

This is a copy/paste of Pinia's `acceptHMRUpdate` function that triggers `$hydrate` on HMR update. Use at your own risk. :)

## 📝 License

Copyright © 2022 [Sacha Bouillez](https://github.com/prazdevs).  
This project is under [MIT](https://github.com/prazdevs/pinia-plugin-persistedstate/blob/main/LICENSE) license.
