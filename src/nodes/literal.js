import { get as _get } from 'noshjs'
import Node from './node'

export default class Literal extends Node {
  constructor (str) {
    super()
    this.val = str
    this.string = str
    this.prefixed = false
  }

  coerce (other) {
    switch (other.nodeName) {
      case 'ident':
      case 'string':
      case 'literal':
        return new Literal(other.string)
      default:
        return Node.prototype.coerce.call(this, other)
    }
  }

  operate (op, right) {
    const first = right.first
    return op === '+'
      ? new Literal(this.string + _get(this.coerce(first), 'string'))
      : Node.prototype.operate.call(this, op, right)
  }

  toString () {
    return this.val.toString()
  }

  toJSON () {
    const { val, string, lineno, column, prefixed, filename } = this
    return {
      val,
      string,
      lineno,
      column,
      prefixed,
      filename,
      __type: 'Literal'
    }
  }
}
