export * from "./toDisplayString"

export const extend = Object.assign

export const EMPTY_OBJ = {}

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

export function isString(val) {
  return typeof val === 'string'
}

export const hasChanged = (val, newValue) => {
  return !Object.is(val, newValue)
}

export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key)

// add -> Add
// add-foo -> addFoo
export const camelize = (str) => {
  return str.replace(/-(\w)/g, (_, c: string) => {
    return c ? c.toUpperCase() : ""
  })
}
const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
export const toHandlerKey = (str) => {
  return str ? "on" + capitalize(str) : ""
}