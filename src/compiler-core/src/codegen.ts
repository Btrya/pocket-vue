import { NodeTypes } from "./ast"
import { helperMapName, TO_DISPLAY_STRING } from "./runtimeHelpers"

export function generate(ast) {
  const context = cerateCodegenContext()
  const { push } = context
  if (ast.helpers.length > 0) {
    getFunctionPreambel(ast, context)
  }
  const functionName = "render"
  const args = ["_ctx", "_cache", "$props", "$setup", "$data", "$options"]
  const signature = args.join(", ")
  push("return ")
  push(`function ${functionName}(${signature}) {`)
  push(`return `)
  genNode(ast.codegenNode, context)
  push(`}`)
  return {
    code: context.code
  }
}

function getFunctionPreambel(ast, context) {
  const { push } = context
  const VueBinging = "Vue"
  const aliasHelper = (s) => `${helperMapName[s]}: _${helperMapName[s]}`
  push(`const { ${ast.helpers.map(aliasHelper).join(", ")} } = ${VueBinging}`)
  push(`\n`)
}

function cerateCodegenContext() {
  const context = {
    code: "",
    push(source) {
      context.code += source
    },
    helper(key) {
      return `_${helperMapName[key]}(`
    }
  }
  return context
}

function genNode(node: any, context) {
  switch (node.type) {
    case NodeTypes.TEXT:
      genText(node, context)
      break;
    case NodeTypes.INTERPOLATION:
      genInterpolation(node, context)
      break;
    case NodeTypes.SIMPLE_EXPRESSION:
      genExpression(node, context)
      break;
    default:
      break;
  }
}
function genText(node: any, context: any) {
  const { push } = context
  push(`'${node.content}'`)
}

function genInterpolation(node: any, context: any) {
  const { push, helper } = context
  push(`${helper(TO_DISPLAY_STRING)}`)
  genNode(node.content, context)
  push(`)`)
}

function genExpression(node: any, context: any) {
  const { push } = context
  push(`${node.content}`)
}
