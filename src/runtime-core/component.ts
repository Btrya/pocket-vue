import { PublicInstanceProxyHandlers } from "./componentPublicInstance"
import { initProps } from "./componentProps"
import { shallowReadonly } from "../reactivity/reactive"
import { emit } from "./componentEmit"
import { initSlots } from "./componentSlots"
import { proxyRefs } from "../reactivity"

let currentInstance = null

export function createComponentInstance(vnode, parent) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    slots: {},
    provides: parent ? parent.provides : {},
    parent,
    isMounted: false,
    subTree: {},
    next: null,
    emit: () => {}
  }
  component.emit = emit.bind(null, component) as any
  return component
}

export function setupComponent(instance) {
  initProps(instance, instance.vnode.props)
  initSlots(instance, instance.vnode.children)
  setupStatefulComponent(instance) // 初始化有状态的组件 相对于 函数式组件
}

function setupStatefulComponent(instance) {
  // component 的 options
  const Component = instance.type
  instance.proxy = new Proxy({_: instance}, PublicInstanceProxyHandlers)
  const { setup } = Component
  if (setup) {
    setCurrentInstance(instance)
    // 可能是 function / object  如果是函数就是组件的render函数 如果是object 需要注入到当前对戏那个的上下文中
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    })
    // 执行 setup 把用户定义的数据 设置给 实例的 setupState
    handleSetupResult(instance, setupResult)
    setCurrentInstance(null)
  }
}

function handleSetupResult(instance, setupResult) {
  // TODO function
  if (typeof setupResult === "object") {
    instance.setupState = proxyRefs(setupResult)
  }
  finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
  const Component = instance.type
  // template 处理
  if (compiler && !Component.render) {
    if (Component.template) {
      Component.render = compiler(Component.template)
    }
  }
  // 如果 instance 没有 render 方法 把 Component 提供给他
  if (Component.render) {
    instance.render = Component.render
  }
}

export function getCurrentInstance() {
  return currentInstance
}

export function setCurrentInstance(instance) {
  currentInstance = instance
}

let compiler

export function registerRuntimeCompiler(_compiler) {
  compiler = _compiler
}