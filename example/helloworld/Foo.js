import { h } from "../../lib/guide-pocket-vue.esm.js"

export const Foo = {
  setup() {

  },
  render() {
    const foo = h("p", {}, "foo")
    return h("div", {}, [foo])
  }
}