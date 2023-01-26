# 局限性

虽然该插件具有很大的灵活性以及丰富的功能，但也有一些限制需要考虑。

## 引用不会被持久化

由于数据将会被序列化，因此引用在刷新时将会丢失。
我们来看看下面这个例子：

```ts
const a = {
	1: 'one',
	2: 'two',
	// ...
}
const b = a
```

在序列化之前， `a` 和 `b` 指向了同一个对象：

```ts
a === b // -> true
```

在反序列化之后, `a` 和 `b` 是有着相同内容的不同对象：

```ts
a === b // -> false
```

因此，`a` 和 `b` 之间的联系将会丢失。

:::tip 解决方法
为了解决这个问题，你可以采取避免 `a` 或 `b` 被持久化的方法(使用 [`paths`](/zh/guide/config#paths) 选项)，并使用 [`afterRestore`](/zh/guide/config#afterrestore) 钩子在恢复数据后重新存储它们。这样 `a` 和 `b` 就又会有着相同的引用，两者之间的联系就恢复了。

:::

## 基本类型之外的将不会被持久化

由于数据将会被序列化，因此非基本类型（如 `Date`）不会以 `Date` 对象形式存储，而是作为 `string`。

:::tip 解决方法
为了解决这个问题，你可以：

-   使用 [`afterRestore`](/zh/guide/config#afterrestore) 钩子在恢复数据后重新创建对象。
-   使用自定义的 [`serializer`](/zh/guide/config#serializer) 来配置你想要持久化的数据类型。

:::

## 存储必须是同步的

当提供自定义 [`storage`](/zh/guide/config#storage) 时，其方法必须是同步的，这是因为 Pinia 的状态订阅（[`$subscribe`](https://pinia.vuejs.org/zh/core-concepts/state.html#subscribing-to-the-state)）是同步的(与 mutations 一致)。

:::tip 解决方法
如果要添加异步行为（例如使用 async storages），你可以尝试 [订阅 action (`$onAction`)](https://pinia.vuejs.org/zh/core-concepts/actions.html#subscribing-to-actions)。
:::
