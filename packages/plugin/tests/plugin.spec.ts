import { createPinia, defineStore, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, nextTick, ref } from 'vue'

import { createPersistedState } from '../src/plugin'
import { initializeLocalStorage, readLocalStoage } from './utils'

const key = 'mock-store'

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

describe('default', () => {
  beforeEach(() => {
    const app = createApp({})
    const pinia = createPinia()
    pinia.use(createPersistedState())
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

    it('restore manually', async () => {
      //* arrange
      const store = useStore()

      //* act
      localStorage.setItem(key, JSON.stringify({ lorem: 'ipsum' }))
      await nextTick()

      //* assert
      expect(store.lorem).toEqual('')

      store.$hydrate()
      await nextTick()

      expect(store.lorem).toEqual('ipsum')
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

  describe('w/ hooks', () => {
    const beforeRestore = vi.fn((ctx) => {
      ctx.store.before = 'before'
    })
    const afterRestore = vi.fn((ctx) => {
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

  describe('w/ debug', () => {
    it('error logs hydration errors', () => {
      //* arrange
      const error = new Error('failed_hydration')
      const spy = vi
        .spyOn(globalThis.console, 'error')
        .mockImplementationOnce(() => {})
      const useStore = defineStore(key, {
        state: () => ({ lorem: '' }),
        persist: {
          storage: {
            getItem: () => {
              throw error
            },
            setItem: localStorage.setItem,
          },
          debug: true,
        },
      })

      //* act
      useStore()

      //* assert
      expect(spy).toHaveBeenCalledWith(error)
    })

    it('error logs persistence errors', async () => {
      //* arrange
      const error = new Error('failed_persistence')
      const spy = vi
        .spyOn(globalThis.console, 'error')
        .mockImplementationOnce(() => {})
      const useStore = defineStore(key, {
        state: () => ({ lorem: '' }),
        persist: {
          storage: {
            getItem: localStorage.getItem,
            setItem: () => {
              throw error
            },
          },
          debug: true,
        },
      })

      //* act
      const store = useStore()
      store.lorem = 'ipsum'
      await nextTick()

      //* assert
      expect(spy).toHaveBeenCalledWith(error)
    })
  })

  describe('multiple persistences', () => {
    let stored1: Record<string, string>
    const storage1 = {
      getItem: vi.fn(key => stored1[key]),
      setItem: vi.fn((key, value) => {
        stored1[key] = value
      }),
    }
    let stored2: Record<string, string>
    const storage2 = {
      getItem: vi.fn(key => stored2[key]),
      setItem: vi.fn((key, value) => {
        stored2[key] = value
      }),
    }

    const useStore = defineStore(key, {
      state: () => ({
        s1: '',
        s2: '',
      }),
      persist: [
        { storage: storage1, paths: ['s1'] },
        { storage: storage2, paths: ['s2'] },
      ],
    })

    it('persists to different storages', async () => {
      stored1 = {}
      stored2 = {}
      const store = useStore()

      store.s1 = 'lorem'
      store.s2 = 'ipsum'
      await nextTick()

      expect(stored1[key]).toEqual('{"s1":"lorem"}')
      expect(stored2[key]).toEqual('{"s2":"ipsum"}')
      expect(storage1.setItem).toHaveBeenCalledWith(
        'mock-store',
        '{"s1":"lorem"}',
      )
      expect(storage2.setItem).toHaveBeenCalledWith(
        'mock-store',
        '{"s2":"ipsum"}',
      )
    })

    // it('rehydrates from different storages', () => {})
  })

  describe('$hydrate', () => {
    const beforeRestore = vi.fn()
    const afterRestore = vi.fn()
    const useStore = defineStore(key, {
      state: () => ({ lorem: '' }),
      persist: { beforeRestore, afterRestore },
    })

    it('rehydrates with storage data call', async () => {
      //* arrange
      const store = useStore()
      initializeLocalStorage(key, { lorem: 'ipsum' })
      await nextTick()

      //* act
      store.$hydrate()

      //* assert
      expect(store.lorem).toEqual('ipsum')
      expect(beforeRestore).toHaveBeenCalled()
      expect(afterRestore).toHaveBeenCalled()
      expect(localStorage.getItem).toHaveNthReturnedWith(1, undefined)
      expect(localStorage.getItem).toHaveNthReturnedWith(2, '{"lorem":"ipsum"}')
    })

    it('ignores hooks on runHooks=false', () => {
      //* arrange
      const store = useStore()
      beforeRestore.mockClear()
      afterRestore.mockClear()

      //* act
      store.$hydrate({ runHooks: false })

      //* assert
      expect(beforeRestore).not.toHaveBeenCalled()
      expect(afterRestore).not.toHaveBeenCalled()
    })
  })

  describe('$persist', () => {
    const useStore = defineStore(key, {
      state: () => ({ lorem: 'ipsum' }),
      persist: true,
    })

    it('persists store on call', () => {
      //* arrange
      const store = useStore()
      localStorage.clear()

      //* act
      store.$persist()

      //* assert
      expect(readLocalStoage(key)).toEqual({ lorem: 'ipsum' })
    })
  })
})

describe('w/ global options', () => {
  it('uses global options', async () => {
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

  it('uses key factory', async () => {
    //* arrange
    const app = createApp({})
    const pinia = createPinia()
    pinia.use(
      createPersistedState({
        key: id => `__persisted_${id}`,
      }),
    )
    app.use(pinia)
    setActivePinia(pinia)

    //* act
    const useStore = defineStore(key, {
      state: () => ({ lorem: '' }),
      persist: true,
    })
    const store = useStore()
    store.lorem = 'dolor'
    await nextTick()

    //* assert
    expect(readLocalStoage(key)).toEqual({})
    expect(readLocalStoage(`__persisted_${key}`))
      .toEqual({ lorem: 'dolor' })
  })
})
