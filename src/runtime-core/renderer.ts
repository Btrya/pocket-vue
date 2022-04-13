import { ShapeFlags } from "../shared/ShapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { Fragment, Text } from "./vnode"

export function render(vnode, container) {
  // 调用 patch 方便后续递归
  patch(vnode, container)
}

function patch(vnode, container) {
  // 处理组件 / element
  // element
  const { type, shapeFlag } = vnode

  // Fragment -> 只渲染 children
  switch(type) {
    case Fragment:
      processFragment(vnode, container)
      break;
    case Text:
      processText(vnode, container)
      break;
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container)
        // STATEFUL_COMPONENT
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPOENNT) {
        processComponent(vnode, container)
      }
      break;
  }
}

function processText(vnode, container) {
  const { children } = vnode
  const textNode = vnode.el =  document.createTextNode(children)
  container.append(textNode)
}

function processFragment(vnode, container) {
  // Implement
  mountChildren(vnode, container)
}

function processElement(vnode, container) {
  mountElement(vnode, container)
}

function mountElement(vnode, container) {
  const { children, type: tag, props, shapeFlag } = vnode
  const el = vnode.el = document.createElement(tag)
  // string array
  // children_string
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children
    // children_array
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el)
  }
  for (const key in props) {
    const val = props[key]
    const isOn = (key: string) => /^on[A-Z]/.test(key)
    if (isOn(key)) {
      const event = key.slice(2).toLocaleLowerCase()
      el.addEventListener(event, val)
    } else {
      el.setAttribute(key, val)
    }
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