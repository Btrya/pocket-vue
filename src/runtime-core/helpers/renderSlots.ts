import { createVnode } from "../vnode";

export function renderSlots(slots, name, props) {
  const slot = slots[name]
  if (slot) {
    // function
    if (typeof slot === 'function') {
      return createVnode("div", {}, slot(props)) 
    }
  }
}