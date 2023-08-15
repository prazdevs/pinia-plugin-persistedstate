export const persisted_state = '__persisted-state'

declare module 'h3' {
  interface H3EventContext {
    [persisted_state]?: Record<string, any>
  }
}
