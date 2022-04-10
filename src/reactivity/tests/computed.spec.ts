import { reactive } from "../reactive"
import { computed } from "../computed"

describe('computed', () => {
  it('happy path', () => {
    const user = reactive({
      age: 1
    })
    const age = computed(() => {
      return user.age
    })
    expect(age.value).toBe(1)
  });

  it('should compute lazily', () => {
    // lazy 懒执行 (不调用 cValue.value 我就不触发)
    const value = reactive({
      foo: 1
    })
    const getter = jest.fn(() => {
      return value.foo
    })
    const cValue = computed(getter)
    expect(getter).not.toHaveBeenCalled()

    expect(cValue.value).toBe(1)
    expect(getter).toHaveBeenCalledTimes(1)

    // 访问这个属性不应该再次触发 getter
    cValue.value
    expect(getter).toHaveBeenCalledTimes(1)

    // 修改属性 需要触发
    value.foo = 2
    expect(getter).toHaveBeenCalledTimes(1)

    // 访问这个属性不应该再次触发 getter
    cValue.value
    expect(getter).toHaveBeenCalledTimes(2)
  });
});