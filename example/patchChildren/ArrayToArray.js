import { h, ref } from "../../lib/guide-pocket-vue.esm.js"

// 1. 左侧对比
// const prevChildren = [
//   h("div", { key: "A" }, "A"), 
//   h("div", { key: "B" }, "B"), 
//   h("div", { key: "C" }, "C")
// ] key: "A" 
// const nextChildren = [
//   h("div", { key: "A" }, "A"), 
//   h("div", { key: "A" }, "B"), 
//   h("div", { key: "D" }, "D"), 
//   h("div", { key: "E" }, "E")
// ]

// 2. 右侧对比
// const prevChildren = [
//   h("div", { key: "A" }, "A"), 
//   h("div", { key: "B" }, "B"), 
//   h("div", { key: "C" }, "C")
// ]
// const nextChildren = [
//   h("div", { key: "D" }, "D"), 
//   h("div", { key: "E" }, "E"),
//   h("div", { key: "B" }, "B"), 
//   h("div", { key: "C" }, "C"), 
// ]

// 3.新的比老的长 ———— 创建新的
// 左侧
// const prevChildren = [
//   h("p", { key: "A" }, "A"), 
//   h("p", { key: "B" }, "B"), 
// ]
// const nextChildren = [
//   h("p", { key: "A" }, "A"), 
//   h("p", { key: "B" }, "B"), 
//   h("p", { key: "C" }, "C"), 
//   h("p", { key: "D" }, "D"), 
// ]

// 右侧
// const prevChildren = [
//   h("p", { key: "A" }, "A"), 
//   h("p", { key: "B" }, "B"), 
// ]
// const nextChildren = [
//   h("p", { key: "C" }, "C"), 
//   h("p", { key: "D" }, "D"), 
//   h("p", { key: "A" }, "A"), 
//   h("p", { key: "B" }, "B"),
// ]

// 4. 老的比新的长 ———— 删除
// 左侧
// const prevChildren = [
//   h("p", { key: "A" }, "A"), 
//   h("p", { key: "B" }, "B"), 
//   h("p", { key: "C" }, "C"), 
//   h("p", { key: "D" }, "D"),
// ]
// const nextChildren = [
//   h("p", { key: "A" }, "A"), 
//   h("p", { key: "B" }, "B"),
// ]

// 右侧
// const prevChildren = [
//   h("p", { key: "A" }, "A"), 
//   h("p", { key: "B" }, "B"), 
//   h("p", { key: "C" }, "C"), 
//   h("p", { key: "D" }, "D"),
// ]
// const nextChildren = [
//   h("p", { key: "C" }, "C"), 
//   h("p", { key: "D" }, "D"),
// ]

// 5. 对比中间的部分
// 删除老的 在老的里边存在，新的里边不存在
// 5.1
// a, b, (c, d), f, g
// a, b, (e, c), f, g
// d 节点在新的里边没有要删掉 c 节点的位置 props(id) 也发生了变化
// const prevChildren = [
//   h("p", { key: "A" }, "A"), 
//   h("p", { key: "B" }, "B"), 
//   h("p", { key: "C", id: "c-prev" }, "C"), 
//   h("p", { key: "D" }, "D"),
//   h("p", { key: "F" }, "F"), 
//   h("p", { key: "G" }, "G"),
// ]
// const nextChildren = [
//   h("p", { key: "A" }, "A"), 
//   h("p", { key: "B" }, "B"), 
//   h("p", { key: "E" }, "E"),
//   h("p", { key: "C", id: "c-next" }, "C"), 
//   h("p", { key: "F" }, "F"), 
//   h("p", { key: "G" }, "G"),
// ]

// 5.1.1
// a, b, (c, e, d), f, g
// a, b, (e, c), f, g
// const prevChildren = [
//   h("p", { key: "A" }, "A"), 
//   h("p", { key: "B" }, "B"), 
//   h("p", { key: "C", id: "c-prev" }, "C"), 
//   h("p", { key: "E" }, "E"),
//   h("p", { key: "D" }, "D"),
//   h("p", { key: "F" }, "F"), 
//   h("p", { key: "G" }, "G"),
// ]
// const nextChildren = [
//   h("p", { key: "A" }, "A"), 
//   h("p", { key: "B" }, "B"), 
//   h("p", { key: "E" }, "E"),
//   h("p", { key: "C", id: "c-next" }, "C"), 
//   h("p", { key: "F" }, "F"), 
//   h("p", { key: "G" }, "G"),
// ]

// 6 移动
// 最长递增子血猎： [1, 2]
// const prevChildren = [
//   h("p", { key: "A" }, "A"), 
//   h("p", { key: "B" }, "B"), 
//   h("p", { key: "C", id: "c-prev" }, "C"), 
//   // h("p", { key: "D" }, "D"),
//   h("p", { key: "E" }, "E"),
//   h("p", { key: "F" }, "F"), 
//   h("p", { key: "G" }, "G"),
// ]
// const nextChildren = [
//   h("p", { key: "A" }, "A"), 
//   h("p", { key: "B" }, "B"), 
//   h("p", { key: "E" }, "E"),
//   h("p", { key: "C", id: "c-next" }, "C"), 
//   h("p", { key: "D" }, "D"),
//   h("p", { key: "F" }, "F"), 
//   h("p", { key: "G" }, "G"),
// ]

// 综合例子
const prevChildren = [
  h("p", { key: "A" }, "A"), 
  h("p", { key: "B" }, "B"), 
  h("p", { key: "C", id: "c-prev" }, "C"), 
  h("p", { key: "D" }, "D"),
  h("p", { key: "E" }, "E"),
  h("p", { key: "Z" }, "Z"),
  h("p", { key: "F" }, "F"), 
  h("p", { key: "G" }, "G"),
]
const nextChildren = [
  h("p", { key: "A" }, "A"), 
  h("p", { key: "B" }, "B"), 
  h("p", { key: "D" }, "D"),
  h("p", { key: "C", id: "c-next" }, "C"), 
  h("p", { key: "Y" }, "Y"),
  h("p", { key: "E" }, "E"),
  h("p", { key: "F" }, "F"), 
  h("p", { key: "G" }, "G"),
]

export default {
  name: "ArrayToArray",
  setup() {
    const isChange = ref(false)
    window.isChange = isChange
    return {
      isChange,
    }
  },
  render() {
    const self = this
    return h("div", {}, self.isChange === true ? nextChildren : prevChildren)
    // return self.isChange === true ? h("div", {}, nextChildren) : h("div", {}, prevChildren)
  },
}
