import { mutableHandlers, readonlyHandlers } from './baseHandlers'
import { createActiveObject } from '../shared'

export function reactive(raw) {
  return createActiveObject(raw, mutableHandlers)
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers)
}
