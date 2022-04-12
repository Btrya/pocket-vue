import { hasOwn } from "../shared"
// 策略模式
const publicPropertiesMap = {
  $el: (i) => i.vnode.el,
  $slots: (i) => i.slots,
}

export const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    // 从 setupState 取值
    const { setupState, props } = instance
    if (key in setupState) {
      return setupState[key]
    }
    
    if (hasOwn(setupState, key)) {
      return setupState[key]
    } else if (hasOwn(props, key)) {
      return props[key]
    }
    // 从 this.$el 获取根节点 这里 key 如果是 $el 就能拿到上边的 方法(i) => i.vnode.el
    const publicGetter = publicPropertiesMap[key]
    if (publicGetter) {
      return publicGetter(instance)
    }
  }
}