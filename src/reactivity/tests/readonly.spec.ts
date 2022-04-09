import { readonly, isReadonly } from '../reactive'

/**
 * 实现 readonly
 * 即响应式对象的属性应该是只读的不能被set
 */
describe('readonly', () => {
  it('happy path', () => {
    const original = { foo: 1, bar: { baz: 2 } }
    const warpped = readonly(original)
    expect(warpped).not.toBe(original)
    expect(isReadonly(warpped)).toBe(true)
    expect(isReadonly(original)).toBe(false)
    expect(isReadonly(warpped.bar)).toBe(true)
    expect(isReadonly(original.bar)).not.toBe(true)
    expect(warpped.foo).toBe(1)
  });

  it('warn then call set', () => {
    // console.warn() mock
    console.warn = jest.fn()
    const user = readonly({ age: 10 })
    user.age = 11
    expect(console.warn).toBeCalled()
  });
});