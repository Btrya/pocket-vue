import { h } from "../../lib/guide-pocket-vue.esm.js"

export const Foo = {
  setup(props, { emit }) {
    // readonly
    // props.count
    console.log(props)
    props.count++
    console.log(props)
    const emitAdd = () => {
      console.log('emitAdd')
      emit("add", 1, 2)
      // add-foo
      emit("add-foo")
    }
    return {
      emitAdd
    }
  },
  render() {
    const btn = h("button", {
      onClick: this.emitAdd
    }, "emitAdd")
    const foo = h("p", {}, "foo")
    return h("div", {}, [foo, btn])
  }
}