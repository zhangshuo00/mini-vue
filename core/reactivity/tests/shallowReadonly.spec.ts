import {isReadonly, shallowReadonly} from "../reactive";

describe("shallowReadonly", () => {
  test("should not make non-reactive", () => {
    const props = shallowReadonly({n: {foo: 1}})
    expect(isReadonly(props)).toBe(true)
    expect(isReadonly(props.n)).toBe(false)
  })
})
