import { h } from "../../lib/guide-pocket-vue.esm.js"

window.self = null
export const App = {
  // .vue
  // <template></template>
  // render
  // 假设必须给 render
  render() {
    window.self = this
    return h(
      "div", {
        id: "root",
        class: "red flex"
      }, 
      "hi, " + this.msg
      // [h("p", { class: "red test" }, "hi"), h("p", { class: "blue" }, "pocket-vue")]
    )
  },
  setup() {
    // composition api
    return { 
      msg: "pocket-vue"
    }
  }
}