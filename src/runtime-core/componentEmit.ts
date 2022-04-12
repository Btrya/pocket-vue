import { camelize, toHandlerKey } from "../shared"

export function emit(instance, event, ...args) {
  const { props } = instance
  const handlerNmae = toHandlerKey(camelize(event))
  const handler = props[handlerNmae]
  handler && handler(...args)
}