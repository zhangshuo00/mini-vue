import { h } from "../../lib/guide-mini-vue.esm.js";

export const Foo = {
  setup(props, { emit }) {
    const emitAdd = () => {
      console.log("emit");
      emit("add");
    };

    return {
      emitAdd,
    };
  },
  render() {
    const btn = h("button", {
      onClick: this.emitAdd
    }, "emitAdd")
    return h("div", {}, [foo, btn]);
  },
};