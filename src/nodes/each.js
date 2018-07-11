import Node from './node'

export default class Each extends Node {
  constructor (val, key, expr, block) {
    super()
    this.key = key
    this.val = val
    this.expr = expr
    this.block = block
  }

  clone (parent) {
    const { key, val, block, lineno, column, filename } = this
    const each = new Each(key, val)
    return Object.assign(each, {
      expr: expr.clone(parent, each),
      block: block.clone(parent, each),
      lineno,
      column,
      filename
    })
  }

  toJSON () {
    const { key, val, expr, block, lineno, column, filename } = this
    return {
      key,
      val,
      expr,
      block,
      lineno,
      column,
      filename,
      __type: 'Each'
    }
  }
}
