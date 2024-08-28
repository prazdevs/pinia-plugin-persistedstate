import type { StorageLike } from '../types'
import { useCookie } from '#app'

const localStorage: StorageLike = {
  getItem: key => import.meta.client ? window.localStorage.getItem(key) : null,
  setItem: (key, value) => import.meta.client ? window.localStorage.setItem(key, value) : null,
}

const sessionStorage: StorageLike = {
  getItem: key => import.meta.client ? window.sessionStorage.getItem(key) : null,
  setItem: (key, value) => import.meta.client ? window.sessionStorage.setItem(key, value) : null,
}

const cookies: StorageLike = {
  getItem: key => useCookie<string | null>(key, { readonly: true, decode: decodeURIComponent }).value,
  setItem: (key, value) => useCookie<string>(key, { encode: encodeURIComponent }).value = value,
}

export const storages = {
  localStorage,
  sessionStorage,
  cookies,
}
