# 从 v2 迁移

## 突破性变化

-   `paths` 配置选项不再支持数组表示法（`nested.[].array`）。在 v2 上实现这一特性增加了许多难以维护的代码，并使捆绑包变得更大。另外可测试性和性能也是难以解决的问题，因此在 v3 中不再提供该写法。如果的确需要，你可以继续使用 v2。

-   基本包（`pinia-plugin-persistedstate`）现在只导出插件及其工厂函数。如果要在元框架（Nuxt、Quasar...）中使用它，你可以根据元框架集成 Vue 插件的方式来手动配置插件。

## 与 Nuxt 一起使用

你不再需要创建 Nuxt 插件来为 Nuxt 中的 Pinia Store 添加持久性：Nuxt 模块 `@pinia-plugin-persistedstate/nuxt` 已经为你准备好了。更多详细信息，请阅读[“专用文档”](/zh/frameworks/nuxt-3)。

:::warning 警告
目前，该模块仅支持 Nuxt 3。

:::
