# Changelog

## v4.0.2

[compare changes](https://github.com/prazdevs/pinia-plugin-persistedstate/compare/v4.0.1...v4.0.2)

### 🩹 Fixes

- Infer `CookieStorageOptions` from `@nuxt/schema` rather than `nuxt/schema` ([9e77053](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/9e77053))
- **nuxt:** Avoid calling runWithContext ([#334](https://github.com/prazdevs/pinia-plugin-persistedstate/pull/334))

### 📖 Documentation

- Improve readability (code group icons + code titles) ([13b6332](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/13b6332))

### 🏡 Chore

- Upgrade dependencies ([ba8cd49](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/ba8cd49))
- Upgrade dependencies ([c2ae5a0](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/c2ae5a0))

### ❤️ Contributors

- Prazdevs <hi@praz.dev>
- PraZ <hi@praz.dev>

## v4.0.1

[compare changes](https://github.com/prazdevs/pinia-plugin-persistedstate/compare/v4.0.0...v4.0.1)

### 🩹 Fixes

- Augment `@nuxt/schema` rather than `nuxt/schema` ([#330](https://github.com/prazdevs/pinia-plugin-persistedstate/pull/330))

### 📖 Documentation

- Add group icon plugin ([#329](https://github.com/prazdevs/pinia-plugin-persistedstate/pull/329))

### ❤️ Contributors

- Daniel Roe ([@danielroe](http://github.com/danielroe))
- Leo ([@yuyinws](http://github.com/yuyinws))

## v4.0.0

### 🚀 Enhancements

- Support excluding paths from persistence with `omit` option
- Support autocompletion for dot-notation paths in `pick` and `omit` options
- ⚠️ Rehydrate only picked/omitted paths (when specified) instead of the whole state
- ⚠️ Drop global `beforeRestore` and `afterRestore` options
- ⚠️ Drop `auto` mode
- **nuxt:** Include Nuxt module in the base package
- **nuxt:** Add global `key` option using template string

### 🔥 Performance

- Deserialize with `destr` instead of `JSON.parse`

### 🩹 Fixes

- **nuxt:** Improve SSR handling and store hdyration/persistence behavior in route middleware

### 💅 Refactors

- ⚠️ Rename `paths` option to `pick`
- ⚠️ Rename `beforeRestore` and `afterRestore` options to `beforeHydrate` and `afterHydrate`
- **nuxt:** ⚠️ Rename auto-imported storage object to `piniaPluginPersistedstate`
- **nuxt:** ⚠️ Rename Nuxt config option key to `piniaPluginPersistedstate`

### 📖 Documentation

- Rewrite documentation to match v4 API
- Add references and links to Nuxt-specific details and implementations

### 📦 Build

- Build standalone from Nuxt module's runtime

### 🎨 Styles

- Add a new identity and logo to the project

#### ⚠️ Breaking Changes

- ⚠️ Rehydrate only picked/omitted paths (when specified) instead of the whole state
- ⚠️ Drop global `beforeRestore` and `afterRestore` options
- ⚠️ Drop `auto` mode
- ⚠️ Rename `paths` option to `pick`
- ⚠️ Rename `beforeRestore` and `afterRestore` options to `beforeHydrate` and `afterHydrate`
- **nuxt:** ⚠️ Rename auto-imported storage object to `piniaPluginPersistedstate`
- **nuxt:** ⚠️ Rename Nuxt config option key to `piniaPluginPersistedstate`

### ❤️ Contributors

- Prazdevs <hi@praz.dev>

***

_For changes prior to v4, please refer to the [GitHub Releases](https://github.com/prazdevs/pinia-plugin-persistedstate/releases)_
