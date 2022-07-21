import { setActivePinia, createPinia, defineStore } from 'pinia'
import { describe, beforeEach, it, expect, vi, beforeAll } from 'vitest'
import { createApp, nextTick, ref, Vue2, isVue2, install } from 'vue-demi'

import {
  persistedState,
  createPersistedState,
  createNuxtPersistedState,
} from '../src/plugin'
import { initializeLocalStorage, readLocalStoage } from './utils'

const key = 'mock-store'

beforeAll(() => {
  if (isVue2) {
    Vue2.config.productionTip = false
    Vue2.config.devtools = false
    install(Vue2)
  }
})

beforeEach(() => {
  let state: Record<string, string> = {}

  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn(key => state[key]),
      setItem: vi.fn((key, value) => {
        state[key] = value
      }),
      removeItem: vi.fn(key => delete state[key]),
      clear: vi.fn(() => {
        state = {}
      }),
    },
  })
})

describe('default export', () => {
  beforeEach(() => {
    const app = createApp({})
    const pinia = createPinia()
    pinia.use(persistedState)
    app.use(pinia)
    setActivePinia(pinia)
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

  describe('setup function syntax', () => {
    const useStore = defineStore(key, () => ({ lorem: ref('') }), {
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

  describe('w/ storage', () => {
    let stored: Record<string, string>
    const storage = {
      getItem: vi.fn(key => stored[key]),
      setItem: vi.fn((key, value) => {
        stored[key] = value
      }),
    }

    const useStore = defineStore(key, {
      state: () => ({ lorem: '' }),
      persist: { storage },
    })

    it('persists to given storage', async () => {
      //* arrange
      stored = {}
      const store = useStore()

      //* act
      store.lorem = 'ipsum'
      await nextTick()

      //* assert
      expect(stored[key]).toEqual('{"lorem":"ipsum"}')
      expect(storage.setItem).toHaveBeenCalled()
    })

    it('rehydrates from given storage', () => {
      //* arrange
      stored = { 'mock-store': '{"lorem":"ipsum"}' }

      //* act
      const store = useStore()

      //* assert
      expect(store.lorem).toEqual('ipsum')
      expect(storage.getItem).toHaveBeenCalled()
    })

    it('catches storage.get errors', () => {
      //* arrange
      storage.getItem.mockImplementationOnce(() => {
        throw new Error('get_error')
      })

      //* assert
      expect(() => useStore()).not.toThrow()
    })

    it('catches storage.set errors', () => {
      //* arrange
      storage.setItem.mockImplementationOnce(() => {
        throw new Error('set_error')
      })

      //* assert
      expect(() => {
        useStore().lorem = 'fail'
      }).not.toThrow()
    })
  })

  describe('w/ async storage', () => {
    let stored: Record<string, string>
    const storage = {
      getItem: vi.fn(key => Promise.resolve(stored[key])),
      setItem: vi.fn((key, value) => {
        return new Promise<void>(resolve => {
          stored[key] = value
          resolve()
        })
      }),
    }

    const useStore = defineStore(key, {
      state: () => ({ lorem: '' }),
      persist: { storage },
    })

    it('persists to given storage', () => {
      //* arrange
      stored = {}
      const store = useStore()

      //* assert
      expect.assertions(2)
      store.$subscribe(() => {
        expect(stored[key]).toEqual('{"lorem":"ipsum"}')
        expect(storage.setItem).toHaveBeenCalled()
      })

      //* act
      store.lorem = 'ipsum'
    })

    it('persists to given storage taking care of race conditions', async () => {
      vi.useFakeTimers()
      stored = {}
      //* arrange
      const store = useStore()
      const promises: Promise<void>[] = []

      storage.setItem.mockImplementationOnce((key, value) => {
        const promise = new Promise<void>(resolve =>
          setTimeout(() => {
            stored[key] = value
            resolve()
          }, 1000),
        )
        promises.push(promise)
        return promise
      })

      //* act
      store.lorem = 'ipsum'
      await nextTick()

      storage.setItem.mockImplementationOnce((key, value) => {
        const promise = new Promise<void>(resolve => {
          stored[key] = value
          resolve()
        })
        promises.push(promise)
        return promise
      })

      //* force second update with smaller timeout
      store.lorem = 'after'
      await nextTick()
      vi.runAllTimers()
      await nextTick()

      await Promise.all(promises)
      //* assert
      expect(stored[key]).toEqual('{"lorem":"after"}')
    })

    it('rehydrates from given storage', async () => {
      //* arrange
      stored = { 'mock-store': '{"lorem":"ipsum"}' }

      //* act
      const store = useStore()
      expect.assertions(2)
      await nextTick()

      //* assert
      store.$subscribe(() => {
        expect(store.lorem).toEqual('ipsum')
        expect(storage.getItem).toHaveBeenCalled()
      })
    })

    it('catches storage.get errors', () => {
      //* arrange
      storage.getItem.mockImplementationOnce(() => {
        throw new Error('get_error')
      })

      //* assert
      expect(() => useStore()).not.toThrow()
    })

    it('catches storage.set errors', () => {
      //* arrange
      storage.setItem.mockImplementationOnce(() => {
        throw new Error('set_error')
      })

      //* assert
      expect(() => {
        useStore().lorem = 'fail'
      }).not.toThrow()
    })
  })

  describe('w/ hooks', () => {
    const beforeRestore = vi.fn(ctx => {
      ctx.store.before = 'before'
    })
    const afterRestore = vi.fn(ctx => {
      ctx.store.after = 'after'
    })
    const useStore = defineStore(key, {
      state: () => ({
        lorem: '',
        before: '',
        after: '',
      }),
      persist: { beforeRestore, afterRestore },
    })

    it('runs hooks before and after hydration', async () => {
      //* arrange
      initializeLocalStorage(key, { lorem: 'ipsum' })

      //* act
      await nextTick()
      const store = useStore()

      //* assert
      expect(store.lorem).toEqual('ipsum')
      expect(beforeRestore).toHaveBeenCalled()
      expect(store.before).toEqual('before')
      expect(afterRestore).toHaveBeenCalled()
      expect(store.after).toEqual('after')
    })
  })
  describe('w/ hooks and async storage', () => {
    let stored: Record<string, string>
    const storage = {
      getItem: vi.fn(key => Promise.resolve(stored[key])),
      setItem: vi.fn((key, value) => {
        return new Promise<void>(resolve => {
          stored[key] = value
          resolve()
        })
      }),
    }

    const beforeRestore = vi.fn(ctx => {
      ctx.store.before = 'before'
    })
    const afterRestore = vi.fn()
    const useStore = defineStore(key, {
      state: () => ({
        lorem: '',
        before: '',
        after: '',
      }),
      persist: { storage, beforeRestore, afterRestore },
    })

    it('runs hooks before and after hydration', async () => {
      //* arrange
      stored = { 'mock-store': '{"lorem":"ipsum"}' }

      //* act
      await nextTick()
      const store = useStore()
      expect.assertions(5)

      await new Promise<void>(resolve => {
        afterRestore.mockImplementationOnce(ctx => {
          ctx.store.after = 'after'
          resolve()
        })
      })

      //* assert
      expect(store.lorem).toEqual('ipsum')
      expect(beforeRestore).toHaveBeenCalled()
      expect(store.before).toEqual('before')
      expect(afterRestore).toHaveBeenCalled()
      expect(store.after).toEqual('after')
    })
  })

  describe('w/ serializer', () => {
    it('deserializes', async () => {
      //* arrange
      initializeLocalStorage(key, { lorem: 'ipsum' })
      const deserialize = vi.fn(JSON.parse)
      const useStore = defineStore(key, {
        state: () => ({ lorem: '' }),
        persist: {
          serializer: {
            serialize: JSON.stringify,
            deserialize,
          },
        },
      })

      //* act
      await nextTick()
      useStore()

      //* assert
      expect(deserialize).toHaveBeenCalledWith(localStorage.getItem(key))
      expect(deserialize).toHaveReturnedWith({ lorem: 'ipsum' })
    })

    it('serializes', async () => {
      //* arrange
      const serialize = vi.fn(JSON.stringify)
      const useStore = defineStore(key, {
        state: () => ({ lorem: 'ipsum' }),
        persist: {
          serializer: {
            serialize,
            deserialize: JSON.parse,
          },
        },
      })
      const store = useStore()

      //* act
      store.lorem = 'dolor'
      await nextTick()

      //* assert
      expect(serialize).toHaveBeenCalledWith({ lorem: 'dolor' })
      expect(serialize).toHaveReturnedWith(localStorage.getItem(key))
    })
  })
})

describe('factory function', () => {
  it('uses factory function options', async () => {
    //* arrange
    initializeLocalStorage(key, { lorem: 'ipsum' })
    const afterRestore = vi.fn()
    const beforeRestore = vi.fn()
    const storage = {
      getItem: vi.fn(localStorage.getItem),
      setItem: vi.fn(localStorage.setItem),
    }
    const serializer = {
      serialize: vi.fn(JSON.stringify),
      deserialize: vi.fn(JSON.parse),
    }
    const app = createApp({})
    const pinia = createPinia()

    //* act
    pinia.use(
      createPersistedState({
        afterRestore,
        beforeRestore,
        storage,
        serializer,
      }),
    )
    app.use(pinia)
    setActivePinia(pinia)
    const useStore = defineStore(key, {
      state: () => ({ lorem: '' }),
      persist: true,
    })
    const store = useStore()
    store.lorem = 'dolor'
    await nextTick()

    //* assert
    expect(beforeRestore).toHaveBeenCalledOnce()
    expect(afterRestore).toHaveBeenCalledOnce()
    expect(storage.getItem).toHaveBeenCalledOnce()
    expect(storage.setItem).toHaveBeenCalledOnce()
    expect(serializer.serialize).toHaveBeenCalledOnce()
    expect(serializer.deserialize).toHaveBeenCalledOnce()
  })

  it('gets overriden by store options', async () => {
    //* arrange
    initializeLocalStorage(key, { lorem: 'ipsum' })
    const afterRestore = vi.fn()
    const beforeRestore = vi.fn()
    const storage = {
      getItem: vi.fn(localStorage.getItem),
      setItem: vi.fn(localStorage.setItem),
    }
    const serializer = {
      serialize: vi.fn(JSON.stringify),
      deserialize: vi.fn(JSON.parse),
    }
    const app = createApp({})
    const pinia = createPinia()
    pinia.use(
      createPersistedState({
        afterRestore: vi.fn(),
        beforeRestore: vi.fn(),
        storage: localStorage,
        serializer: {
          serialize: JSON.stringify,
          deserialize: JSON.parse,
        },
      }),
    )
    app.use(pinia)
    setActivePinia(pinia)

    //* act
    const useStore = defineStore(key, {
      state: () => ({ lorem: '' }),
      persist: {
        afterRestore,
        beforeRestore,
        storage,
        serializer,
      },
    })
    const store = useStore()
    store.lorem = 'dolor'
    await nextTick()

    //* assert
    expect(beforeRestore).toHaveBeenCalledOnce()
    expect(afterRestore).toHaveBeenCalledOnce()
    expect(storage.getItem).toHaveBeenCalledOnce()
    expect(storage.setItem).toHaveBeenCalledOnce()
    expect(serializer.serialize).toHaveBeenCalledOnce()
    expect(serializer.deserialize).toHaveBeenCalledOnce()
  })
})

describe('nuxt factory function', () => {
  it('uses cookie composable', async () => {
    //* arrange
    const cookieRef = ref()
    const useCookie = vi.fn(() => cookieRef)
    const app = createApp({})
    const pinia = createPinia()

    //* act
    pinia.use(createNuxtPersistedState(useCookie))
    app.use(pinia)
    setActivePinia(pinia)
    const useStore = defineStore(key, {
      state: () => ({ lorem: '' }),
      persist: true,
    })
    const store = useStore()
    store.lorem = 'dolor'
    await nextTick()

    //* assert
    expect(useCookie).toHaveBeenCalledTimes(2)
    expect(cookieRef.value).toEqual('{"lorem":"dolor"}')
  })
})
