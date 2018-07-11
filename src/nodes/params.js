import Node from './node'

export default class Params extends Node {
  constructor () {
    super()
    this.nodes = []
  }

  get length () {
    return this.nodes.length
  }

  push (node) {
    this.nodes.push(node)
  }

  clone (parent) {
    const { nodes, lineno, column, filename } = this
    const params = new Params()
    nodes.forEach(node => { params.push(node.clone(parent, params)) })
    return Object.assign(params, {
      lineno,
      column,
      filename
    })
  }

  toJSON () {
    const { nodes, lineno, column, filename } = this
    return {
      nodes,
      lineno,
      column,
      filename,
      __type: 'Params'
    }
  }
}
