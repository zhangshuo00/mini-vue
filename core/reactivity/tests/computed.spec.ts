import {reactive} from "../reactive";
import {computed} from "../computed";

describe("computed", () => {
  it('happy path', function () {
    const user = reactive({
      age: 10,
    });

    const age = computed(() => {
      return user.age
    });

    expect(age.value).toBe(10)
  });

  it('should lazy', function () {
    const user = reactive({
      age: 10,
    });

    const getter = jest.fn(() => {
      return user.age
    })

    const age = computed(getter);
    expect(getter).not.toHaveBeenCalled()

    expect(age.value).toBe(10)
    expect(getter).toHaveBeenCalledTimes(1)

    age.value;
    expect(getter).toHaveBeenCalledTimes(1)

    user.age = 20
    expect(getter).toHaveBeenCalledTimes(1)
    expect(age.value).toBe(20)
  });
})
