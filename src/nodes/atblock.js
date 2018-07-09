import noop from 'lodash/noop'
import { get as _get } from 'noshjs'
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
    const atblock = new Atblock()
    return Object.assign(atblock, {
      lineno,
      column,
      filename,
      block: _get(block, 'clone', noop)(parent, atblock)
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
