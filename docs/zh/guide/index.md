# 快速开始

## 概述

本插件兼容 `pinia^2.0.0`，在使用之前请确保你已经 [安装 Pinia](https://pinia.vuejs.org/zh/getting-started.html)。 `pinia-plugin-persistedstate` 丰富的功能可以使 Pinia Store 的持久化更易配置：

-   与 [`vuex-persistedstate`](https://github.com/robinvdvleuten/vuex-persistedstate) 相似的 API
-   所有 Store 均可单独配置
-   自定义 storage 和数据序列化
-   持久化数据前后的 hook
-   每个 Store 具有丰富的配置
-   兼容 Vue 2 和 3
-   无任何外部依赖

## 安装

1. 用你喜欢的包管理器安装依赖：

    - pnpm:

    ```sh
    pnpm i pinia-plugin-persistedstate
    ```

    - npm:

    ```sh
    npm i pinia-plugin-persistedstate
    ```

    - yarn:

    ```sh
    yarn add pinia-plugin-persistedstate
    ```

2. 将插件添加到 pinia 实例上

```ts
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
```

## 用法

创建 Store 时，将 `persistent` 选项设置为 `true`。

_使用选项式 Store 语法：_

```ts
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => {
    return {
      someState: '你好 pinia',
    }
  },
  persist: true,
})
```

_或者使用组合式 Store 语法：_

```ts
import { defineStore } from 'pinia'

export const useStore = defineStore(
  'main',
  () => {
    const someState = ref('你好 pinia')
    return { someState }
  },
  {
    persist: true,
  }
)
```

现在，你的整个 Store 将使用[默认持久化配置](/zh/guide/config)保存。
