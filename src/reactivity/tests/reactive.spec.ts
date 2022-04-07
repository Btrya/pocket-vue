import { reactive } from '../reactive'

// describe会生成一块作用域  it表示推断，也可以用test代替 expect表示期望
describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 }
    const observed = reactive(original)
    expect(observed).not.toBe(original)
    expect(observed.foo).toBe(1) // reactive 设置的默认值是5
  });
});