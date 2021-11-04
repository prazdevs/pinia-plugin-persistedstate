import { setActivePinia, createPinia, defineStore } from 'pinia'
import { createApp, nextTick } from 'vue-demi'

import Plugin from '../src/index'
import { initializeLocalStorage, readLocalStoage } from './utils'

const key = 'mock-store'

describe('PiniaPluginPersistedstate', () => {
  beforeEach(() => {
    const app = createApp({})
    const pinia = createPinia()
    pinia.use(Plugin)
    app.use(pinia)
    setActivePinia(pinia)
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('default settings', () => {
    const useStore = defineStore(key, {
      state: () => ({
        lorem: '',
      }),
      persist: true,
    })

    it('persists store in localStorage', async () => {
      //* arrange
      const store = useStore()

      //* act
      store.lorem = 'ipsum'
      await nextTick()

      //* assert
      expect(readLocalStoage(key)).toEqual({ lorem: 'ipsum' })
    })

    it('rehydrates store from localStorage', async () => {
      //* arrange
      initializeLocalStorage(key, { lorem: 'ipsum' })

      //* act
      await nextTick()
      const store = useStore()

      //* assert
      expect(store.lorem).toEqual('ipsum')
    })
  })
})
