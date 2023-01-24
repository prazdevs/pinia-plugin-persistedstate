# 为什么你应该使用这个插件？

这个插件诞生于 Pinia 刚出现的时候。在 Pinia 正式取代 [VueX](https://vuex.vuejs.org/) 之前，它为 Pinia 创造出与 [vuex-persistedstate](https://github.com/robinvdvleuten/vuex-persistedstate) 有着类似功能的插件。

## 我需要一个插件来保存我的 Store 吗？

答案是"_不需要_"的。其实有很多方法可以持久化存储你的数据，例如保存在 `localStorage` 中，这甚至不需要向 Pinia 中注入插件。比如 [VueUse](https://vueuse.org/) 的 `useLocalStorage`：

```ts
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

defineStore('store', () => {
	const someState = useLocalStorage('stored-state', 'initialValue')

	return { someState }
})
```

## 那么你为什么需要这个插件？

`pinia-plugin-persistedstate` 旨在通过一致的 API 为每个人和每个项目中的 Pinia stores 提供持久化存储。如果你希望保存一个完整的 Store，或者需要细粒化配置多个 storage 和自定义序列化程序，该插件都为你提供了相应的功能，并且可以在你想要持久存储的 Store 上使用相同的配置。

我们会积极地维护该插件，为你带来在持久化存储 Store 上最好的开发体验。如果你有任何问题或者遇到任何 bug，又或者想要提出新的功能，我们非常欢迎你在 [GitHub 仓库](https://github.com/prazdevs/pinia-plugin-persistedstate)上[提出你的想法](https://github.com/prazdevs/pinia-plugin-persistedstate/blob/main/CONTRIBUTING.md)。
