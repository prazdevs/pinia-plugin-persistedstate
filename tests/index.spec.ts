import { setActivePinia, createPinia, defineStore } from 'pinia'
import { describe, beforeEach, it, expect, vi, beforeAll } from 'vitest'
import { createApp, nextTick, ref, Vue2, isVue2, install } from 'vue-demi'

import Plugin, { StorageLike } from '../src/index'
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
      setItem: vi.fn((key, value) => { state[key] = value }),
      removeItem: vi.fn(key => delete state[key]),
      clear: vi.fn(() => { state = {} }),
    },
  })

  const app = createApp({})
  const pinia = createPinia()
  pinia.use(Plugin)
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
  const useStore = defineStore(
    key,
    () => ({ lorem: ref('') }),
    { persist: true },
  )

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
  const storage: StorageLike = {
    getItem: vi.fn(key => stored[key]),
    setItem: vi.fn((key, value) => { stored[key] = value }),
    removeItem: vi.fn(key => { delete stored[key] }),
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
})

describe('w/ hooks', () => {
  const beforeRestore = vi.fn(ctx => { ctx.store.before = 'before' })
  const afterRestore = vi.fn(ctx => { ctx.store.after = 'after' })
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
