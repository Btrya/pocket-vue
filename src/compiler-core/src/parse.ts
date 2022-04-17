import { NodeTypes } from "./ast"

const enum TagTypes {
  START,
  END
}

export function baseParse(content: string) {
  const context = createParserContext(content)
  return createRoot(parseChildren(context, []))
}

function parseChildren(context, ancestors) {
  const nodes: any = []
  while (!isEnd(context, ancestors)) {
    let node
    const s = context.source
    if (s.startsWith("{{")) {
      node = parseInterpolation(context)
    } else if (s[0] === "<") {
      if (/[a-z]/i.test(s[1])) {
        node = parseElement(context, ancestors)
      }
    }
    if (!node) {
      node = parseText(context)
    }
    nodes.push(node)
  }
  return nodes
}

function isEnd(context, ancestors) {
  // 遇到结束标签的时候
  const s = context.source
  if (s.startsWith("</")) {
    for (let i = ancestors.length - 1; i >= 0; --i) {
      const tag = ancestors[i].tag
      if (startsWithEndTagOpen(s, tag)) {
        return true
      }
    }
  }
  return !s
  // if (ancestors && s.startsWith(`</${ancestors}>`)) return true
  // // source 还有值 返回 false
  // return !s
}

function parseText(context) {
  let endToken = ["<", "{{"]
  let endIndex = context.source.length
  for (let i = 0; i < endToken.length; ++i) {
    const index = context.source.indexOf(endToken[i])
    if (index !== -1 && endIndex > index) {
      endIndex = index
    }
  }
  const content = parseTextData(context, endIndex)
  return {
    type: NodeTypes.TEXT,
    tag: content
  }
}

function parseElement(context, ancestors) {
  // 1. 解析 tag
  const element: any = parseTag(context, TagTypes.START)
  ancestors.push(element)
  element.children = parseChildren(context, ancestors)
  ancestors.pop()
  if (startsWithEndTagOpen(context.source, element.tag)) {
    parseTag(context, TagTypes.END)
  } else {
    throw new Error(`缺少结束标签： ${element.tag}`)
  }
  return element
}

function startsWithEndTagOpen(source, tag) {
  return source.startsWith("</") && source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase()
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
  const rawContent = parseTextData(context, rawContentLength) // 存在 content 字段中rawContentLength
  const content = rawContent.trim()
  advanceBy(context, closeDelimiter.length) // 干掉后边的两个
  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content
    }
  }
}

function parseTextData(context, len) {
  const content = context.source.slice(0, len)
  advanceBy(context, len)
  return content
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
