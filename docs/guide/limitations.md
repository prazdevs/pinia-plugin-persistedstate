# Limitations

While the plugin offers a lot of flexibility and functionality, there are some limitations that should be considered.

## References are not persisted

Due to serialization process, references are lost on refresh.
Consider the following:

```ts
const a = {
  1: 'one',
  2: 'two',
  // ...
}
const b = a
```

Before serialization, `a` and `b` point to the same object:
```ts
a === b // -> true
```

After deserialization, `a` and `b` are two different objects with the same content:
```ts
a === b // -> false
```

As a consequence, reactivity between `a` and `b` is lost.

:::tip Workaround
To get around this, you can exclude either `a` or `b` from being persisted (using the [`paths`](/guide/config#paths) option) and use the [`afterRestore`](/guide/config#afterrestore) hook to re-populate them after hydration. That way `a` and `b` have the same refence again and reactivity is restored.
:::

## Non-primitive types are not persisted

Due to the serialization process, non-primitive types such as `Date` are not rehydrated as `Date` object but as `string` instead.

:::tip Workaround
To get around this you can:
- Use the [`afterRestore`](/guide/config#afterrestore) hook to recreate the objects after rehydration.
- Use a custom [`serializer`](/guide/config#serializer) that supports the data types you want to persist.
:::

## Storage must be synchronous

When providing a custom [`storage`](/guide/config#storage), its methods must be synchronous. This is due to Pinia's state subscription ([`$subscribe`](https://pinia.vuejs.org/core-concepts/state#subscribing-to-the-state)) being synchronous (like mutations).

:::tip Workaround
To add asynchronous behavior (such as using async storages), you can try [subscribing to actions (`$onAction`)](https://pinia.vuejs.org/core-concepts/actions.html#subscribing-to-actions).
:::
