import Node from '../node'

export default class BinOp extends Node {
  constructor (op, left, right) {
    super()
    Node.call(this)
    this.op = op
    this.left = left
    this.right = right
  }

  clone (parent) {
    const { op, val, left, right, lineno, column, filename } = this
    const binop = new BinOp(op)
    if (val) binop.val = val.clone(parent, binop)
    return Object.assign(binop, {
      left: left.clone(parent, binop),
      right: right.clone(parent, binop),
      lineno,
      column,
      filename
    })
  }

  toString () {
    const { op, left, right } = this
    return `${left.toString()} ${op} ${right.toString()}`
  }

  toJSON () {
    const { op, val, left, right, lineno, column, filename } = this
    const json = { op, left, right, lineno, column, filename, __type: 'BinOp' }
    return val ? { ...json, val } : json
  }
}
