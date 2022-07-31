import { store } from 'quasar/wrappers'
import { createPinia } from 'pinia'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(() => {
  const pinia = createPinia()
  // pinia.use(createPersistedState({
  //   storage: {
  //     getItem: LocalStorage.getItem,
  //     setItem: LocalStorage.set,
  //   }
  // }))

  // You can add Pinia plugins here
  // pinia.use(SomePiniaPlugin)

  return pinia
})
