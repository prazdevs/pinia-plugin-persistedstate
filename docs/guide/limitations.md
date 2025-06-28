# Limitations

While the plugin offers a lot of flexibility and functionality, there are some limitations that should be considered.

> [!WARNING] USING NUXT ?
> There are limitations specific to Nuxt. Head over to the [Nuxt usage documentation](/frameworks/nuxt#limitations) to learn more.

## Storage must be synchronous

When providing a custom [`storage`](/guide/config#storage), its methods must be synchronous. This is due to Pinia's state subscription ([`$subscribe`](https://pinia.vuejs.org/core-concepts/state#Subscribing-to-the-state)) being synchronous.

:::tip Workaround
To add asynchronous behavior (such as using async storages), you can try [subscribing to actions (`$onAction`)](https://pinia.vuejs.org/core-concepts/actions.html#Subscribing-to-actions).
:::

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
To get around this, you can exclude either `a` or `b` from being persisted (using the [`pick`](/guide/config#pick) option) and use the [`afterHydrate`](/guide/config#afterhydrate) hook to re-populate them after hydration. That way `a` and `b` have the same refence again and reactivity is restored.
:::

## Non-primitive types are not persisted

Due to the serialization process, non-primitive types such as `Date` are not rehydrated as `Date` object but as `string` instead.

:::tip Workaround
To get around this you can:

- Use the [`afterHydrate`](/guide/config#afterhydrate) hook to recreate the objects after rehydration.
- Use a custom [`serializer`](/guide/config#serializer) that supports the data types you want to persist.
  :::

## Only returned `ref()`s are persisted with setup stores

When using the setup store syntax (composition), only `ref()`s that returned can be persisted. Additionally, `computed()`s cannot be persisted whether or not they are returned.

This is due to how Pinia creates store from the setup declaration:

> - `ref()`s become `state` properties
> - `computed()`s becore `getters`

> Note that you **must** return **all state properties** in setup stores for Pinia to pick them up as state.

You can find more information in the [Pinia documentation](https://pinia.vuejs.org/core-concepts/#Setup-Stores).
