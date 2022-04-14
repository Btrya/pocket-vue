import { h, ref } from "../../lib/guide-pocket-vue.esm.js";
const prevChildren = "newChildren"
const nextChildren = [h("div", {}, "A"), h("div", {}, "B")]

export default {
  name: "TextToArray",
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