# 配置

该插件预配置了以下内容：

- [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) 作为存储。
- [`store.$id`](https://pinia.vuejs.org/api/interfaces/pinia.StoreProperties.html) 作为存储的默认 key。
- [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)/[`destr`](https://github.com/unjs/destr) 作为序列化器/反序列化器。
- 整个状态将持久化到存储中。

> [!WARNING] 使用 NUXT ？
> 默认值与 Nuxt 模块不同，以提供 SSR 友好的体验。前往 [Nuxt 使用文档](/frameworks/nuxt)了解更多信息。

您可以向存储的`persist`属性传递一个对象来配置持久性。

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

- **类型**: `string`
- **默认值**: `store.$id`

用于引用存储中存储的反序列化数据的 Key。

:::details 例子

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

此存储将在`localStorage`中的`my-custom-key`项下持久化。
:::

## storage

- **类型**: [`StorageLike`](https://github.com/prazdevs/pinia-plugin-persistedstate/blob/main/src/types.ts#L8)
- **默认值**: [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

将数据保存到 Storage 中。 必须有 `getItem: (key: string) => string | null` 和 `setItem: (key: string, value: string) => void` 方法。

:::details 例子

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

此存储将保留在 [`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)中。
:::

> [!WARNING] 警告
> 存储必须是同步的。更多信息请见 [限制页面](/guide/limitations.html#storage-must-be-synchronous)。

## serializer

- **类型**: [`Serializer`](https://github.com/prazdevs/pinia-plugin-persistedstate/blob/main/src/types.ts#L23)
- **默认值**: [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)/[`destr`](https://github.com/unjs/destr)

自定义序列化程序，用于在持久化之前序列化数据，并在解除冻结存储之前反序列化数据。 必须有 `serialize: (value: StateTree) => string` 和 `deserialize: (value: string) => StateTree` 方法。

:::details 例子

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

此存储将使用 [`zipson`](https://jgranstrom.github.io/zipson/)的 `stringify`/`parse` 来处理序列化/反序列化，并添加了压缩。
:::

## pick

- **类型**: `string[] | Path<StateTree>[]`
- **默认值**: `undefined`

用于选择应持久化的内容的点表示法路径数组 `[]` 表示不持久化任何状态， `undefined` 表示持久化整个状态。

:::details 例子

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

在此存储中，将保留 `save.me` 和 `saveMeToo` 。 `save.notMe` 不会持久化。
:::

> [!TIP] 提示
> 状态推断类型的自动补全可以帮助您选择哪些路径。

## omit

- **类型**: `string[] | Path<StateTree>[]`
- **默认值**: `undefined`

要从应持久化的内容中省略的点表示法路径数组。 `[]` 或 `undefined` 表示整个状态持续存在（不遗漏任何内容）。

:::details 例子

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

在这个存储中，只有 `ignore.notMe` 值将被持久化。`ignore.me` 和 `ignoreMeToo` 不会被保留。
:::

> [!TIP] 提示
> 状态推断类型的自动补全可以帮助您确定可以省略哪些路径。

## beforeHydrate

- **类型**: `(context: PiniaPluginContext) => void`
- **默认值**: `undefined`

钩子函数在用持久化数据激活 store state 之前运行。这个钩子可以访问整个 [`PiniaPluginContext`](https://pinia.vuejs.org/api/pinia/interfaces/PiniaPluginContext.html)。 这可以用来在hydration作用之前执行特定的操作。

:::details 例子

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

此存储将在rehydrated `about to hydrate 'store'` _之前_ 进行记录。
:::

> [!WARNING] 警告
> 当心与 `PiniaPluginContext` 交互，可能会发生意外行为。

## afterHydrate

- **类型**: `(context: PiniaPluginContext) => void`
- **默认值**: `undefined`

钩子函数在用持久化数据激活 store state 之后运行。这个钩子可以访问整个 [`PiniaPluginContext`](https://pinia.vuejs.org/api/pinia/interfaces/PiniaPluginContext.html)。 这可以用来在hydration作用之后执行特定的操作。

:::details 例子

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

此存储将在rehydrated `about to hydrate 'store'` _之前_ 进行记录。
:::

> [!WARNING] 警告
> 当心与 `PiniaPluginContext` 交互，可能会发生意外行为。

## debug

- **类型**: `boolean`
- **默认值**: `false`

如果设置为 true，则在 persisting/hydrating stores 时可能发生的任何错误都将记录为 `console.error`。

> [!WARNING] 警告
> 不进行环境检查： 如果启用此选项，生产中也会记录错误。
