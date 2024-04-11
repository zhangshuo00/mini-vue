import { h } from "../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";

window.self = null;
export const App = {
  name: "App",
  render() {
    window.self = this;
    return h(
      'div',
      {
        id: "root",
        class: ["red"],
        onClick() {
          console.log("click");
        },
        // onMousedown() {
        //   console.log("mousedown");
        // }
      },
      [
        h("div", {}, "hi," + this.msg),
        h(Foo, {
          count: 1,
        }),
      ]
    )
  },
  setup() {
    return {
      msg: 'mini-vue'
    }
  }
}
