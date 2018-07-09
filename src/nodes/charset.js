import Node from './node'

export default class Charset extends Node {
  constructor (val) {
    super()
    this.val = val
  }

  toString () {
    return `@charset ${this.val}`
  }

  toJSON () {
    const { val, lineno, column, filename } = this
    return { val, lineno, column, filename, __type: 'Charset' }
  }
}
