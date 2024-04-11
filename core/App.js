import { reactive } from "./reactivity/index.js";
import { h } from "./h.js";

export default {
  render(context) {
    // const div = document.createElement("div");
    // div.innerText = context.state.count;
    // return div;
    return h("div", {
      id: 'app-id',
    }, context.state.count);
  },
  setup() {
    const state = reactive({
      count: 0,
    });
    window.state = state;
    return { state };
  },
};