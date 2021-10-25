import { PiniaPluginContext } from 'pinia'

declare module 'pinia' {
  export interface DefineStoreOptions<Id extends string, S extends StateTree,  G,  A> {
    persist?: boolean
  }
}

export default function (context: PiniaPluginContext): void {
  if (context.options.persist) {
    const key = context.store.$id

    const fromStorage = localStorage.getItem(key)

    if (fromStorage) context.store.$patch(JSON.parse(fromStorage))

    context.store.$subscribe((_: any, state: any) => {
        localStorage.setItem(key, JSON.stringify(state))
      },
    )
  }
}
