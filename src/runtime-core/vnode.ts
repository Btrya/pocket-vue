import { ShapeFlags } from "../shared/ShapeFlags"

export const Fragment = Symbol("Fragment")
export const Text = Symbol("Text")

export function createVnode(type, props?, children?) {
  const vnode = {
    type, 
    props, 
    children,
    component: null,
    key: props?.key,
    shapeFlag: getShapeFlag(type),
    el: null
  }
  // chilren 处理
  if (typeof children === 'string') {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
  } else if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
  }

  // 组件 + children object
  if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPOENNT) {
    if (typeof children === "object") {
      vnode.shapeFlag |= ShapeFlags.SLOT_CHILDREN
    }
  }

  return vnode
}

function getShapeFlag(type) {
  return typeof type === "string" ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPOENNT
}

export function createTextVNode(text) {
  return createVnode(Text, {}, text)
}