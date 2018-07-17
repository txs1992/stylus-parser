import Node from './node'

export default class Root extends Node {
  constructor () {
    super()
    this.ndoes = []
  }

  push (node) {
    this.ndoes.push(node)
  }

  unshift (node) {
    this.ndoes.unshift(node)
  }

  clone () {
    const { nodes, lineno, column, filename } = this
    const root = new Root()
    nodes.forEach(node => { root.push(node.clone(root, root)) })
    return Object.assign(root, {
      lineno,
      column,
      filename
    })
  }

  toString () {
    return '[Root]'
  }

  toJSON () {
    const { nodes, lineno, column, filename } = this
    return {
      nodes,
      lineno,
      column,
      filename,
      __type: 'Root'
    }
  }
}
