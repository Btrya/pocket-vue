import { effect } from "../reactivity/effect"
import { EMPTY_OBJ } from "../shared"
import { ShapeFlags } from "../shared/ShapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { createAppAPI } from "./createApp"
import { Fragment, Text } from "./vnode"

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText
  } = options
  function render(vnode, container) {
    // 调用 patch 方便后续递归
    patch(null, vnode, container, null)
  }
  // n1 -> prevSubTree !n1 must be init
  // n2 -> newSubTree
  function patch(n1, n2, container, parentComponent) {
    // 处理组件 / element
    // element
    const { type, shapeFlag } = n2

    // Fragment -> 只渲染 children
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent)
        break
      case Text:
        processText(n1, n2, container)
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent)
          // STATEFUL_COMPONENT
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPOENNT) {
          processComponent(n1, n2, container, parentComponent)
        }
        break
    }
  }

  function processText(n1, n2, container) {
    const { children } = n2
    const textNode = (n2.el = document.createTextNode(children))
    container.append(textNode)
  }

  function processFragment(n1, n2, container, parentComponent) {
    // Implement
    mountChildren(n2.children, container, parentComponent)
  }

  function processElement(n1, n2, container, parentComponent) {
    // 没有 n1 代表是初始化
    if (!n1) {
      mountElement(n2, container, parentComponent)
    } else {
      patchElement(n1, n2, container, parentComponent)
    }
  }

  // 不是初始化 要比较更新
  function patchElement(n1, n2, container, parentComponent) {
    const oldProps = n1.props || EMPTY_OBJ
    const newProps = n2.props || EMPTY_OBJ
    const el = n2.el = n1.el
    patchChildren(n1, n2, el, parentComponent)
    patchProps(el, oldProps, newProps)
  }

  function patchChildren(n1, n2, container, parentComponent) {
    const prevShapeFlag = n1.shapeFlag
    const { shapeFlag } = n2
    const c1 = n1.children
    const c2 = n2.children
    // 新的值是 text， 只要不同那肯定要修改的
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 1.老的 children 清空 
        unmountChildren(n1.children)
      }
      // 2.设置 text
      if (c1 !== c2) {
        hostSetElementText(container, c2)
      }
    } else {
      // 新的值是数组
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        // 1.老的 text 清空 
        hostSetElementText(container, "")
        mountChildren(c2, container, parentComponent)
      }
    }
  }

  function unmountChildren(children) {
    for (let i = 0; i < children.length; ++i) {
      const el = children[i].el
      // remove
      hostRemove(el)
    }
  }

  function patchProps(el, oldProps, newProps) {
    if (oldProps === newProps) return
    for (const key in newProps) {
      const prevProp = oldProps[key]
      const nextProp = newProps[key]
      if (prevProp !== nextProp) {
        hostPatchProp(el, key, prevProp, nextProp)
      }
    }
    if (oldProps !== EMPTY_OBJ) {
      for (const key in oldProps) {
        if (!(key in newProps)) {
          hostPatchProp(el, key, oldProps[key], null)
        }
      }
    }
  }

  function mountElement(vnode, container, parentComponent) {
    const { children, type: tag, props, shapeFlag } = vnode
    const el = (vnode.el = hostCreateElement(tag))
    // string array
    // children_string
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children
      // children_array
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode.children, el, parentComponent)
    }
    for (const key in props) {
      const val = props[key]
      hostPatchProp(el, key, null, val)
    }
    // container.append(el)
    hostInsert(el, container)
  }

  function mountChildren(children, container, parentComponent) {
    children.forEach((v) => {
      patch(null, v, container, parentComponent)
    })
  }

  /**
   * Component
   */
  function processComponent(n1, n2, container, parentComponent) {
    mountComponet(n1, n2, container, parentComponent)
  }

  function mountComponet(n1, initialVnode, container, parentComponent) {
    const instance = createComponentInstance(initialVnode, parentComponent)
    setupComponent(instance)
    setupRenderEffect(instance, initialVnode, container)
  }

  function setupRenderEffect(instance, initialVnode, container) {
    effect(() => {
      if (!instance.isMounted) {
        // init
        const { proxy } = instance
        // 拿到 instance proxy， get 已经被处理过了 会返回 setupState 的
        // subTree 是 vnode树
        const subTree = (instance.subTree = instance.render.call(proxy))
        // 继续拿着 subTree 去做 patch -> vnode -> component/element -> mountComponent/mountElement -> patch...
        patch(null, subTree, container, instance)
        // element 根节点 的 el
        // instance.vnode.el 可以吗？
        initialVnode.el = subTree.el
        instance.isMounted = true
      } else {
        // update
        const { proxy } = instance
        const subTree = instance.render.call(proxy)
        const prevSubTree = instance.subTree
        instance.subTree = subTree
        patch(prevSubTree, subTree, container, instance)
      }
    })
  }

  return {
    createApp: createAppAPI(render),
  }
}
