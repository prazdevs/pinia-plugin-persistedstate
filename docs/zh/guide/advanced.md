# 高级用法

该插件还为更高级的用例公开了其他 API。

## 全局持久性选项

安装插件时，您可以使用公开的 `createPersistedState` 方法来初始化带有全局选项的插件，而不是使用默认导出。这些选项成为应用程序中所有商店的新默认选项。

```ts twoslash
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()

pinia.use(createPersistedState({
  storage: sessionStorage,
}))
```

在此示例中，每个声明 `persist: true` 的存储将默认地将数据保存到 `sessionStorage` 中。

可用的全局选项包括：
- [`storage`](/guide/config#storage)
- [`serializer`](/guide/config#serializer)
- [`debug`](/guide/config#debug)

传递给存储的 `persist` 配置的任何选项都将覆盖在全局选项中声明的对应选项。

> [!WARNING] 使用 NUXT ？
> Nuxt 模块中的全局选项作为模块选项处理，与独立的插件全局选项不同。在 [Nuxt 模块文档 ](/frameworks/nuxt)中阅读更多内容。 

## 全局密钥选项

除了其他全局持久性选项之外，`createPersistedState` 函数还接受一个选项: `key`。全局 `key` 选项接受传递给存储键的函数，并且应该返回一个字符串，以成为新的存储key。

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

在此示例中，存储将在 `__persisted__store` 下而不是在 `store` 下持久化。

> [!WARNING] 使用 NUXT ？
> Nuxt 中的全局key通过 module 项作为字符串模板而不是函数传递。在 [Nuxt 模块文档 ](/frameworks/nuxt)中阅读更多内容。

## 存储的多个持久性

可能存在需要将数据从一个存储持久化到不同存储的特定用例。 `persist` 选项也接受数组配置。

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

在本例中, `toLocal` 值将保存在 `localStorage` 中，而 `toSession` 值将保存在 `sessionStorage` 中。`toNowhere` 将不会持续。

:::warning
当不指定 `paths` 选项或在两个持久性配置中以同一路径为目标时要小心。这可能导致数据不一致。在rehydration过程中，持久性的处理顺序与声明的顺序相同。

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

在这种特定情况下，在水合时，从 `sessionStorage` 检索的数据将替换从 `localStorage` 检索的数据。
:::

## 强制 hydration

如果您需要从存储中手动触发hydration作用，现在每个存储都公开了一个 `$hydrate` 方法。默认情况下，调用此方法还会触发 `beforeHydrate` 和 `afterHydrate` 钩子。您可以通过指定方法来避免钩子触发。

借鉴此 store:

```ts twoslash
import { defineStore } from 'pinia'

const useStore = defineStore('store', {
  state: () => ({
    someData: 'Hello Pinia'
  })
})
```

您可以访问 `$hydrate`:

```ts
const store = useStore()

store.$hydrate({ runHooks: false })
```

这将从存储中获取数据并用它替换当前状态。在上面的例子中，钩子不会被触发。

> [!WARNING]
> 在大多数情况下，您应该不需要手动合并状态。确保你知道你在做什么，并且你使用 `$hydrate` 的原因不是由于一个错误(无论是你的实现还是插件本身)。

## Forcing the persistence

如果您需要手动触发存储的持久性，现在每个存储都公开了一个 `$persist` 方法。

借鉴此 store:

```ts twoslash
import { defineStore } from 'pinia'

const useStore = defineStore('store', {
  state: () => ({
    someData: 'Hello Pinia'
  })
})
```

您可以访问 `$persist`:

```ts
const store = useStore()

store.$persist()
```

这将强制将存储状态保留在配置的存储中。

> [!WARNING]
> 在大多数情况下，您应该不需要手动合并状态。确保你知道你在做什么，并且你使用 `$persist` 的原因不是由于一个错误(无论是你的实现还是插件本身)。
