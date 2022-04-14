import { h, ref } from "../../lib/guide-pocket-vue.esm.js";

export const App = {
  name: "App",
  setup() {
    const count = ref(0)
    const onClick = () => {
      count.value++
    }

    const props = ref({
      foo: "foo",
      bar: "bar"
    })
    const onChangePropsDemo1 = () => {
      props.value.foo = "new-foo"
    }
    const onChangePropsDemo2 = () => {
      props.value.foo = null
    }
    const onChangePropsDemo3 = () => {
      props.value = {
        foo: "foo"
      }
    }
    return {
      count,
      onClick,
      props,
      onChangePropsDemo1,
      onChangePropsDemo2,
      onChangePropsDemo3
    };
  },
  render() {
    return h(
      "div",
      {
        id: "root",
        ...this.props
      },
      [
        h("div", {}, `count: ${this.count}`),
        h("button", { onClick: this.onClick }, "click"),
        h("div", {}, `props.foo: ${this.props.foo}, props.bar: ${this.props.bar}`),
        h("button", { onClick: this.onChangePropsDemo1 }, "changeProps - 修改"),
        h("button", { onClick: this.onChangePropsDemo2 }, "changeProps - 值变null - 删除"),
        h("button", { onClick: this.onChangePropsDemo3 }, "changeProps - 删除bar - 删除")
      ]
    )
  },
};
