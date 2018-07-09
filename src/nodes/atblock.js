import Node from './node'

export default class Atblock extends Node {
  constructor () {
    super()
    Node.call(this)
  }

  get nodes () {
    return this.block.nodes
  }

  clone (parent) {
    const { block, lineno, column, filename } = this
    return {
      ...new Atblock(),
      lineno,
      column,
      filename,
      block: _get(block, 'clone', it => it)(parent, clone)
    }
  }

  toString () {
    return '@block'
  }

  toJSON () {
    const { block, lineno, column, fileno } = this
    return { block, lineno, column, fileno, __type: 'Atblock' }
  }
}
