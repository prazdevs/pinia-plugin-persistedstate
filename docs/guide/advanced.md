# Advanced Usage

The plugin also exposes additional APIs for more advanced use cases.

## Global persistence options

Instead of using the default export when isntalling the plugin, you can use the exposed `createPersistedState` method to initialize the plugin with global options. These options become the new default options for all stores within the app.

> This method is sometimes referred to as factory function.

```ts
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()

pinia.use(createPersistedState({
  storage: sessionStorage,
}))
```

In this example, every store declaring `persist: true` will by default persist data to `sessionStorage`.

Available global options include:
- [`storage`](/guide/config#storage)
- [`serializer`](/guide/config#serializer)
- [`beforeRestore`](/guide/config#beforeRestore)
- [`afterRestore`](/guide/config#afterRestore)

:::info
Any option passed to a store's `persist` configuration will override its counterpart declared in the global options.
:::

## Multiple persistences per-store

There may be specific use cases where you need to persist data from a single store to different storages. The `persist` option also accepts an array of configurations.

```ts
defineStore('store', {
  state: () => ({
    toLocal: '',
    toSession: '',
    toNowhere: '',
  }),
  persist: [
    {
      paths: ['toLocal'],
      storage: localStorage,
    },
    {
      paths: ['toSession'],
      storage: sessionStorage,
    },
  ],
})
```

In this example, the `toLocal` value will be persisted in `localStorage` while the `toSession` value will be persisted in `sessionStorage`. `toNowhere` will not be persisted.

:::warning
Be careful when not specifying a `paths` option or targetting a same path in two persistence configurations. This can lead to data inconsistency. During the rehydration process, persistences are processed in the same order they are decalred.

```ts
defineStore('store', {
  state: () => ({
    someData: 'Hello Pinia'
  }),
  persist: [
    {
      storage: localStorage,
    },
    {
      storage: sessionStorage,
    },
  ],
})
```

In this specific case, on hydration, the data retrieved from `sessionStorage` will replace the data retrieved from `localStorage`.
:::

## Forcing the rehydration

