# 局限性

虽然该插件提供了许多灵活性和功能，但也应考虑一些限制。

## Storage 必须是同步的

在提供自定义[`storage`](/guide/config#storage)时，其方法必须是同步的。这是因为 Pinia 的状态订阅 ([`$subscribe`](https://pinia.vuejs.org/core-concepts/state#Subscribing-to-the-state)) 是同步的。

:::tip Workaround
要添加异步行为（例如使用异步存储），您可以尝试 [订阅操作 (`$onAction`)](https://pinia.vuejs.org/core-concepts/actions.html#Subscribing-to-actions).
:::

## 引用不持久化

由于序列化过程，引用在刷新时丢失。
请考虑以下事项：

```ts
const a = {
  1: 'one',
  2: 'two',
  // ...
}
const b = a
```

在序列化之前，`a` 和 `b` 指向同一个对象:
```ts
a === b // -> true
```

在反序列化之后，`a` 和 `b` 是具有相同内容的两个不同的对象:
```ts
a === b // -> false
```

因此,`a` 和 `b` 之间的响应式丧失。

:::tip Workaround
要解决这个问题，您可以从持久化中排除 `a` 或 `b` (使用[`pick`](/guide/config#pick)选项)并使用[` afterHydrate `](/guide/config#afterhydrate)钩子在hydration后重新填充它们。这样, `a` 和 `b` 再次具有相同的参照，响应式恢复。
:::

## 非基本数据类型不持久化

由于序列化过程，诸如 `Date` 之类的非基本数据类型不会被再rehydrated为 `Date` 对象，而是被再水合为 `string` 。

:::tip Workaround
要解决此问题，您可以：
- 使用 [`afterHydrate`](/guide/config#afterhydrate) 钩子在rehydration后重新创建对象。
- 使用支持要保持的数据类型 [`serializer`](/guide/config#serializer) 。
:::
