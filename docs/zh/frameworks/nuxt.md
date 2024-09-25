# Usage with Nuxt

该软件包 `pinia-plugin-persistedstate` 附带一个 Nuxt 模块，可提供开箱即用的 SSR 友好体验。

## 安装

1. 使用你喜欢的包管理器安装依赖项：
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

1. 将模块添加到 Nuxt 配置中：
```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
  ],
})
```

## 用法

在声明您的存储时，将新的 `persist` 选项设置为 `true`。

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

## 预配置

Nuxt 模块预配置了以下内容：

- [`cookies`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies) 作为存储。
- [`store.$id`](https://pinia.vuejs.org/api/interfaces/pinia.StoreProperties.html) 作为 storage 的默认 key。
- [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)/[`destr`](https://github.com/unjs/destr) 作为序列化器/反序列化器。
- 整个状态将持久化到存储中。

## 选择存储

您可以通过使用自动导入的 `piniaPluginPersistedstate` 变量下的可用存储来配置要使用的存储。

> [!WARNING]
> 使用 `persistedState` 公开的存储之外的其他存储可能会出现意外行为。

### `cookies`

```ts{10}
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => {
    return {
      someState: 'hello pinia',
    }
  },
  persist: {
    storage: piniaPluginPersistedstate.cookies(),
  },
})
```

> [!TIP]
> `persistedState.Cookies` 方法接受一个对象参数来配置带有以下选项的cookie(从Nuxt的 `useCookie` 继承而来):
>  - [`domain`](https://nuxt.com/docs/api/composables/use-cookie#domain)
>  - [`expires`](https://nuxt.com/docs/api/composables/use-cookie#maxage-expires)
>  - [`httpOnly`](https://nuxt.com/docs/api/composables/use-cookie#httponly)
>  - [`maxAge`](https://nuxt.com/docs/api/composables/use-cookie#maxage-expires)
>  - [`partitioned`](https://nuxt.com/docs/api/composables/use-cookie#partitioned)
>  - [`path`](https://nuxt.com/docs/api/composables/use-cookie#path)
>  - [`sameSite`](https://nuxt.com/docs/api/composables/use-cookie#samesite)
>  - [`secure`](https://nuxt.com/docs/api/composables/use-cookie#secure)

### `localStorage`

```ts{10}
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => {
    return {
      someState: 'hello pinia',
    }
  },
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  },
})
```

> [!WARNING]
> `localStorage` 仅限客户端。

### `sessionStorage`

```ts{10}
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => {
    return {
      someState: 'hello pinia',
    }
  },
  persist: {
    storage: piniaPluginPersistedstate.sessionStorage(),
  },
})
```

> [!WARNING]
> `sessionStorage` 仅限客户端。

## Global options

该模块接受在 `piniaPluginPersistedstate` key下的 `nuxt.config.ts` 中定义的一些选项:

- [`cookieOptions`](#cookies)
- `debug`
- [`key`](#global-key)
- `storage`

> [!NOTE]
> 全局存储选项仅接受预配置存储 (`'cookies'`, `'localStorage'`, `'sessionStorage'`)的字符串值。 这是由于 Nuxt 将 [模块选项传递给运行时](https://nuxt.com/docs/guide/going-further/modules#exposing-options-to-runtime)的方式。

```ts{6-12} [nuxt.config.ts]
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt'
  ],
  piniaPluginPersistedstate: {
    storage: 'cookies',
    cookieOptions: {
      sameSite: 'lax',
    },
    debug: true,
  },
})
```

## 全局密钥

您可以为全局使用的前缀/后缀键提供模板字符串。提供的密钥必须包含令牌 `%id` ,该令牌将被相应的存储id替换。

```ts{6} [nuxt.config.ts]
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt'
  ],
  piniaPluginPersistedstate: {
    key: 'prefix_%id_postfix',
  },
})
```

任何以 `my-store` 作为持久key(用户提供或从商店id推断)的商店都将在 `prefix_my-store_postfix` key下持久化。
