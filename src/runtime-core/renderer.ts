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
  const el = document.createElement(tag)
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

function mountComponet(vnode, container) {
  const instance = createComponentInstance(vnode)
  setupComponent(instance)
  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance, container) {
  // subTree 是 vnode树
  const subTree = instance.render()
  // 继续拿着 subTree 去做 patch -> vnode -> component/element -> mountComponent/mountElement -> patch...
  patch(subTree, container)
}