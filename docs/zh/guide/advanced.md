# 进阶用法

该插件还为更高级的用例提供了额外的 API

## 全局持久化配置

在安装插件之后，你可以使用 `createPersistedState` 来使用全局配置初始化插件，而不是使用默认导出。这些配置将会成为应用程序内所有 store 的默认选项。

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

上述例子中，每个声明 `persist: true` 的 store 都会默认将数据持久化到 `sessionStorage` 中。

可用的全局配置包括：

-   [`storage`](/zh/guide/config#storage)
-   [`serializer`](/zh/guide/config#serializer)
-   [`beforeRestore`](/zh/guide/config#beforerestore)
-   [`afterRestore`](/zh/guide/config#afterrestore)

:::info 提示
传递给 store 的 `persist` 配置的任何选项都将覆盖全局配置中声明的对应项。

:::

## 全局 key 配置

在其他全局持久化配置之上，`createPersistedState` 工厂函数还有一个选项：`key`。全局 `key` 配置接受传入 store key 参数的函数，并返回一个新的 storage 密钥。

```ts
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()

pinia.use(
	createPersistedState({
		key: (id) => `__persisted__${id}`,
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
当你需要在全局范围内对所有 store key 添加前缀/后缀时，应考虑此选项。
:::

## 每个 store 可以有多个持久化配置

在某些特定的用例中，你需要将数据从单个 store 持久化到不同的存储中。`persist` 选项还可以接受一系列类似的配置。

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

上述例子中， `toLocal` 的值将保存在 `localStorage` 中，而 `toSession` 的值将保留在 `sessionStorage` 中，`toNowhere` 则不会持久化存储。

:::warning 警告

在两种持久化配置中，不指定 `paths` 选项或以同一路径为目标时要注意，因为这可能会导致数据不一致。在再水合的过程中，持久化的处理顺序将与声明时的顺序相同。

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

上述特定情况下，在水合时，从 `sessionStorage` 取回的数据将替换从 `localStorage` 取回的数据。

:::

## 强制再水合

每个 store 都有 `$hydrate` 方法来手动触发水合作用。默认情况下，调用此方法还将触发 `beforeRestore` 和 `afterRestore` 钩子。但是你可以通过定制方法来避免钩子触发。

例如在下面 store 中：

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
在大多数情况下，你不需要手动水合 state 。并且确保知道你使用 `$hydrate` 的原因不是因为 bug （无论是你的代码导致的还是插件本身原因）。

:::

## 强制持久化

每个 store 都有 `$persist` 方法来手动触发持久化存储。

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

这会强制将 store state 保存在已配置的 storage 中。

:::warning 警告
在大多数情况下，你不需要手动保存 state 。并且确保知道你使用 `$persist` 的原因不是因为 bug （无论是你的代码导致的还是插件本身原因）。

:::
