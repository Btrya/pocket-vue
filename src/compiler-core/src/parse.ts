import { NodeTypes } from "./ast"

export function baseParse(content: string) {
  const context = createParserContext(content)
  return createRoot(parseChildren(context))
}

function parseChildren(context) {
  const nodes: any = []
  let node
  if (context.source.startsWith("{{")) {
    node = parseInterpolation(context)
  }
  nodes.push(node)
  return nodes
}

function parseInterpolation(context) {
  const openDelimiter = "{{"
  const closeDelimiter = "}}"
  const closeIndex = context.source.indexOf(closeDelimiter, openDelimiter.length)
  advanceBy(context, openDelimiter.length) // 丢掉前两个
  const rawContentLength = closeIndex - openDelimiter.length // 拿到中间内容的长度
  const rawContent = context.source.slice(0, rawContentLength) // 存在 content 字段中
  const content = rawContent.trim()
  advanceBy(context, rawContentLength + closeDelimiter.length) // 干掉后边的两个

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: "message"
    }
  }
}

function advanceBy(context, length) {
  context.source = context.source.slice(length)
}

function createRoot(children) {
  return {
    children
  }
}

function createParserContext(content: string) {
  return {
    source: content
  }
}
