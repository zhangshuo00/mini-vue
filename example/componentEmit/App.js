import { h } from "../../lib/guide-mini-vue.esm.js";
import {Foo} from "./Foo.js";

export const App = {
  name: "App",
  render() {
    return h('div', {}, [h("div", {}, "app"), h(Foo, {
      // on + Event
      onAdd() {
        console.log("onAdd");
      }
    })]);
  },
  setup() {
    return {};
  }
}