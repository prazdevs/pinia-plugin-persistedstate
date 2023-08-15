import { persisted_state } from '../constant'
import { defineNitroPlugin } from '#imports'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:response', (_, { event }) => {
    const cookies = event.context[persisted_state] ?? {}
    const id_list = Object.keys(cookies)
    for (const id of id_list)
      setCookie(event, id, JSON.stringify(cookies[id]))
  })
})
