import { h } from "../../lib/guide-pocket-vue.esm.js"
import { foo } from "./Foo.js"

window.self = null
export const App = {
  // .vue
  // <template></template>
  // render
  // 假设必须给 render
  name: "App",
  render() {
    window.self = this
    return h(
      "div", {
        id: "root",
        class: "red flex",
        onClick() {
          console.log('click')
        }
      }, 
      [h("div", {}, "hi, " + this.msg), h(foo, {
        count: 1
      })]
      // "hi, " + this.msg
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