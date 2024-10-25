# Advanced Usage

The plugin also exposes additional APIs for more advanced use cases.

## Global persistence options

Instead of using the default export when installing the plugin, you can use the exposed `createPersistedState` method to initialize the plugin with global options. These options become the new default options for all stores within the app.

```ts twoslash
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
- [`debug`](/guide/config#debug)

Any option passed to a store's `persist` configuration will override its counterpart declared in the global options.

> [!WARNING] USING NUXT ?
> Global options within the Nuxt module are handled as module options and differ from the standalone plugin global options. Read more in the [Nuxt module documentation](/frameworks/nuxt).

## Global key option

On top of other global persistence options, the `createPersistedState` factory function accepts one more option: `key`. The global `key` option accepts a function that gets passed the store key and should return a string to become the new store key.

```ts twoslash
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()

pinia.use(createPersistedState({
  key: id => `__persisted__${id}`,
}))
```

```ts twoslash
import { defineStore } from 'pinia'

defineStore('store', {
  state: () => ({ saved: '' }),
  persist: true,
})
```

In this example, the store will be persisted under `__persisted__store` key instead of `store`.

> [!WARNING] USING NUXT ?
> Global key within Nuxt is passed through module option as a string template instead of a function. Read more in the [Nuxt module documentation](/frameworks/nuxt).

## Multiple persistences per-store

There may be specific use cases where you need to persist data from a single store to different storages. The `persist` option also accepts an array of configurations.

```ts twoslash
import { defineStore } from 'pinia'

defineStore('store', {
  state: () => ({
    toLocal: '',
    toSession: '',
    toNowhere: '',
  }),
  persist: [
    {
      pick: ['toLocal'],
      storage: localStorage,
    },
    {
      pick: ['toSession'],
      storage: sessionStorage,
    },
  ],
})
```

In this example, the `toLocal` value will be persisted in `localStorage` while the `toSession` value will be persisted in `sessionStorage`. `toNowhere` will not be persisted.

:::warning
Be careful when not specifying a `paths` option or targeting the same path in two persistence configurations. This can lead to data inconsistency. During the rehydration process, persistences are processed in the same order they are declared.

```ts twoslash
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

## Forcing the hydration

In case you need to manually trigger hydration from storage, every store now exposes a `$hydrate` method. By default, calling this method will also trigger the `beforeHydrate` and `afterHydrate` hooks. You can avoid the hooks triggering by specifying the method not to.

Given this store:

```ts twoslash
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

store.$hydrate({ runHooks: false })
```

This will fetch data from the storage and replace the current state with it. In the example above, hooks will not be triggered.

> [!WARNING]
> In most cases, you should not need to manually hydrate the state. Make sure you know what you are doing, and the reason you are using `$hydrate` is not due to a bug (of either your implementation or the plugin itself).

## Forcing the persistence

In case you need to manually trigger persistence to storage, every store now exposes a `$persist` method.

Given this store:

```ts twoslash
import { defineStore } from 'pinia'

const useStore = defineStore('store', {
  state: () => ({
    someData: 'Hello Pinia'
  })
})
```

You can call `$persist`:

```ts
const store = useStore()

store.$persist()
```

This will force the store state to be persisted in configured storages.

> [!WARNING]
> In most cases, you should not need to manually persist the state. Make sure you know what you are doing, and the reason you are using `$persist` is not due to a bug (of either your implementation or the plugin itself).
