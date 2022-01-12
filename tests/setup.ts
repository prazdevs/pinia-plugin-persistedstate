/* eslint-disable @typescript-eslint/ban-ts-comment */

// yoinked from https://github.com/vueuse/vueuse/blob/main/packages/.test/index.ts

import { beforeEach, vi } from 'vitest'
import { install, isVue2, Vue2 } from 'vue-demi'

if (isVue2) {
  // @ts-ignore
  Vue2.config.productionTip = false
  // @ts-ignore
  Vue2.config.devtools = false

  install(Vue2)
}

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
})
