import Node from './node'
import { instaNull } from './index'

export default class Return extends Node {
  constructor (expr) {
    super()
    this.expr = expr || instaNull
  }

  clone (parent) {
    const { expr, lineno, column, filename } = this
    const returnInstance = new Return()
    return Object.assign(returnInstance, {
      expr: expr.clone(parent, returnInstance),
      lineno,
      column,
      filename
    })
  }

  toJSON () {
    const { expr, lineno, column, filename } = this
    return {
      expr,
      lineno,
      column,
      filename,
      __type: 'Return'
    }
  }
}
