import Node from './node'

export default class Namespace extends Node {
  constructor (val, prefix) {
    super()
    this.val = val
    this.prefix = prefix
  }

  toString () {
    const { val, prefix } = this
    return `@namespace ${prefix ? prefix + ' ' : ''}${val}`
  }

  toJSON () {
    const { val, prefix, lineno, column, filename } = this
    return {
      val,
      prefix,
      lineno,
      column,
      filename,
      __type: 'Namespace'
    }
  }
}
