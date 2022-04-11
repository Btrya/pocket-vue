import { isObject } from "../shared"
import { createComponentInstance, setupComponent } from "./component"

export function render(vnode, container) {
  // 调用 patch 方便后续递归
  patch(vnode, container)
}

function patch(vnode, container) {
  // 处理组件 / element
  if (typeof vnode.type === "string") {
    processElement(vnode, container)
  } else if (isObject(vnode.type)) {
    processComponent(vnode, container)
  }
}

function processElement(vnode, container) {
  mountElement(vnode, container)
}

function mountElement(vnode, container) {
  const { children, type: tag, props } = vnode
  const el = vnode.el = document.createElement(tag)
  // string array
  if (typeof children === "string") {
    el.textContent = children
  } else if (Array.isArray(children)) {
    mountChildren(vnode, el)
  }
  for (const key in props) {
    const val = props[key]
    el.setAttribute(key, val)
  }
  container.append(el)
}

function mountChildren(vnode, container) {
  vnode.children.forEach((v) => {
    patch(v, container)
  })
}

/**
 * Component
 */
function processComponent(vnode, container) {
  mountComponet(vnode, container)
}

function mountComponet(initialVnode, container) {
  const instance = createComponentInstance(initialVnode)
  setupComponent(instance)
  setupRenderEffect(instance, initialVnode, container)
}

function setupRenderEffect(instance, initialVnode, container) {
  const { proxy } = instance
  // 拿到 instance proxy， get 已经被处理过了 会返回 setupState 的
  // subTree 是 vnode树
  const subTree = instance.render.call(proxy)
  // 继续拿着 subTree 去做 patch -> vnode -> component/element -> mountComponent/mountElement -> patch...
  patch(subTree, container)
  // element 根节点 的 el
  // instance.vnode.el 可以吗？
  initialVnode.el = subTree.el
}