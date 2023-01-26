# 在 Nuxt 3 中使用

我们提供的专用模块使得在 Nuxt 中持久化 Pinia Store 变得更加容易。

## 安装

1. 使用你喜欢的包管理器安装依赖：

    - pnpm:

    ```sh
    pnpm i -D @pinia-plugin-persistedstate/nuxt
    ```

    - npm:

    ```sh
    npm i -D @pinia-plugin-persistedstate/nuxt
    ```

    - yarn:

    ```sh
    yarn add -D @pinia-plugin-persistedstate/nuxt
    ```

2. 将模块添加到 Nuxt 配置中 (`nuxt.config.ts`)：

```ts
export default defineNuxtConfig({
	modules: ['@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt'],
})
```

## 用法

创建 Store 时，将 `persist` 选项设置为 `true`。

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

## 选择 storage

默认情况下，你的 Store 将被保存在 cookie 中（在底层使用 Nuxt 的 [`useCookie`](https://nuxt.com/docs/api/composables/use-cookie)）。你可以通过使用自动导入的 `persistedState` 变量下的可用 storage 来配置你想要使用的 storage。

:::info 提示
使用 `persistedState` 所提供的 storage 以外的其他 storage 可能会导致意外。

:::

### `localStorage`

```ts
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
	state: () => {
		return {
			someState: '你好 pinia',
		}
	},
	persist: {
		storage: persistedState.localStorage,
	},
})
```

:::warning 警告
`localStorage` 仅限客户端。
:::

### `sessionStorage`

```ts
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
	state: () => {
		return {
			someState: '你好 pinia',
		}
	},
	persist: {
		storage: persistedState.sessionStorage,
	},
})
```

:::warning 警告
`sessionStorage` 仅限客户端。
:::

### `cookiesWithOptions`

```ts
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
	state: () => {
		return {
			someState: '你好 pinia',
		}
	},
	persist: {
		storage: persistedState.cookiesWithOptions({
			sameSite: 'strict',
		}),
	},
})
```

:::tip 提示
使用 `cookiesWithOptions()` 允许你[配置 cookies](https://nuxt.com/docs/api/composables/use-cookie#options)。不传递任何选项将默认与使用 `cookies` 相同。

:::

## 全局配置

该模块接受在 `piniaPersistedstate` 下定义在 `nuxt.config.ts` 中的一些选项

```ts
export default defineNuxtConfig({
	modules: ['@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt'],
	piniaPersistedstate: {
		cookieOptions: {
			sameSite: 'strict',
		},
		storage: 'localStorage',
	},
})
```

-   `storage`：持久化默认使用的 storage (`'localStorage'`, `'sessionStorage'` 或 `'cookies'`)。
-   `cookieOptions`：默认 [cookie 选项](https://nuxt.com/docs/api/composables/use-cookie#options)（仅在使用 cookie 持久化时可用）。
-   `debug`：详见 [`debug`](/zh/guide/config.html#debug).
