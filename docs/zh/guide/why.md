# 为什么使用这个插件？

这个插件诞生于 Pinia 的早期，在它正式取代 [VueX](https://vuex.vuejs.org/)之前。它最初的目标是为 Pinia 重现 [vuex-persistedstate](https://github.com/robinvdvleuten/vuex-persistedstate) 。

## 我需要一个插件来持久化我的stores吗？

简短的回答：“没有”。有很多解决方案可以将数据存储在`localStorage`中，例如甚至不需要向 Pinia 注入插件。下面是一个[VueUse](https://vueuse.org/)使用`useLocalStorage`的示例：

```ts
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

defineStore('store', () => {
  const someState = useLocalStorage('stored-state', 'initialValue')

  return { someState }
})
```

## 为什么我需要这个插件？

该插件 `pinia-plugin-persistedstate`旨在通过一致的 API 为每个人和每个项目提供对 Pinia store 的持久化。无论你是习惯使用默认值来保存一个完整的 store，还是需要具有多个 storage 和一个自定义序列化器的细粒度配置，该插件都能帮你搞定，所有这些都在您想要持久化的存储上的同一个`persist`选项中。

这个插件是积极维护的，为您带来更好的持久化stores的开发者体验。如果您有任何问题、遇到错误或想要提出新功能，非常欢迎您在 [GitHub 仓库](https://github.com/prazdevs/pinia-plugin-persistedstate) 中 [做出贡献](https://github.com/prazdevs/pinia-plugin-persistedstate/blob/main/CONTRIBUTING.md).
