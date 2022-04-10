import { isReadonly, isReactive, shallowReadonly, shallowReactive } from '../reactive'

describe('shallow', () => {
  it('should not make non-reactive properties reactive', () => {
    const read = shallowReadonly({ n: { foo: 1 } })
    expect(isReadonly(read)).toBe(true)
    expect(isReadonly(read.n)).toBe(false)
    const reac = shallowReactive({ n: { foo: 1 } })
    expect(isReactive(reac)).toBe(true)
    expect(isReactive(reac.n)).toBe(false)
  });

  it('warn then call set', () => {
    // console.warn() mock
    console.warn = jest.fn()
    const user = shallowReadonly({ age: 10 })
    user.age = 11
    expect(console.warn).toBeCalled()
  });
});