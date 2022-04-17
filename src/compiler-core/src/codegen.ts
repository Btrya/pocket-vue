

export function generate(ast) {
  const context = cerateCodegenContext()
  const { push } = context
  push("return ")

  const functionName = "render"
  const args = ["_ctx", "_cache", "$props", "$setup", "$data", "$options"]
  const signature = args.join(",")

  push(`function ${functionName}(${signature}) {`)
  push(`return `)
  genNode(ast.codegenNode, context)
  push(`}`)
  return {
    code: context.code
  }
}

function cerateCodegenContext() {
  const context = {
    code: "",
    push(source) {
      context.code += source
    }
  }
  return context
}

function genNode(node: any, context) {
  const { push } = context
  push(`'${node.content}'`)
}
