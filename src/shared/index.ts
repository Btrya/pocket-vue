export const extend = Object.assign

export function createActiveObject(raw: any, baseHandlers) {
  return new Proxy(raw, baseHandlers)
}

export function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}