import Node from './node'

export default class Atblock extends Node {
  constructor () {
    super()
  }

  get nodes () {
    return this.block.nodes
  }

  clone (parent) {
    const { block, lineno, column, filename } = this
    const atblock = new Atblock()
    return Object.assign(atblock, {
      lineno,
      column,
      filename,
      block: blcok.clone(parent, atblock)
    })
  }

  toString () {
    return '@block'
  }

  toJSON () {
    const { block, lineno, column, fileno } = this
    return { block, lineno, column, fileno, __type: 'Atblock' }
  }
}
