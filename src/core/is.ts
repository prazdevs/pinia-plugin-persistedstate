export const isArray = Array.isArray.bind(Array)

export function isObject(v: unknown): v is object {
  return typeof v === 'object' && v !== null
}

export function isUndefined(v: unknown): v is undefined {
  return v === undefined
}
