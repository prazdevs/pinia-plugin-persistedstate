import type { Store } from 'pinia'
import { pick } from 'pinia-plugin-persistedstate'
import { persisted_state } from '../constant'
import { useRequestEvent } from '#imports'

export function persistCookie(store: Store, path?: string[]) {
  const event = useRequestEvent()
  if (event) {
    const cookies = event.context[persisted_state] ??= {}
    cookies[store.$id] = path ? pick(store.$state, path) : store.$state
  }
}
