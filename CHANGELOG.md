# Changelog


<a name="1.6.0"></a>
## 1.6.0 (2022-05-23)

### Added

- ✨ add cookieOptions ([#68](https://github.com/prazdevs/pinia-plugin-persistedstate/issues/68)) [[3620cb6](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/3620cb6b84c593b186a4d321ea5d642d30dd287e)]


<a name="1.5.2"></a>
## 1.5.2 (2022-05-16)

### Changed

- ♻️ refactor file organization [[bff0aac](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/bff0aac50daacfef5ca763cc52199f802596f90b)]
- ♻️ add normalizeOptions ([#59](https://github.com/prazdevs/pinia-plugin-persistedstate/issues/59)) [[822b754](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/822b7541fc0a0a8bb750a3cf64a1c36200591c81)]
[cf9b2a9](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/cf9b2a9382b742bfe23e518171574755fc100fd9)]

### Fixed

- 🐛 fix nuxt cookie encoding ([#66](https://github.com/prazdevs/pinia-plugin-persistedstate/issues/66)) [[3312d55](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/3312d55c7a05d7f01959a3953a6ad9ed561b00ac)]


<a name="1.5.1"></a>
## 1.5.1 (2022-03-08)

### Fixed

- 🐛 remove nuxt3 type dependency ([#45](https://github.com/prazdevs/pinia-plugin-persistedstate/issues/45)) [[b475be5](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/b475be5068722dd48ea3ed4bbf39e98e3a510656)]


<a name="1.5.0"></a>
## 1.5.0 (2022-03-06)

### Added

- ✨ add Nuxt factory function helper ([#40](https://github.com/prazdevs/pinia-plugin-persistedstate/issues/40)) [[c7be40b](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/c7be40b5e03f5a25196fdf78a8437d54a2da1fd4)]
- 🔊 update changelog [[294b665](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/294b6658cd3d51eeb517ae5f344fa530f72b4be4)]


<a name="1.4.0"></a>
## 1.4.0 (2022-03-06)

### Added

- ✨ add factory function ([#39](https://github.com/prazdevs/pinia-plugin-persistedstate/issues/39)) [[761a873](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/761a873b01bd1bf5045de8c7bb63ed28a12fa0a4)]

### Breaking changes

- 💥 remove overwrite option (never worked) [[b88713c](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/b88713c404f4062ddfbbfe550108876329df55d3)]

### Miscellaneous

- 🏷️ improve `pick` typings ([#36](https://github.com/prazdevs/pinia-plugin-persistedstate/issues/36)) [[6d18bf7](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/6d18bf7c83668ca27722432a8beabd469c312bc4)]
- 📝 add install command ([#34](https://github.com/prazdevs/pinia-plugin-persistedstate/issues/34)) [[575b322](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/575b322a8630ddede9cc8fbf57d9fb841df6f49e)]

<a name="1.3.0"></a>
## 1.3.0 (2022-03-02)

### Added

- ✨ add custom (de-)serializer ([#22](https://github.com/prazdevs/pinia-plugin-persistedstate/issues/22)) [[f9313da](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/f9313da2b41a253211e5cb35d2e2c8776f357cf9)]
- 🔊 update changelog [[c12422e](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/c12422edb313658f13a2e2bbd8cedc4f929ee1a3)]

### Miscellaneous

- 💡 add example projects ([#30](https://github.com/prazdevs/pinia-plugin-persistedstate/issues/30)) [[9500821](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/95008217c7450cf46929ca3803c750294eb79199)]

<a name="1.2.3"></a>
## 1.2.3 (2022-02-24)

### Changed

- 🩹 subscribe to pinia state changes in detached mode. ([#24](https://github.com/prazdevs/pinia-plugin-persistedstate/issues/24)) [[7d3c8e9](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/7d3c8e99a73c46a54825f6e532f9aedb462e04bb)]


<a name="1.2.2"></a>
## 1.2.2 (2022-02-10)

### Changed

- 🏷️ simplify StorageLike type [[57f07b1](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/57f07b1d63bb40bda21db0e372bb8d5867e5a4ba)]

### Miscellaneous

- 📝 add nuxt usage docs [[c9e47ea](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/c9e47ea71d2d737d2d72f27de75c53d2eec515d7)]


<a name="1.2.1"></a>
## 1.2.1 (2022-02-01)

### Fixed

- 🐛 extend DefineStoreOptionsBase ([#16](https://github.com/prazdevs/pinia-plugin-persistedstate/issues/16)) [[e429a4e](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/e429a4e5e24ddf55950cb7580a7c6b0782d733c6)]


<a name="1.2.0"></a>
## 1.2.0 (2022-01-29)

### Changed

- 🏗️ internalize pick function ([#14](https://github.com/prazdevs/pinia-plugin-persistedstate/issues/14)) [[1152acf](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/1152acf0a90e2c2051dae159bc59889c7e6dedbe)]

### Miscellaneous

- 📝 add type persistence limitation and workaround [[aa52a70](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/aa52a7037905f1cc7121a2626cc6b5bbf751c94a)]


<a name="1.1.0"></a>
## 1.1.0 (2022-01-23)

### Added

- ✨ Add beforeRestore and afterRestore hooks [[fbba368](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/fbba368c1ca13e06bfa024fd47781ff692406b7c)]


<a name="1.0.3"></a>
## 1.0.3 (2021-12-25)

### Miscellaneous

- ⚗️ move to vitest [[bc3c350](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/bc3c3508fc02610e6e11c58aa5adc1754edf2b95)]


<a name="1.0.2"></a>
## 1.0.2 (2021-11-06)

### Added

- 🔊 add changelog [[2425259](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/242525956b3cd4aac115a8901da432b17df35b8b)]
- ✅ add option tests [[3abdaed](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/3abdaed2b2d409a961d04e422408800e47715e6f)]
- ✅ add default config tests [[3f5ed97](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/3f5ed9723ceff7782ac2879f40ddcf5b7a020e41)]

### Changed

- 🚚 rename private parameters to be more explicit [[60b97b2](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/60b97b2cba22e0923f36551108805ed551c96fed)]

### Miscellaneous

- 📝 fix typo in code example [[03c2fa1](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/03c2fa1e6f9cc3ca1b619f9da07155863e15f1dc)]


<a name="1.0.1"></a>
## 1.0.1 (2021-10-30)

### Miscellaneous

- 📝 add repository to package.json [[d027f60](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/d027f6061d98d307d8ecc845af619fdffbdad31c)]


<a name="1.0.0"></a>
## 1.0.0 (2021-10-27)

### Changed

- ⬆️ upgrade pinia to v2.0.0 [[d8151b1](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/d8151b12a552cf0ee7d8ef3ed6ab5fe6f04fdf67)]

### Miscellaneous

- 📝 add documentation [[b6625df](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/b6625dfb2d84f8163f48ece27d921ed3bc3ce6ae)]
- 🏷️ add jsdoc to types [[1520dc4](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/1520dc497b29391b47a335a95c5ca4037c0fff5c)]


<a name="0.1.0"></a>
## 0.1.0 (2021-10-25)

### Added

- 🎉 initial commit [[2fa1802](https://github.com/prazdevs/pinia-plugin-persistedstate/commit/2fa1802c3eda8fa098697d359d752b10799a30eb)]
