# 快速开始

## 概述

本插件兼容 `pinia^2.0.0`，在使用之前请确保你已经 [安装 Pinia](https://pinia.vuejs.org/zh/getting-started.html)。 `pinia-plugin-persistedstate` 具有的众多功能可以使 Pinia Store 的持久化更易配置：

-   与 [`vuex-persistedstate`](https://github.com/robinvdvleuten/vuex-persistedstate)相似的 API
-   所有 Store 均可单独配置
-   自定义存储和自定义数据序列化
-   数据充入前后的钩子函数
-   Store 配置丰富
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

声明 Store 时，将 `persistent` 选项设置为 `true`。

_使用 option store 语法：_

```ts
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

_或者使用 setup store 语法：_

```ts
import { defineStore } from 'pinia'

export const useStore = defineStore(
	'main',
	() => {
		const someState = ref('hello pinia')
		return { someState }
	},
	{
		persist: true,
	}
)
```

现在，你的整个 storage 将使用[默认持久化配置](/zh/guide/config)保存。
