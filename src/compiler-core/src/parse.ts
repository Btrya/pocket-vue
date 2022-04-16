import { NodeTypes } from "./ast"

const enum TagTypes {
  START,
  END
}

export function baseParse(content: string) {
  const context = createParserContext(content)
  return createRoot(parseChildren(context))
}

function parseChildren(context) {
  const nodes: any = []
  let node
  const s = context.source
  if (s.startsWith("{{")) {
    node = parseInterpolation(context)
  } else if (s[0] === "<") {
    if (/[a-z]/i.test(s[1])) {
      node = parseElement(context)
    }
  }
  nodes.push(node)
  return nodes
}

function parseElement(context) {
  // 1. 解析 tag
  const element = parseTag(context, TagTypes.START)
  parseTag(context, TagTypes.END)
  return element
}

function parseTag(context: any, type: TagTypes) {
  const match: any = /^<\/?([a-z]*)/i.exec(context.source)
  const tag = match[1]
  // 2. 删除处理完成的代码
  advanceBy(context, match[0].length)
  advanceBy(context, 1)
  if (type === TagTypes.END) return  
  return {
    type: NodeTypes.ELEMENT,
    tag
  }
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
