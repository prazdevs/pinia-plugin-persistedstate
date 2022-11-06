export const consoleError: typeof console.error = (...args) => {
  console.error('[PiniaPluginPersistedState] ', ...args)
}

export function safeAttachWindowEvent(
  eventName: keyof WindowEventMap,
  handler: EventListener,
  { debug }: { debug: boolean },
): void {
  const canAttachEvent = window && 'addEventListener' in window

  if (!canAttachEvent) {
    if (debug) consoleError('Cannot attach "beforeunload" event to window')

    return
  }

  window.addEventListener(eventName, handler)
}
