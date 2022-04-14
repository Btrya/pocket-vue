import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";

export function createRenderer(options) {
  const { createElement: hostCreateElement, patchProp: hostPatchProp, insert: hostInsert } = options;
  function render(vnode, container) {
    // 调用 patch 方便后续递归
    patch(vnode, container, null);
  }

  function patch(vnode, container, parentComponent) {
    // 处理组件 / element
    // element
    const { type, shapeFlag } = vnode;

    // Fragment -> 只渲染 children
    switch (type) {
      case Fragment:
        processFragment(vnode, container, parentComponent);
        break;
      case Text:
        processText(vnode, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(vnode, container, parentComponent);
          // STATEFUL_COMPONENT
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPOENNT) {
          processComponent(vnode, container, parentComponent);
        }
        break;
    }
  }

  function processText(vnode, container) {
    const { children } = vnode;
    const textNode = (vnode.el = document.createTextNode(children));
    container.append(textNode);
  }

  function processFragment(vnode, container, parentComponent) {
    // Implement
    mountChildren(vnode, container, parentComponent);
  }

  function processElement(vnode, container, parentComponent) {
    mountElement(vnode, container, parentComponent);
  }

  function mountElement(vnode, container, parentComponent) {
    const { children, type: tag, props, shapeFlag } = vnode;
    const el = (vnode.el = hostCreateElement(tag));
    // string array
    // children_string
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
      // children_array
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode, el, parentComponent);
    }
    for (const key in props) {
      const val = props[key];
      hostPatchProp(el, key, val);
    }
    // container.append(el)
    hostInsert(el, container);
  }

  function mountChildren(vnode, container, parentComponent) {
    vnode.children.forEach((v) => {
      patch(v, container, parentComponent);
    });
  }

  /**
   * Component
   */
  function processComponent(vnode, container, parentComponent) {
    mountComponet(vnode, container, parentComponent);
  }

  function mountComponet(initialVnode, container, parentComponent) {
    const instance = createComponentInstance(initialVnode, parentComponent);
    setupComponent(instance);
    setupRenderEffect(instance, initialVnode, container);
  }

  function setupRenderEffect(instance, initialVnode, container) {
    const { proxy } = instance;
    // 拿到 instance proxy， get 已经被处理过了 会返回 setupState 的
    // subTree 是 vnode树
    const subTree = instance.render.call(proxy);
    // 继续拿着 subTree 去做 patch -> vnode -> component/element -> mountComponent/mountElement -> patch...
    patch(subTree, container, instance);
    // element 根节点 的 el
    // instance.vnode.el 可以吗？
    initialVnode.el = subTree.el;
  }

  return {
    createApp: createAppAPI(render)
  }
}
