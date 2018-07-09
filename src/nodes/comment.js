import Node from './node'

export default class Comment extends Node {
  constructor (str, inline, suppress) {
    super()
    this.str = str
    this.inline = inline
    this.suppress = suppress
  }

  toString () {
    return this.str
  }

  toJSON () {
    const { str, inline, lineno, column, suppress, filename } = this
    return { str, inline, lineno, column, suppress, filename, __type: 'Comment' }
  }
}
