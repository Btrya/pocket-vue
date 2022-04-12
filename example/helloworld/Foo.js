import { h } from "../../lib/guide-pocket-vue.esm.js"

export const foo = {
  setup(props) {
    // readonly
    // props.count
    console.log(props)
    props.count++
    console.log(props)
  },
  render() {
    return h("div", {}, "foo: " + this.count)
  }
}