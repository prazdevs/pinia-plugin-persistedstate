import { setActivePinia, createPinia, defineStore } from 'pinia'
import { describe, beforeEach, afterEach, it, expect } from 'vitest'
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

    localStorage.clear()
  })

  afterEach(() => {
    // @ts-expect-error mocked in setup
    localStorage.getItem.mockClear()
    // @ts-expect-error mocked in setup
    localStorage.setItem.mockClear()
    // @ts-expect-error mocked in setup
    localStorage.removeItem.mockClear()
    // @ts-expect-error mocked in setup
    localStorage.clear.mockClear()
  })

  describe('disabled', () => {
    const useStore = defineStore(key, {
      state: () => ({ lorem: '' }),
    })

    it('does not persist store', async () => {
      //* arrange
      const store = useStore()

      //* act
      store.lorem = 'ipsum'
      await nextTick()

      //* assert
      expect(readLocalStoage(key)).toEqual({})
      expect(localStorage.setItem).not.toHaveBeenCalled()
    })

    it('does not rehydrate store', async () => {
      //* arrange
      initializeLocalStorage(key, { lorem: 'ipsum' })

      //* act
      await nextTick()
      const store = useStore()

      //* assert
      expect(store.lorem).toEqual('')
      expect(localStorage.getItem).not.toHaveBeenCalled()
    })
  })

  describe('default settings', () => {
    const useStore = defineStore(key, {
      state: () => ({ lorem: '' }),
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
      expect(localStorage.setItem).toHaveBeenCalledWith(
        key,
        JSON.stringify({ lorem: 'ipsum' }),
      )
    })

    it('rehydrates store from localStorage', async () => {
      //* arrange
      initializeLocalStorage(key, { lorem: 'ipsum' })

      //* act
      await nextTick()
      const store = useStore()

      //* assert
      expect(store.lorem).toEqual('ipsum')
      expect(localStorage.getItem).toHaveBeenCalledWith(key)
    })
  })

  describe('w/ key', () => {
    const useStore = defineStore(key, {
      state: () => ({ lorem: '' }),
      persist: { key: 'mock' },
    })

    it('persists store in localStorage under given key', async () => {
      //* arrange
      const store = useStore()

      //* act
      store.lorem = 'ipsum'
      await nextTick()

      //* assert
      expect(readLocalStoage('mock')).toEqual({ lorem: 'ipsum' })
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'mock',
        JSON.stringify({ lorem: 'ipsum' }),
      )
    })

    it('rehydrates store from localStorage under given key', async () => {
      //* arrange
      initializeLocalStorage('mock', { lorem: 'ipsum' })

      //* act
      await nextTick()
      const store = useStore()

      //* assert
      expect(store.lorem).toEqual('ipsum')
      expect(localStorage.getItem).toHaveBeenCalledWith('mock')
    })
  })

  describe('w/ paths', () => {
    const useStore = defineStore(key, {
      state: () => ({
        lorem: '',
        dolor: {
          sit: '',
          consectetur: {
            adipiscing: '',
          },
        },
      }),
      persist: {
        paths: ['lorem', 'dolor.consectetur.adipiscing'],
      },
    })

    it('persists store paths in localStorage', async () => {
      //* arrange
      const store = useStore()

      //* act
      store.lorem = 'ipsum'
      store.dolor.sit = 'amet'
      store.dolor.consectetur.adipiscing = 'elit'
      await nextTick()

      //* assert
      expect(readLocalStoage(key)).toEqual({
        lorem: 'ipsum',
        dolor: { consectetur: { adipiscing: 'elit' } },
      })
      expect(localStorage.setItem).toHaveBeenCalledWith(
        key,
        JSON.stringify({
          lorem: 'ipsum',
          dolor: { consectetur: { adipiscing: 'elit' } },
        }),
      )
    })

    it('rehydrates store paths from localStorage', async () => {
      //* arrange
      initializeLocalStorage(key, {
        lorem: 'ipsum',
        dolor: { consectetur: { adipiscing: 'elit' } },
      })

      //* act
      await nextTick()
      const store = useStore()

      //* assert
      expect(store.lorem).toEqual('ipsum')
      expect(store.dolor.consectetur.adipiscing).toEqual('elit')
      expect(localStorage.getItem).toHaveBeenCalledWith(key)
    })
  })
})
