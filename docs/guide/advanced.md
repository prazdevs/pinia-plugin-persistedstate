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
import { defineStore } from 'pinia'

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
import { defineStore } from 'pinia'

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

## Manually persist state

In case you need to manually persist the data in the storage, you can access the method in the `$persist` object available in the store as `$persist.updateStorage`.

```ts
import { defineStore } from 'pinia'

defineStore('store', {
  state: () => ({
    someData: 'Hello Pinia'
  }),
  action: {
    updateSomeData( newValue ) {
      this.someData = newValue;

      this.$persist.updateStorage();
    }
  },
  persist: {
    updationTriggers: []
  },
})
```

When there are multiple persistences then you will need to pass the index of the persistence you want to update.

## Forcing the rehydration

In case you need to manually trigger hydration from storage, every store now exposes a `hydrate` method in the `$persist` object. By default, calling this method will also trigger the `beforeRestore` and `afterRestore` hooks. You can avoid the hooks triggering by specifying the method not to.

When there are multiple persistences then you will need to pass the index of the persistence you want to update. if `-1` is passed then the store will be hydrated from all persistences.

Given this store:

```ts
import { defineStore } from 'pinia'

const useStore = defineStore('store', {
  state: () => ({
    someData: 'Hello Pinia'
  })
})
```

You can call `$hydrate`:

```ts
const store = useStore()

store.$persist.hydrate(-1, { runHooks: false })
```

This will fetch data from the storage and replace the current state with it. In the example above, hooks will not be triggered.

:::warning
In most cases, you should not need to manually hydrate the state. Make sure you know what you are doing, and the reason you are using `$hydrate` is not due to a bug (of either your implementation or the plugin itself).
:::
