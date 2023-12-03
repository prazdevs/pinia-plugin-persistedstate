# 配置

该插件的默认配置如下:

-   使用 [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) 进行存储
-   [`store.$id`](https://pinia.vuejs.org/api/interfaces/pinia.StoreProperties.html) 作为 storage 默认的 key
-   使用 [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)/[`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) 进行序列化/反序列化
-   整个 state 默认将被持久化

如何你不想使用默认的配置，那么你可以将一个对象传递给 Store 的 `persist` 属性来配置持久化。

```ts
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({
    someState: '你好 pinia',
  }),
  persist: {
    // 在这里进行自定义配置
  },
})
```

## key

-   **类型**：`string`
-   **默认值**：`store.$id`

Key 用于引用 storage 中的数据

:::details 例如

```ts
import { defineStore } from 'pinia'

export const useStore = defineStore('store', {
  state: () => ({
    someState: '你好 pinia',
  }),
  persist: {
    key: 'my-custom-key',
  },
})
```

这个 Store 将被持久化存储在 `localStorage` 中的 `my-custom-key` key 中。
:::

## storage

-   **类型**：[`StorageLike`](https://github.com/prazdevs/pinia-plugin-persistedstate/blob/main/packages/plugin/src/types.ts#L3)
-   **默认值**：[`localStorage`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage)

将数据持久化到 storage 中，必须具有 `getItem: (key: string) => string | null` 和 `setItem: (key: string, value: string) => void` 两个方法。

:::details 例如

```ts
import { defineStore } from 'pinia'

export const useStore = defineStore('store', {
  state: () => ({
    someState: '你好 pinia',
  }),
  persist: {
    storage: sessionStorage,
  },
})
```

这个 store 将被持久化存储在 [`sessionStorage`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/sessionStorage)中。

:::

:::warning 警告
存储数据必须是同步的，更多信息前往[局限性页面](/zh/guide/limitations)查看。
:::

## paths

-   **类型**：`string[]`
-   **默认值**：`undefined`

用于指定 state 中哪些数据需要被持久化。`[]` 表示不持久化任何状态，`undefined` 或 `null` 表示持久化整个 state。

:::details 例如

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

该 store 中, 只有 `save.me` 和 `saveMeToo` 被持久化，而 `save.notMe` 不会被持久化。
:::

## serializer

-   **类型**：[`Serializer`](https://github.com/prazdevs/pinia-plugin-persistedstate/blob/main/packages/plugin/src/types.ts#L5)
-   **默认值**：[`JSON.stringify`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)/[`JSON.parse`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)

该配置能够指定持久化时所使用的序列化方法，以及恢复 Store 时的反序列化方法。另外，必须具有 `serialize: (value: StateTree) => string` 和 `deserialize: (value: string) => StateTree` 方法。

:::details 例如

```ts
import { defineStore } from 'pinia'
import { parse, stringify } from 'zipson'

export const useStore = defineStore('store', {
  state: () => ({
    someState: '你好 pinia',
  }),
  persist: {
    serializer: {
      deserialize: parse,
      serialize: stringify,
    },
  },
})
```

该 store 将使用 [`zipson`](https://jgranstrom.github.io/zipson/) 的 `stringify`/`parse` 处理序列化/反序列化，并进行压缩。

:::

## beforeRestore

-   **类型**：`(context: PiniaPluginContext) => void`
-   **默认值**：`undefined`

该 hook 将在从 storage 中恢复数据之前触发，并且它可以访问整个 [`PiniaPluginContext`](https://pinia.vuejs.org/api/interfaces/pinia.PiniaPluginContext.html)，这可用于在恢复数据之前强制地执行特定的操作。

:::details 例如

```ts
import { defineStore } from 'pinia'

export const useStore = defineStore('store', {
  state: () => ({
    someState: '你好 pinia',
  }),
  persist: {
    beforeRestore: (ctx) => {
      console.log(`即将恢复 '${ctx.store.$id}'`)
    },
  },
})
```

该 Store 将会在恢复数据*之前*输出 `即将恢复 'store'`
:::

:::warning 警告
请谨慎使用 `PiniaPluginContext`，意外可能会出现。

:::

## afterRestore

-   **类型**：`(context: PiniaPluginContext) => void`
-   **默认值**：`undefined`

该 hook 将在从 storage 中恢复数据之后触发，并且它可以访问整个 [`PiniaPluginContext`](https://pinia.vuejs.org/api/interfaces/pinia.PiniaPluginContext.html)，这可用于在恢复数据之后强制地执行特定的操作。

:::details 例如

```ts
import { defineStore } from 'pinia'

export const useStore = defineStore('store', {
  state: () => ({
    someState: '你好 pinia',
  }),
  persist: {
    afterRestore: (ctx) => {
      console.log(`刚刚恢复完 '${ctx.store.$id}'`)
    },
  },
})
```

该 Store 将会在恢复数据*之后*输出 `刚刚恢复完 'store'`
:::

:::warning 警告
请谨慎使用 `PiniaPluginContext`，意外可能会出现。

:::

## debug

-   **类型**：`boolean`
-   **默认值**：`false`

当设置为 true 时，持久化/恢复 Store 时可能发生的任何错误都将使用 `console.error` 输出。
