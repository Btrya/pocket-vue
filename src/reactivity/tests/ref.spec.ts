import { effect } from '../effect'
import { reactive } from '../reactive'
import { ref, isRef, unRef, proxyRefs } from '../ref'
describe('ref', () => {
  it('happy path', () => {
    const a = ref(1)
    expect(a.value).toBe(1)
  });

  it('should be reactive', () => {
    const a = ref(1)
    let dummy
    let calls = 0
    effect(() => {
      calls++
      dummy = a.value
    })
    expect(calls).toBe(1)
    expect(dummy).toBe(1)
    a.value = 2
    expect(calls).toBe(2)
    expect(dummy).toBe(2)
    // 赋值和之前的一样 不应该触发响应式
    a.value = 2
    expect(calls).toBe(2)
    expect(dummy).toBe(2)
  });

  it('should make nested properties reactive', () => {
    const a = ref({
      count: 1
    })
    let dummy
    effect(() => {
      dummy = a.value.count
    })
    expect(dummy).toBe(1)
    a.value.count = 2
    expect(dummy).toBe(2)
  });

  it('isRef', () => {
    const a = ref(1)
    const user = reactive({
      age: 18
    })
    expect(isRef(a)).toBe(true)
    expect(isRef(1)).toBe(false)
    expect(isRef(user)).toBe(false)
  });

  it('unRef', () => {
    const a = ref(1)
    expect(unRef(a)).toBe(1)
    expect(unRef(1)).toBe(1)
  });

  // vue3 在 template 中直接使用 ref.value 可以拿到数据的原因就是因为隐式调用了 proxyRefs
  it('proxyRefs', () => {
    const user = {
      age: ref(18),
      name: "Btrya"
    }
    const proxyUser = proxyRefs(user)
    expect(user.age.value).toBe(18)
    expect(proxyUser.age).toBe(18)
    expect(proxyUser.name).toBe("Btrya")

    proxyUser.age = 20
    expect(user.age.value).toBe(20)
    expect(proxyUser.age).toBe(20)

    proxyUser.age = ref(25)
    expect(user.age.value).toBe(25)
    expect(proxyUser.age).toBe(25)
  });
});