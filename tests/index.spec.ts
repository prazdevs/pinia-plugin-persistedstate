import { setActivePinia, createPinia, defineStore } from 'pinia'
import { createApp } from 'vue-demi'

import Plugin from '../src/index'

const useStore = defineStore('store', {
  state: () => ({
    lorem: 'ipsum',
  }),
})

const app = createApp({})

describe('PiniaPluginPersistedstate', () => {
  beforeEach(() => {
    const pinia = createPinia()
    pinia.use(Plugin)
    app.use(pinia)
    setActivePinia(pinia)
  })

  it('reads state', () => {
    const store = useStore()
    expect(store.lorem).toBe('ipsum')
  })
})
