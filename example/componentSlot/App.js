import { h, createTextVNode } from "../../lib/guide-pocket-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  name: "App",
  render() {
    const app = h("div", {}, "App")
    // const foo = h(Foo, {}, h("p", {}, "123"))
    const foo = h(Foo, {}, {
      header: ({ age }) => [
        h("p", {}, "header" + age), 
        createTextVNode("你好"),
        h("p", {}, "center"), 
        createTextVNode("你好啊")
      ],
      footer: () => h("p", {}, "footer")
    })
    return h("div", {}, [app, foo])
  },
  setup() {
    return {}
  },
};
