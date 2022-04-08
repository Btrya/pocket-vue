import { reactive } from '../reactive'
import { effect, stop } from '../effect'

describe('effect', () => {
  it('happy path', () => {
    // 创建响应式对象
    const user = reactive({
      age: 10
    })
    let nextAge: number = 0;
    effect(() => {
      // user.age 触发到响应式 get 这里应该执行依赖收集
      nextAge = user.age + 1
    })
    expect(nextAge).toBe(11)

    // update
    // update 应该触发响应式 set 这里应该执行相关依赖
    user.age++
    expect(nextAge).toBe(12)
  });

  // 调用 effect 的时候应该返回当前的执行函数
  it('should return runner when call effect', () => {
    let age = 10
    const runner = effect(() => {
      age++
      return 'Age'
    })
    expect(age).toBe(11)

    const r = runner()
    expect(age).toBe(12)
    expect(r).toBe('Age')
  });

  /**
   * 1. 通过 effect 的第二个参数给定的 一个 scheduler 的 fn
   * 2. effect 第一次执行的时候 还会执行 fn
   * 3. 当响应式对象 触发 set 的时候 fn 不会执行 而是执行 scheduler
   * 4. 如果当执行 runner 的时候 会再次执行 fn
   */
  it('scheduler', () => {
    let dummy
    let run: any
    const scheduler = jest.fn(() => {
      run = runner
    })
    const obj =  reactive({ age: 13 })
    const runner = effect(
      () => {
        dummy = obj.age
      },
      { scheduler }
    )
    // 断言 scheduler 一开始不会被调用
    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(13)
    obj.age++
    // age++ 不会去调用 dummy = obj.age 而是应该调用 传入的 scheduler 
    expect(scheduler).toHaveBeenCalledTimes(1)
    expect(dummy).toBe(13)
    // 调用了 scheduler 后 run 拿到 runner，这时候调用 run 才去执行 dummy = obj.age 
    run()
    expect(dummy).toBe(14)
  });

  /**
   * stop 方法 
   * 调用 stop 后 响应式对象属性被修改 不会触发 执行依赖 的动作
   * 原传入的依赖还是要可以手动执行的
   */
  it('stop', () => {
    let dummy
    const obj =  reactive({ prop: 1 })
    const runner = effect(() => {
      dummy = obj.prop
    })
    obj.prop = 2
    expect(dummy).toBe(2)
    // stop 了 runner 去修改响应式的时候 就不应该触发了
    stop(runner)
    obj.prop = 3
    expect(dummy).toBe(2)
    // 被 stop 了的 runner 仍然可以手动执行
    runner()
    expect(dummy).toBe(3)

    obj.prop++
    // 上边 如果换成  obj.prop++ 那么其实是不通过的
    // 原因：obj.prop++ 会先访问 obj.prop 属性 (obj.prop = obj.prop + 1)，这就会触发 get ，又去收集依赖了
    // expect(dummy).toBe(4)
    // // 由于依赖被重新收集，所以又变成响应式了
    // obj.prop = 5
    // expect(dummy).toBe(5)
    // 调了 stop 的话在 track 存入依赖前 return 后
    expect(dummy).toBe(3)
    runner()
    expect(dummy).toBe(4)
  });

  /**
   * onStop hooks，在调用 stop 方法后应该被执行
   */
  it('onStop', () => {
    const obj =  reactive({ foo: 1 })
    const onStop = jest.fn()
    let dummy
    const runner = effect(
      () => {
        dummy = obj.foo
      }, 
      { onStop }
    )
    stop(runner)
    expect(onStop).toBeCalledTimes(1)
  });
});