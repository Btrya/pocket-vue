import { effect } from "../reactivity/effect"
import { EMPTY_OBJ } from "../shared"
import { ShapeFlags } from "../shared/ShapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { shouldUpdateComponent } from "./componentUpdateUtils"
import { createAppAPI } from "./createApp"
import { queueJobs } from "./shceduler"
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
    patch(null, vnode, container, null, null)
  }
  // n1 -> prevSubTree !n1 must be init
  // n2 -> newSubTree
  function patch(n1, n2, container, parentComponent, anchor) {
    // 处理组件 / element
    // element
    const { type, shapeFlag } = n2
    
    // Fragment -> 只渲染 children
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent, anchor)
        break
      case Text:
        processText(n1, n2, container)
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent, anchor)
          // STATEFUL_COMPONENT
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent, anchor)
        }
        break
    }
  }

  function processText(n1, n2, container) {
    const { children } = n2
    const textNode = (n2.el = document.createTextNode(children))
    container.append(textNode)
  }

  function processFragment(n1, n2, container, parentComponent, anchor) {
    // Implement
    mountChildren(n2.children, container, parentComponent, anchor)
  }

  function processElement(n1, n2, container, parentComponent, anchor) {
    // 没有 n1 代表是初始化
    if (!n1) {
      mountElement(n2, container, parentComponent, anchor)
    } else {
      patchElement(n1, n2, container, parentComponent, anchor)
    }
  }

  // 不是初始化 要比较更新
  function patchElement(n1, n2, container, parentComponent, anchor) {
    const oldProps = n1.props || EMPTY_OBJ
    const newProps = n2.props || EMPTY_OBJ
    const el = n2.el = n1.el
    patchChildren(n1, n2, el, parentComponent, anchor)
    patchProps(el, oldProps, newProps)
  }

  function patchChildren(n1, n2, container, parentComponent, anchor) {
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
        mountChildren(c2, container, parentComponent, anchor)
      } else {
        // array 2 array
        patchKeyedChildren(c1, c2, container, parentComponent, anchor)
      }
    }
  }

  function patchKeyedChildren(c1, c2, container, parentComponent, parentAnchor) {
    let i = 0
    const l2 = c2.length // 新节点的数量
    let e1 = c1.length - 1
    let e2 = l2 - 1


    function isSameVNodeType(n1, n2) {
      // 根据节点的类型(标签) 和 设置的key比较
      return n1.type === n2.type && n1.key === n2.key
    }
    // 左侧
    while(i <= e1 && i <= e2) {
      const n1 = c1[i]
      const n2 = c2[i]
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor)
      } else {
        break
      }
      i++
    }

    // 右侧
    while(i <= e1 && i <= e2) {
      const n1 = c1[e1]
      const n2 = c2[e2]
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor)
      } else {
        break
      }
      e1--
      e2--
    }

    // 3. 新的比老的多 需要创建
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1
        const anchor = e2 + 1 < l2 ? c2[nextPos].el : null
        while(i <= e2) {
          patch(null, c2[i], container, parentComponent, anchor)
          i++
        }
      }
    } else if (i > e2) {
      while(i <= e1) {
        hostRemove(c1[i].el)
        i++
      }
    } else {
      // 中间对比
      let s1 = i
      let s2 = i
      const toBePatched = e2 - s2 + 1 // 中间区域的节点数量
      let patched = 0
      // 建立映射
      const keyToNewIndexMap = new Map()
      const newIndexToOldIndexMap = new Array(toBePatched).fill(0)
      let moved = false
      let maxNewIndexSoFar = 0
      // for (let i = 0; i < toBePatched; ++i) newIndexToOldIndexMap[i] = 0
      for (let i = s2; i <= e2; ++i) {
        const nextChild = c2[i]
        keyToNewIndexMap.set(nextChild.key, i)
      }

      for (let i = s1; i <= e1; ++i) {
        const prevChild = c1[i]
        if (patched >= toBePatched) {
          hostRemove(prevChild.el) 
          continue
        }
        
        let newIndex;
        if (prevChild.key !== null) {
          newIndex = keyToNewIndexMap.get(prevChild.key)
        } else {
          for (let j = s2; j <= e2; ++j) {
            if (isSameVNodeType(prevChild, c2[j])) {
              newIndex = j
              break
            }
          }
        }

        if (newIndex === undefined) {
          hostRemove(prevChild.el)
        } else {
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar= newIndex
          } else {
            moved = true
          }
          newIndexToOldIndexMap[newIndex - s2] = i + 1 // 避免 i === 0 的情况
          patch(prevChild, c2[newIndex], container, parentComponent, null)
          patched++
        }
      }

      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : []
      let j = increasingNewIndexSequence.length - 1

      for (let i = toBePatched - 1; i >= 0; --i) {
        const nextIndex = i + s2
        const nextChild = c2[nextIndex]
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : null
        if (newIndexToOldIndexMap[i] === 0) {
          patch(null, nextChild, container, parentComponent, anchor)
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            hostInsert(nextChild.el, container, anchor)
          } else {
            j--
          }
        }
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

  function mountElement(vnode, container, parentComponent, anchor) {
    const { children, type: tag, props, shapeFlag } = vnode
    const el = (vnode.el = hostCreateElement(tag))
    // string array
    // children_string
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children
      // children_array
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode.children, el, parentComponent, anchor)
    }
    for (const key in props) {
      const val = props[key]
      hostPatchProp(el, key, null, val)
    }
    // container.append(el)
    hostInsert(el, container, anchor)
  }

  function mountChildren(children, container, parentComponent, anchor) {
    children.forEach((v) => {
      patch(null, v, container, parentComponent, anchor)
    })
  }

  /**
   * Component
   */
  function processComponent(n1, n2, container, parentComponent, anchor) {
    if (!n1) {
      mountComponet(n2, container, parentComponent, anchor)
    } else {
      updateComponent(n1, n2)
    }
  }

  function updateComponent(n1, n2) {
    const instance = n2.component = n1.component
    if (shouldUpdateComponent(n1, n2)) {
      instance.next = n2
      instance.update()
    } else {
      // 不涉及props修改 老的el还是要拿到新的el
      n2.el = n1.el
      n2.vnode = n2
    }
  }

  function mountComponet(initialVnode, container, parentComponent, anchor) {
    const instance = initialVnode.component = createComponentInstance(initialVnode, parentComponent)
    setupComponent(instance)
    setupRenderEffect(instance, initialVnode, container, anchor)
  }

  function setupRenderEffect(instance, initialVnode, container, anchor) {
    instance.update = effect(() => {
      if (!instance.isMounted) {
        // init
        const { proxy } = instance
        // 拿到 instance proxy， get 已经被处理过了 会返回 setupState 的
        // subTree 是 vnode树
        const subTree = (instance.subTree = instance.render.call(proxy, proxy))
        // 继续拿着 subTree 去做 patch -> vnode -> component/element -> mountComponent/mountElement -> patch...
        patch(null, subTree, container, instance, anchor)
        // element 根节点 的 el
        // instance.vnode.el 可以吗？
        initialVnode.el = subTree.el
        instance.isMounted = true
      } else {
        // update
        // 需要一个新的虚拟节点 next
        const { proxy, next, vnode } = instance
        if (next) {
          next.el = vnode.el
          updateComponentPreRender(instance, next)
        }
        const subTree = instance.render.call(proxy, proxy)
        const prevSubTree = instance.subTree
        instance.subTree = subTree
        patch(prevSubTree, subTree, container, instance, anchor)
      }
    }, {
      scheduler() {
        queueJobs(instance.update)
      }
    })
  }

  function updateComponentPreRender(instance, nextVNode) {
    instance.vnode = nextVNode
    instance.next = null
    instance.props = nextVNode.props
  }

  function getSequence(arr) {
    const p = arr.slice()
    const result = [0]
    let i, j, u, v, c
    const len = arr.length
    for (let i = 0; i < len; ++i) {
      const arrI = arr[i]
      if (arrI !== 0) {
        j = result[result.length - 1]
        if (arr[j] < arrI) {
          p[i] = j
          result.push(i)
          continue
        }
        u = 0
        v = result.length - 1
        while (u < v) {
          c = (u + v) >> 1
          if (arr[result[c]] < arrI) {
            u = c + 1
          } else {
            v = c
          }
        }
        if (arrI < arr[result[u]]) {
          if (u > 0) {
            p[i] = result[u - 1]
          }
          result[u] = i
        }
      }
    }
    u = result.length
    v = result[u - 1]
    while (u-- > 0) {
      result[u] = v
      v = p[v]
    }
    return result
  }

  return {
    createApp: createAppAPI(render),
  }
}
