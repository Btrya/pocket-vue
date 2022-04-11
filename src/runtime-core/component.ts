export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {}
  }
  return component
}

export function setupComponent(instance) {
  initProps()
  initSlots()
  setupStatefulComponent(instance) // 初始化有状态的组件 相对于 函数式组件
}

function initProps() {

}

function initSlots() {

}

function setupStatefulComponent(instance) {
  // component 的 options
  const Component = instance.type
  instance.proxy = new Proxy({}, {
    get(target, key) {
      // 从 setupState 取值
      const { setupState } = instance
      if (key in setupState) {
        return setupState[key]
      }
      // 从 this.$el 取值
    }
  })
  const { setup } = Component
  if (setup) {
    // 可能是 function / object  如果是函数就是组件的render函数 如果是object 需要注入到当前对戏那个的上下文中
    const setupResult = setup()
    // 执行 setup 把用户定义的数据 设置给 实例的 setupState
    handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult(instance, setupResult) {
  // TODO function
  if (typeof setupResult === "object") {
    instance.setupState = setupResult
  }
  finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
  const Component = instance.type
  // 如果 instance 没有 render 方法 把 Component 提供给他
  if (Component.render) {
    instance.render = Component.render
  }
}