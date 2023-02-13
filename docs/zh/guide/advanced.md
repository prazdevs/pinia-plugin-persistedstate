# 进阶用法

该插件还为更高级的用法提供了额外的 API

## 全局持久化配置

在安装插件之后，你可以使用 `createPersistedState` 来初始化插件。这些配置将会成为项目内所有 Store 的默认选项。

> 这种方法有时被称为工厂函数。

```ts
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()

pinia.use(
  createPersistedState({
    storage: sessionStorage,
  })
)
```

上述例子中，每个声明 `persist: true` 的 Store 都会默认将数据持久化到 `sessionStorage` 中。

可用的全局配置包括：

-   [`storage`](/zh/guide/config#storage)
-   [`serializer`](/zh/guide/config#serializer)
-   [`beforeRestore`](/zh/guide/config#beforerestore)
-   [`afterRestore`](/zh/guide/config#afterrestore)

:::info 提示
传递给单个 Store 的 `persist` 配置的任何选项都将覆盖全局配置中声明的对应项。

:::

## 全局 key 配置

全局 `key` 配置接受传入 Store key 的函数，并返回一个新的 storage 密钥。

```ts
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()

pinia.use(
  createPersistedState({
    key: id => `__persisted__${id}`,
  })
)
```

```ts
import { defineStore } from 'pinia'

defineStore('store', {
  state: () => ({ saved: '' }),
  persist: true,
})
```

上述例子中，store 将保存在 `__persisted__store` key 下，而不是 `store` 下。

:::info 提示
当你需要在全局范围内对所有 Store key 添加前缀/后缀时，应考虑此选项。

:::

## 启用所有 Store 默认持久化

该配置将会使所有 Store 持久化存储，且必须配置 `persist: false` 显式禁用持久化。

```ts
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()

pinia.use(
  createPersistedState({
    auto: true,
  })
)
```

```ts
import { defineStore } from 'pinia'

defineStore('persisted', {
  state: () => ({ saved: '' }),
})
```

上述例子中，store 将使用默认配置（或者已有的全局配置）进行持久化存储。

:::tip 提示
当你使用该配置后，你可以单独为一个 Store 设置是否持久化：

```ts
import { defineStore } from 'pinia'

defineStore('not-persisted', {
  state: () => ({ saved: '' }),
  persist: false,
})
```

:::

## 每个 Store 可以有多个持久化配置

在某些特定的用例中，你需要将数据从单个 Store 持久化到不同的 storage 中。`persist` 选项还可以接受多个类似的配置。

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

上述例子中， `toLocal` 的值将保存在 `localStorage` 中，而 `toSession` 的值将保留在 `sessionStorage` 中，`toNowhere` 则不会持久化。

:::warning 警告

在两种持久化配置中，不指定 `paths` 选项或以同一路径为目标时要注意，因为这可能会导致恢复后的数据不一致。在恢复数据的过程中，持久化的处理顺序将与声明时的顺序相同。

```ts
import { defineStore } from 'pinia'

defineStore('store', {
  state: () => ({
    someData: '你好 Pinia',
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

在上述特定情况下，恢复数据后，从 `sessionStorage` 取回的数据将替换从 `localStorage` 取回的数据。

:::

## 强制恢复数据

每个 Store 都有 `$hydrate` 方法来手动触发数据恢复。默认情况下，调用此方法还将触发 `beforeRestore` 和 `afterRestore` 钩子。但是你可以通过配置方法来避免这两个钩子触发。

例如在下面 Store 中：

```ts
import { defineStore } from 'pinia'

const useStore = defineStore('store', {
  state: () => ({
    someData: '你好 Pinia',
  }),
})
```

你可以调用 `$hydrate` 方法：

```ts
const store = useStore()

store.$hydrate({ runHooks: false })
```

这将从 storage 中获取数据并用它替换当前的 state。并且在上面的示例中，钩子函数不会被触发。

:::warning 警告
在大多数情况下，你不需要手动恢复 state 。并且确保知道你使用 `$hydrate` 的原因不是因为 bug （无论是你的代码导致的还是插件本身原因）。

:::

## 强制持久化

每个 Store 都有 `$persist` 方法来手动触发持久化。

例如在下面 store 中：

```ts
import { defineStore } from 'pinia'

const useStore = defineStore('store', {
  state: () => ({
    someData: '你好 Pinia',
  }),
})
```

你可以调用 `$persist` 方法：

```ts
const store = useStore()

store.$persist()
```

这会强制将 Store state 保存在已配置的 storage 中。

:::warning 警告
在大多数情况下，你不需要手动保存 state 。并且确保知道你使用 `$persist` 的原因不是因为 bug （无论是你的代码导致的还是插件本身原因）。

:::
