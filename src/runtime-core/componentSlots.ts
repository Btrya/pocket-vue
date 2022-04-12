import { ShapeFlags } from "../shared/ShapeFlags"

export function initSlots(instance, children) {
  // instance.slots = Array.isArray(children) ? children : [children]
  const { vnode } = instance
  if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
    normalizeObjectSlots(children, instance.slots)
  }
}

function normalizeObjectSlots(children, slots) {
  for (const key in children) {
    const value = children[key]
    // 这里value 已经是一个函数了
    slots[key] = (props) => normalizeSlotValue(value(props))
  }
}

function normalizeSlotValue(value) {
  return Array.isArray(value) ? value : [value]
}