import { h, ref } from "../../lib/guide-pocket-vue.esm.js";
const nextChildren = "newChildren"
const prevChildren = [h("div", {}, "A"), h("div", {}, "B")]

export default {
  name: "ArrayToText",
  setup() {
    const isChange = ref(false)
    window.isChange = isChange
    return {
      isChange
    }
  },
  render() {
    const self = this
    return h("div", {}, self.isChange === true ? nextChildren : prevChildren)
    // return self.isChange === true ? h("div", {}, nextChildren) : h("div", {}, prevChildren)
  }
}