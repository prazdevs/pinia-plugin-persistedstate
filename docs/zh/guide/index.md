# 开始

## 概述

此插件与 `pinia>=2.0.0` 兼容， 请确保在继续之前 [已安装 Pinia](https://pinia.vuejs.org/getting-started.html) 。 `pinia-plugin-persistedstate` 具有许多功能，使 Pinia store 的持久化变得轻松且可配置：

- 一个类似于 [`vuex-persistedstate`](https://github.com/robinvdvleuten/vuex-persistedstate)的 API。
- Per-store 配置.
- 自定义存储和自定义数据序列化程序。
- Pre/post persistence/hydration hooks.
- 每个store有多个配置。

> [!TIP] 使用 NUXT ？
> 此包导出一个模块，以便更好地与 Nuxt 集成和开箱即用的 SSR 支持。在其[文档](/frameworks/nuxt)中了解更多信息。

## 安装

1. 用您喜欢的软件包管理器安装依赖项：
   ::: code-group

```sh [pnpm]
pnpm add pinia-plugin-persistedstate
```

```sh [npm]
npm i pinia-plugin-persistedstate
```

```sh [yarn]
yarn add pinia-plugin-persistedstate
```

:::

2. 将插件添加到你的 pinia 实例中：

```ts
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
```

## 用法

在声明您的store时，请将新`persist`选项设置为 `true`。

::: code-group

```ts{11} [setup syntax]
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStore = defineStore(
  'main',
  () => {
    const someState = ref('hello pinia')
    return { someState }
  },
  {
    persist: true,
  },
)
```

```ts{9} [option syntax]
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => {
    return {
      someState: 'hello pinia',
    }
  },
  persist: true,
})
```

:::

您的整个 store 现在将使用 [默认的持久性设置](/guide/config)进行保存。
