# Usage With Quasar 2

The plugin provides a factory functions to make integration with Quasar easy.

## SSR-enabled persistence

Using the Cookies plugin from Quasar allows for persistence with full SSR support.   
Enable the `Cookies` plugin in the Quasar config:

```js
// quasar.config.js
const { configure } = require('quasar/wrappers');

module.exports = configure(function () {
  return {
    //...

    framework: {
      plugins: ['Cookies'],
    },

    //...
  }
});
```

And add the plugin to the pinia instance declared in `src/stores/index.ts`:

```ts
// /src/stores/index.ts

import { store } from 'quasar/wrappers'
import { Cookies } from 'quasar'
import { createPinia } from 'pinia'
import { createQuasarCookiesPersistedState } from 'pinia-plugin-persistedstate/quasar'

export default store(({ ssrContext }) => {
  const pinia = createPinia()

  const cookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies;
  pinia.use(createQuasarCookiesPersistedState(cookies))

  return pinia
})
```

`createQuasarCookiesPersistedState` accepts [global options](/guide/advanced#global-persistence-options) as third parameter with the following options available:

- [`serializer`](/guide/config#serializer)
- [`beforeRestore`](/guide/config#beforeRestore)
- [`afterRestore`](/guide/config#afterRestore)
- `cookieOptions`

:::info
You can specify the [cookie options](https://quasar.dev/quasar-plugins/cookies#option-path) to the `cookieOptions` property:

```ts
import { store } from 'quasar/wrappers'
import { Cookies } from 'quasar'
import { createPinia } from 'pinia'
import { createQuasarCookiesPersistedState } from 'pinia-plugin-persistedstate/quasar'

export default store(({ ssrContext }) => {
  const pinia = createPinia()

  const cookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies;
  pinia.use(createQuasarCookiesPersistedState(
    cookies,
    {
      cookieOptions: {
        expires: 3600, 
        maxAge: 3600,
        sameSite: 'strict',
      }
    }
  ))

  return pinia
})
```
:::

:::warning
Overriding the `storage` option in a store will break its server-side persistence/rehydration with cookies.
:::

:::info
If you need it, you can also add the plugin from a [boot file](https://quasar.dev/quasar-cli-vite/boot-files) instead:

```ts
// /boot/persistedstate.ts

import { boot } from 'quasar/wrappers'
import { Cookies } from 'quasar'
import { 
  createQuasarCookiesPersistedState 
} from 'pinia-plugin-persistedstate/quasar'

export default boot(({ store, ssrContext }) => {
  store.use(createQuasarCookiesPersistedState(Cookies, ssrContext))
})
```

Don't forget to declare the boot file in the Quasar config.
:::

## WebStorage persistence

While `localStorage` and `sessionStorage` should work out of the box, you can also use Quasar's [`WebStorage`](https://quasar.dev/quasar-plugins/web-storage) plugins:

```ts
// /src/stores/index.ts

import { store } from 'quasar/wrappers'
import { LocalStorage } from 'quasar'
// import { SessionStorage } from 'quasar'
import { createPinia } from 'pinia'
import { createQuasarWebStoragePersistedState } from 'pinia-plugin-persistedstate/quasar'

export default store(() => {
  const pinia = createPinia()

  pinia.use(createQuasarWebStoragePersistedState(LocalStorage))

  // or for SessionStorage
  // pinia.use(createQuasarWebStoragePersistedState(sessionStorage))

  return pinia
})
```

Just make sure the `LocalStorage`/`WebStorage` plugin is enabled in the Quasar config.
