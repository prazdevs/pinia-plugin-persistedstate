# Configuration

The plugin comes pre-configured with the following:

- [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) as storage.
- [`store.$id`](https://pinia.vuejs.org/api/interfaces/pinia.StoreProperties.html) as default key for storage.
- [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)/[`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) as serializer/deserializer.
- The whole state is persisted to the storage.

However, you can pass an object to the `persist` property of the store to configure the persistence.

```ts
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({
    someState: 'hello pinia',
  }),
  persist: {
    // CONFIG OPTIONS HERE
  },
})
```

## key

- **type**: `string`
- **default**: `store.$id`

Key used to reference the stored deserialized data in the storage.

:::details Example
```ts
import { defineStore } from 'pinia'

export const useStore = defineStore('store', {
  state: () => ({
    someState: 'hello pinia',
  }),
  persist: {
    key: 'my-custom-key',
  },
})
```

This store will be persisted under the `my-custom-key` key in `localStorage`.
:::

## storage

- **type**: [`StorageLike`](https://github.com/prazdevs/pinia-plugin-persistedstate/blob/main/packages/plugin/src/types.ts#L3)
- **default**: [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

Storage to persist the data to. Must have `getItem: (key: string) => string | null` and `setItem: (key: string, value: string) => void` methods.

:::details Example
```ts
import { defineStore } from 'pinia'

export const useStore = defineStore('store', {
  state: () => ({
    someState: 'hello pinia',
  }),
  persist: {
    storage: sessionStorage,
  },
})
```

This store will be persisted in [`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage).
:::

:::warning
Storage must be synchronous. More info in the [limitations page](/guide/limitations).
:::

## paths

- **type**: `string[]`
- **default**: `undefined`

Array of dot-notation paths to partially persist state. `[]` means no state is persisted and `undefined` or `null` means the whole state is persisted.

:::details Example
```ts
import { defineStore } from 'pinia'

export const useStore = defineStore('store', {
  state: () => ({
    save: {
      me: 'saved',
      notMe: 'not-saved',
    },
    saveMeToo: 'saved',
  }),
  persist: {
    paths: ['save.me', 'saveMeToo'],
  },
})
```

In this store, only `save.me` and `saveMeToo` values will be persisted. `save.notMe` will not be persisted.
:::


## serializer

- **type**: [`Serializer`](https://github.com/prazdevs/pinia-plugin-persistedstate/blob/main/packages/plugin/src/types.ts#L5)
- **default**: [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)/[`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)

Custom serializer to serialize data before persisted and deserialize data before rehydrating the store. Must have `serialize: (value: StateTree) => string` and `deserialize: (value: string) => StateTree` methods.

:::details Example
```ts
import { defineStore } from 'pinia'
import { parse, stringify } from 'zipson'

export const useStore = defineStore('store', {
  state: () => ({
    someState: 'hello pinia',
  }),
  persist: {
    serializer: {
      deserialize: parse,
      serialize: stringify
    }
  },
})
```

This store will use [`zipson`](https://jgranstrom.github.io/zipson/)'s `stringify`/`parse` to handle serialization/deserialization with added compression.
:::

## beforeRestore

- **type**: `(context: PiniaPluginContext) => void`
- **default**: `undefined`

Hook function run before restoring a persisted state. The hook gives access to the whole [`PiniaPluginContext`](https://pinia.vuejs.org/api/interfaces/pinia.PiniaPluginContext.html). This can be used to enforce specific actions before hydration.

:::details Example
```ts
import { defineStore } from 'pinia'

export const useStore = defineStore('store', {
  state: () => ({
    someState: 'hello pinia',
  }),
  persist: {
    beforeRestore: (ctx) => {
      console.log(`about to restore '${ctx.store.$id}'`)
    }
  },
})
```

This store will log `about to restore 'store'` _before_ being rehydrated.
:::

:::warning
Beware of interacting with `PiniaPluginContext`, unexpected behaviors may occur.
:::

## afterRestore

- **type**: `(context: PiniaPluginContext) => void`
- **default**: `undefined`

Hook function run after restoring a persisted state. The hook gives access to the whole [`PiniaPluginContext`](https://pinia.vuejs.org/api/interfaces/pinia.PiniaPluginContext.html). This can be used to enforce specific actions after hydration.

:::details Example
```ts
import { defineStore } from 'pinia'

export const useStore = defineStore('store', {
  state: () => ({
    someState: 'hello pinia',
  }),
  persist: {
    afterRestore: (ctx) => {
      console.log(`just restored '${ctx.store.$id}'`)
    }
  },
})
```

This store will log `just restored 'store'` _after_ being rehydrated.
:::

:::warning
Beware of interacting with `PiniaPluginContext`, unexpected behaviors may occur.
:::

## debug

- **type**: `boolean`
- **default**: `false`

When set to true, any error that may occur while persisting/hydrating stores will be logged as `console.error`.
