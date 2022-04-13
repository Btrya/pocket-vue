import { getCurrentInstance } from "./component";

// 存
export function provide(key, value) {
  const currentInstance: any = getCurrentInstance()
  if (currentInstance) {
    let { provides } = currentInstance
    const parentProvides  = currentInstance.parent.provides
    // init
    if (provides === parentProvides) {
      provides = currentInstance.provides = Object.create(parentProvides)
    }
    provides[key] = value
  }
}

// 取
export function inject(key, defaultValue) {
  const currentInstance: any = getCurrentInstance()
  if (currentInstance) {
    const parentProvides = currentInstance.parent.provides
    if (key in parentProvides) {
      return parentProvides[key]
    } else if (defaultValue) {
      if (typeof defaultValue === 'function') {
        return defaultValue()
      }
      return defaultValue
    }
  }
}