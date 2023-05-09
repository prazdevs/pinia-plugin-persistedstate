import type {
  Pinia,
  StoreDefinition,
  StoreGeneric,
} from 'pinia'

function isUseStore(fn: any): fn is StoreDefinition {
  return typeof fn === 'function' && typeof fn.$id === 'string'
}

/**
 * Override of Pinia's `acceptHMRUpdate`. Use at your own discretion.
 * @param initialUseStore return of the `defineStore` to hot update
 * @param hot `import.meta.hot`
 */
export function acceptHMRUpdateWithHydration(initialUseStore: any, hot: any) {
  return (newModule: any) => {
    const pinia: Pinia | undefined = hot.data.pinia || initialUseStore._pinia

    if (!pinia)
      return

    hot.data.pinia = pinia

    for (const exportName in newModule) {
      const useStore = newModule[exportName]
      // @ts-expect-error `_s is a stripped @internal`
      if (isUseStore(useStore) && pinia._s.has(useStore.$id)) {
        const id = useStore.$id

        if (id !== initialUseStore.$id) {
          console.warn(
            `The id of the store changed from "${initialUseStore.$id}" to "${id}". Reloading.`,
          )
          return hot.invalidate()
        }

        // @ts-expect-error `_s is a stripped @internal`
        const existingStore: StoreGeneric = pinia._s.get(id)!
        if (!existingStore)
          return

        useStore(pinia, existingStore).$hydrate?.()
      }
    }
  }
}
