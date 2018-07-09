import Node from '../node'

export default class Block extends Node {
  constructor (parent, node) {
    super()
    Node.call(this)
    this.node = node
    this.nodes = []
    this.scope = true
    this.parent = parent
  }

  get hasMedia () {
    return this.nodes.some(node => node.nodeName === 'media')
  }

  get isEmpty () {
    return !this.nodes.length
  }

  push (node) {
    this.nodes.push(node)
  }

  clone (parentProp, nodeProp) {
    const { node, nodes, scope, lineno, column, parent, filename } = this
    const block = new Block(parentProp || parent, nodeProp || node)
    nodes.forEach(node => { block.push(node.clone(block, block)) })
    return Object.assign(block, {
      scope,
      lineno,
      column,
      filename
    })
  }

  toJSON () {
    const { scope, nodes, lineno, column, filename } = this
    return { scope, nodes, lineno, column, filename, __type: 'Block' }
  }
}
