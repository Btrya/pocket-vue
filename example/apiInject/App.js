import { h, provide, inject } from "../../lib/guide-pocket-vue.esm.js";

// vue2 用的是一个 provide 对象字段来描述的

const Provider = {
  name: "Provider",
  setup() {
    provide("foo", "fooVal")
    provide("bar", "barVal")
  },
  render() {
    return h("div", {}, [h("p", {}, "Provider"), h(ProviderTwo)])
  }
}

const ProviderTwo = {
  name: "ProviderTwo",
  setup() {
    provide("foo", "fooTwo")
    provide("fooTwo", "fooTwoVal")
    const foo = inject("foo")
    return {
      foo
    }
  },
  render() {
    return h("div", {}, [h("p", {}, `ProviderTwo - ${this.foo}`), h(ProviderThree)])
  }
}

const ProviderThree = {
  name: "ProviderThree",
  setup() {},
  render() {
    return h("div", {}, [h("p", {}, "ProviderThree"), h(Consumer)])
  }
}

const Consumer = {
  name: "Consumer",
  setup() {
    const foo = inject("foo")
    const bar = inject("bar")
    const baz = inject("baz", "bazDefault")
    const fooTwo = inject("fooTwo")
    return {
      foo,
      bar,
      fooTwo,
      baz
    }
  },
  render() {
    return h("div", { class: 'red' }, `Consumer - ${this.foo} - ${this.fooTwo} - ${this.bar} - ${this.baz}`)
  }
}

export const App = {
  name: "App",
  setup() {},
  render() {
    return h("div", {}, [h("p", {}, "apiInject"), h(Provider)])
  },
};
