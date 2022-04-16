import { h } from "../../lib/guide-pocket-vue.esm.js"

export const Child = {
  name: "Child",
  setup(props, { emit }) {},
  render(props) {
    return h("div", {}, [h("div", {}, "child - props - msg: " + this.$props.msg)])
  }
}