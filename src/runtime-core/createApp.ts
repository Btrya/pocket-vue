import { createVnode } from "./vnode"

export function createAppAPI(render) {
  return function createApp(rootComponent) {
    return {
      mount(rootContainer) {
        // 1. 先转换成虚拟节点 后续所有逻辑操作基于虚拟节点处理 vnode
        const vnode = createVnode(rootComponent)
        render(vnode, rootContainer)
      }
    }
  }
}


