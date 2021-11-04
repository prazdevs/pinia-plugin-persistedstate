/* eslint-disable @typescript-eslint/ban-ts-comment */

// yoinked from https://github.com/vueuse/vueuse/blob/main/packages/.test/index.ts

import { install, isVue2, Vue2 } from 'vue-demi'

if (isVue2) {
  // @ts-ignore
  Vue2.config.productionTip = false
  // @ts-ignore
  Vue2.config.devtools = false

  install(Vue2)
}

let state: Record<string, string> = {}

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(key => state[key]),
    setItem: jest.fn((key, value) => { state[key] = value }),
    removeItem: jest.fn(key => delete state[key]),
    clear: jest.fn(() => { state = {} }),
  },
})
