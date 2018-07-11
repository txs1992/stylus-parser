import Node from './node'
import { instaNull } from './index'
import Expression from './expression'

export default class Ident extends Node {
  constructor (name, val, mixin) {
    super()
    this.name = name
    this.string = name
    this.val = val || instaNull
    this.mixin = !!mixin
  }

  get hash () {
    return this.name
  }

  get isEmpty () {
    return this.val === undefined
  }

  clone (parent) {
    const { val, name, rest, mixin, lineno, column, property, filename } = this
    const ident = new Ident(name)
    return Object.assign(ident, {
      val: val.clone(parent, ident),
      rest,
      mixin,
      lineno,
      column,
      property,
      filename
    })
  }

  coerce (other) {
    switch (other.nodeName) {
      case 'ident':
      case 'string':
      case 'literal':
        return new Ident(other.string)
      case 'unit':
        return new Ident(other.toString())
      default:
        return Node.prototype.coerce.call(this, other)
    }
  }

  operate (op, right) {
    const first = right.first
    switch (op) {
      case '-':
        if (val.nodeName === 'unit') {
          const expr = new Expression()
          const val = first.clone()
          val.val = -val.val
          expr.push(this)
          expr.push(val)
          return expr
        }
      case '+':
        return new Ident(this.string, this.coerce(first).string)
    }
    return Node.prototype.operate.call(this, op, right)
  }

  toString () {
    return this.name
  }
  
  toJSON () {
    const { val, name, rest, mixin, lineno, column, property, filename } = this
    return {
      val,
      name,
      rest,
      mixin,
      lineno,
      column,
      property,
      filename
    }
  }
}
