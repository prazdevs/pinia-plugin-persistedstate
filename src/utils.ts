export const consoleError: typeof console.error = (...args) => {
  console.error('[PiniaPluginPersistedState] ', ...args)
}

export const consoleWarn: typeof console.error = (...args) => {
  console.warn('[PiniaPluginPersistedState] ', ...args)
}

export const consoleInfo: typeof console.error = (...args) => {
  console.info('[PiniaPluginPersistedState] ', ...args)
}
