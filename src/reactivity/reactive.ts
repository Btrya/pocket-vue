import { mutableHandlers, readonlyHandlers } from './baseHandlers'
import { createActiveObject } from '../shared'

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly"
}

export function reactive(raw) {
  return createActiveObject(raw, mutableHandlers)
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers)
}

export function isReactive(obj) {
  // 当 obj 不是一个响应式的时候 由于没有 isRecvtive属性 所以会是一个undefined 这时候用 !! 把它变成一个布尔类型
  return !!obj[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(obj) {
  return !!obj[ReactiveFlags.IS_READONLY]
}