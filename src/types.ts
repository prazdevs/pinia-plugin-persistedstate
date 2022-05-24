import { PiniaPluginContext, StateTree } from 'pinia'

import type { Ref } from 'vue'

interface CookieOptions<T> {
  decode?(value: string): T
  encode?(value: T): string
  domain?: string
  expires?: Date
  httpOnly?: boolean
  maxAge?: number
  sameSite?: boolean | 'lax' | 'strict' | 'none'
  secure?: boolean
  default?: () => T | Ref<T>
}

export type UseCookie<T = string> = (
  name: string,
  opts?: CookieOptions<T>,
) => { value: T }

export type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

export type LocalStore = {
  state: StateTree
  expiresAt: number | null
}

export interface Serializer {
  /**
   * Serializes state into string before storing
   * @default JSON.stringify
   */
  serialize: (value: StateTree) => string

  /**
   * Deserializes string into state before hydrating
   * @default JSON.parse
   */
  deserialize: (value: string) => StateTree
}

export interface PersistedStateOptions {
  /**
   * Storage key to use.
   * @default $store.id
   */
  key?: string

  /**
   * Where to store persisted state.
   * @default localStorage
   */
  storage?: StorageLike

  /**
   * Dot-notation paths to partially save state.
   * @default undefined
   */
  paths?: Array<string>

  /**
   * For how long to keep the state (seconds).
   * @default undefined
   */
  expiresIn?: number

  /**
   * Serializer to use
   */
  serializer?: Serializer

  /**
   * Hook called before state is hydrated from storage.
   * @default undefined
   */
  beforeRestore?: (context: PiniaPluginContext) => void

  /**
   * Hook called after state is hydrated from storage.
   * @default undefined
   */
  afterRestore?: (context: PiniaPluginContext) => void
}

export type PersistedStateFactoryOptions = Pick<
  PersistedStateOptions,
  'storage' | 'serializer' | 'afterRestore' | 'beforeRestore'
>

export type PersistedStateNuxtFactoryOptions = Omit<
  PersistedStateFactoryOptions,
  'storage'
> & { cookieOptions?: CookieOptions<string> }
