import { h, renderSlots } from "../../lib/guide-pocket-vue.esm.js"

export const Foo = {
  setup(props, { emit }) {
    return {}
  },
  render() {
    const foo = h("p", {}, "foo")
    // renderSlots 处理 数组的slots

    // 具名插槽
    // 获取元素 -> 获取到要渲染的位置

    // 作用域插槽
    const age = 18
    return h("div", {}, [renderSlots(this.$slots, "header", {
      age
    }), foo, renderSlots(this.$slots, "footer")])
  }
}