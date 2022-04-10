import { reactive } from "./reactive";
import { trackEffects, triggerEffects, isTracking } from "./effect"
import { isObject, hasChanged } from '../shared/index'

class RefImpl {
  private _rawValue: any
  private _value: any
  public dep
  public __v_isRef = true
  constructor(value) {
    this._rawValue = value
    // 如果 value 是对象 需要处理成 reactive
    this._value = convert(value)
    this.dep = new Set()
  }
  get value() {
    trackRefValue(this)
    return this._value
  }
  set value(newValue) {
    // 语义化 Obejct.js
    if (!hasChanged(this._rawValue, newValue)) return
    // 一定是先修改 value 再去 调用 trigger的
    this._rawValue = newValue
    this._value = convert(newValue)
    triggerEffects(this.dep)
  }
}

// 判断新值是不是对象 是的话要reactive 一下，否则直接给
function convert(value) {
  return isObject(value) ? reactive(value) : value
}

// ref get 依赖收集
function trackRefValue(ref) {
  if (isTracking()) trackEffects(ref.dep)
}

export function ref(value) {
  return new RefImpl(value)
}

// 判断是不是一个 ref
export function isRef(ref) {
  return !!ref.__v_isRef
}

// 是 ref 返回 ref.value 否则 直接返回
export function unRef(ref) {
  return isRef(ref) ? ref.value : ref
}