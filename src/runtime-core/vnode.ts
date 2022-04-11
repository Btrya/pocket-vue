export function createVnode(type, props?, children?) {
  const vnode = {
    type, 
    props, 
    children,
    el: null
  }
  return vnode
}