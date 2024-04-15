import { h, provide, inject } from "../../lib/guide-mini-vue.esm.js";

export const Provider = {
  name: "Provider",
  render() {
    return h("div", {}, [h("p", {}, "Provider"), h(ProviderTwo)]);
  },
  setup() {
    provide("foo", "fooVal");
    provide("bar", "barVal");
  }
}

const ProviderTwo = {
  name: "ProviderTwo",
  render() {
    return h("div", {}, [h("p", {}, `providerTow foo: ${this.foo}`), h(Consumer)]);
  },
  setup() {
    provide("foo", "fooValTwo");
    const foo = inject("foo");
    return {
      foo
    };
  },
};

const Consumer = {
  name: "Consumer",
  setup() {
    const foo = inject("foo");
    const bar = inject("bar");
    return {
      foo,
      bar
    };
  },
  render() {
    return h("div", {}, [h("p", {}, `foo: ${this.foo}, bar: ${this.bar}`)]);
  }
}
