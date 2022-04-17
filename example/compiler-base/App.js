import { ref } from "../../lib/guide-pocket-vue.esm.js";
export const App = {
  name: "App",
  template: "<div>hi, {{message}}, {{count}}</div>",
  setup() {
    const count = ref(1)
    window.count = count
    return {
      message: "pocket-vue",
      count
    }
  }
};
