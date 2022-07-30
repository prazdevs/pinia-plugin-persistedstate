# What is this plugin ?

This plugin was born in the early days of Pinia, before it officially replaced [VueX](https://vuex.vuejs.org/). It aims to reproduce [vuex-persistedstate](https://github.com/robinvdvleuten/vuex-persistedstate) for Pinia. 

## Do I need a plugin to persist my stores ?

Short answer: 'no'. There are a lot of solutions to persist store data in storages such as `localStorage` that don't even involve injecting a plugin into Pinia. Here's the example with [VueUse](https://vueuse.org/)'s `useLocalStorage` :

```ts
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

defineStore('store', () => {
  const someState = useLocalStorage('stored-state', 'initialValue')

  return { someState }
})
```

## Why would I need this plugin ?

The `pinia-plugin-persistedstate` aims to provide persistence to Pinia stores for everyone and in every project with a consistent API. Whether you are fine with the defaults to save a complete store, or you need fine grain configuration with multiple storages and a custom serializer, the plugin got you covered, withing the same `persist` option on the store you want to persist.
