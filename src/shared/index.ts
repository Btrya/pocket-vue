export const extend = Object.assign

export function createActiveObject(target: any, baseHandlers) {
  if (!isObject(target)) {
    console.warn(`target ${target} must be Obejct`)
    return target
  }
  return new Proxy(target, baseHandlers)
}

export function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}

export const hasChanged = (val, newValue) => {
  return !Object.is(val, newValue)
}

export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key)