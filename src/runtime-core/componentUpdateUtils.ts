export function shouldUpdateComponent(preVNode, nextVNode) {
  const { props: preProps } = preVNode
  const { props: nextProps } = nextVNode

  for (const key in nextProps) {
    if (nextProps[key] !== preProps[key]) return true
  }
  return false
}