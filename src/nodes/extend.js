import Node from './node'

export default class Extend extends Node {
  constructor (selectors) {
    super()
    this.selectors = selectors
  }

  clone () {
    return new Extend(this.selectors)
  }

  toString () {
    return `@extend ${this.selectors.join(', ')}`
  }

  toJSON () {
    const { lineno, column, filename, selectors } = this
    return {
      lineno,
      column,
      filename,
      selectors,
      __type: 'Extend'
    }
  }
}
