# Configuration

The plugin comes pre-configured with the following:

- [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) as storage.
- [`store.$id`](https://pinia.vuejs.org/api/interfaces/pinia.StoreProperties.html) as default key for storage.
- [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)/[`destr`](https://github.com/unjs/destr) as serializer/deserializer.
- The whole state is persisted to the storage.

> [!WARNING] USING NUXT ?
> Defaults are different with the Nuxt module to provide SSR-friendly experience. Head over to the [Nuxt usage documentation](/frameworks/nuxt) to learn more.

You can pass an object to the `persist` property of the store to configure the persistence.

::: code-group

```ts [setup syntax]
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStore = defineStore('main', () => {
  const someState = ref('hello pinia')
  return { someState }
}, {
  persist: {
    // CONFIG OPTIONS HERE
  }
})
```

```ts [option syntax]
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

:::

## key

- **type**: `string`
- **default**: `store.$id`

Key used to reference the stored deserialized data in the storage.

:::details Example

```ts{8} twoslash
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

- **type**: [`StorageLike`](https://github.com/prazdevs/pinia-plugin-persistedstate/blob/main/src/types.ts#L8)
- **default**: [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

Storage to persist the data to. Must have `getItem: (key: string) => string | null` and `setItem: (key: string, value: string) => void` methods.

:::details Example

```ts{8} twoslash
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

> [!WARNING]
> Storage must be synchronous. More info in the [limitations page](/guide/limitations.html#storage-must-be-synchronous).

## serializer

- **type**: [`Serializer`](https://github.com/prazdevs/pinia-plugin-persistedstate/blob/main/src/types.ts#L23)
- **default**: [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)/[`destr`](https://github.com/unjs/destr)

Custom serializer to serialize data before persisted and deserialize data before rehydrating the store. Must have `serialize: (value: StateTree) => string` and `deserialize: (value: string) => StateTree` methods.

:::details Example

```ts{9-11}
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

## pick

- **type**: `string[] | Path<StateTree>[]`
- **default**: `undefined`

Array of dot-notation paths to pick what should be persisted. `[]` means no state is persisted and `undefined` means the whole state is persisted.

:::details Example

```ts{12} twoslash
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
    pick: ['save.me', 'saveMeToo'],
  },
})
```

In this store, only `save.me` and `saveMeToo` values will be persisted. `save.notMe` will not be persisted.
:::

> [!TIP]
> Auto-completion from state-infered type can help you with what paths can be picked.

## omit

- **type**: `string[] | Path<StateTree>[]`
- **default**: `undefined`

Array of dot-notation paths to omit from what should be persisted. `[]` or `undefined` means the whole state persisted (nothing is omitted).

:::details Example

```ts{12} twoslash
import { defineStore } from 'pinia'

export const useStore = defineStore('store', {
  state: () => ({
    ignore: {
      me: 'not-saved',
      notMe: 'saved',
    },
    ignoreMeToo: 'not-saved',
  }),
  persist: {
    omit: ['ignore.me', 'ignoreMeToo'],
  },
})
```

In this store, only `ignore.notMe` value will be persisted. `ignore.me` and `ignoreMeToo` will not be persisted.
:::

> [!TIP]
> Auto-completion from state-infered type can help you with what paths can be omitted.

## beforeHydrate

- **type**: `(context: PiniaPluginContext) => void`
- **default**: `undefined`

Hook function run before hydrating a store state with persisted data. The hook gives access to the whole [`PiniaPluginContext`](https://pinia.vuejs.org/api/pinia/interfaces/PiniaPluginContext.html). This can be used to enforce specific actions before hydration.

:::details Example

```ts{8-9} twoslash
import { defineStore } from 'pinia'

export const useStore = defineStore('store', {
  state: () => ({
    someState: 'hello pinia',
  }),
  persist: {
    beforeHydrate: (ctx) => {
      console.log(`about to hydrate '${ctx.store.$id}'`)
    }
  },
})
```

This store will log `about to hydrate 'store'` _before_ being rehydrated.
:::

> [!WARNING]
> Beware of interacting with `PiniaPluginContext`, unexpected behaviors may occur.

## afterHydrate

- **type**: `(context: PiniaPluginContext) => void`
- **default**: `undefined`

Hook function run after rehydrating a persisted state. The hook gives access to the whole [`PiniaPluginContext`](https://pinia.vuejs.org/api/interfaces/pinia.PiniaPluginContext.html). This can be used to enforce specific actions after hydration.

:::details Example

```ts{8-9} twoslash
import { defineStore } from 'pinia'

export const useStore = defineStore('store', {
  state: () => ({
    someState: 'hello pinia',
  }),
  persist: {
    afterHydrate: (ctx) => {
      console.log(`just hydrated '${ctx.store.$id}'`)
    }
  },
})
```

This store will log `just hydrated 'store'` _after_ being rehydrated.
:::

> [!WARNING]
> Beware of interacting with `PiniaPluginContext`, unexpected behaviors may occur.

## debug

- **type**: `boolean`
- **default**: `false`

When set to true, any error that may occur while persisting/hydrating stores will be logged with `console.error`.

> [!WARNING]
> No environment check is done: if this is enabled, errors will also be logged in production.
