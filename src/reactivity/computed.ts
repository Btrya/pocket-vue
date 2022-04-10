import { ReactiveEffect } from "../reactivity/effect"

class ComputedRefImpl {
  private _getter: any
  private _dirty: boolean = true // 缓存变量 如果是 true 的时候说明有修改 需要更新 value
  private _value: any
  private _effect: any
  constructor(getter) {
    this._getter = getter
    // 利用第二个参数 scheduler 的特性，执行一次 getter 后触发 trigger 的时候只执行 scheduler
    this._effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) this._dirty = true
    })
  }
  get value() {
    if (this._dirty) {
      this._dirty = false
      this._value = this._effect.run()
    }
    return this._value
  }
}

export function computed(getter) {
  return new ComputedRefImpl(getter)
}