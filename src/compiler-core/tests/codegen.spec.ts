import { baseParse } from "../src/parse";
import { generate } from "../src/codegen"
import { transform } from "../src/transform";

describe('codegen', () => {
  it('string', () => {
    const ast = baseParse("hi")
    transform(ast)
    const { code } = generate(ast)
    // 快照debug
    // 点击上面的 Run 会生成快照
    expect(code).toMatchSnapshot()
  });
});