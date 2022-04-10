import { extend } from '../shared/index'

let activeEffect // 保存当前正在执行的 effect
let shouldTrack
export class ReactiveEffect{
  private _fn: any
  deps = [] // 反向收集 set 数组
  active = true // 是否清空过
  onStop?: () => void // onStop hooks
  constructor(fn, public scheduler?) {
    this._fn = fn
  }
  run() {
    if (!this.active) return this._fn()
    // 收集
    activeEffect = this
    shouldTrack = true
    const result = this._fn()
    // reset
    shouldTrack = false
    return result
  }
  stop() {
    if (this.active) {
      cleanupEffect(this)
      this.active = false
    }
    if (this.onStop) this.onStop()
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  })
  effect.deps.length = 0
}

// 最外层用来保存每一个 target 的 weakMap
const targetMap = new WeakMap()
/**
 * get 依赖收集函数
 * @param target 传入的对象
 * @param key 对应属性的 key
 */
export function track(target, key) {
  // 没有 effect || 不应该 track  直接 return
  if (!isTracking()) return
  // 拿到当前 target 对应的 map (每个对应的 target 底下应该保存着自己的 key 的 map)
  let depsMap = targetMap.get(target)
  // 拿不到，说明需要新建一个 map 并存入 weakMap
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  // 拿到当前 key 的对应的 set (每个对应 key 底下应该保存着自己的 set， set里边是所有的依赖 effect)
  let dep = depsMap.get(key)
  // 拿不到，说明需要创建一个新的 set 并存入对应的 map
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }
  trackEffects(dep)
}

export function trackEffects(dep) {
  // 已经在 dep 中就不用 add 了
  if (dep.has(activeEffect)) return
  dep.add(activeEffect) // 把对应的 effect 实例加入 set 里
  activeEffect.deps.push(dep)
}

export function isTracking() { 
  return shouldTrack && activeEffect !== undefined
}

/**
 * set 触发依赖
 * @param target 传入的对象
 * @param key 对应属性的 key
 */
export function trigger(target, key) {
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)
  triggerEffects(dep)
}

export function triggerEffects(dep) {
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}

export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  // options 处理
  // 优化：_effect.onStop = options.onStop
  // extned 语义化处理 options 
  // 再优化： Object.assign(_effect, options)
  extend(_effect, options)
  _effect.run()
  // run 函数内部涉及 activeEffect 的赋值 (activeEffect = this) 所以这里应该bind一下
  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}

export function stop(runner) {
  runner.effect.stop()
}