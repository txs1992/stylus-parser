import nodes from './index'
import { unwrap } from '../utils'
import { CoercionError } from '../errors'
import Evaluator from '../visitor/evaluator'

export default class Node {
  constructor () {
    this.lineno = nodes.lineno || 1
    this.column = nodes.column || 1
    this.filename = nodes.filename
  }

  get first () {
    return this
  }

  get hash () {
    return this.val
  }

  get nodeName () {
    return this.constructor.name.toLowerCase()
  }

  clone () {
    return this
  }

  toJSON () {
    return {
      lineno: this.lineno,
      column: this.column,
      filename: this.filename
    }
  }

  eval () {
    return new Evaluator(this).evaluate()
  }

  toBoolean () {
    return nodes.boolTrue
  }

  toExpression () {
    if (this.nodeName === 'expression') return this
    const expr = new nodes.Expression()
    expr.push(this)
    return expr
  }

  shouldCoerce (op) {
    switch (op) {
      case 'is a':
      case 'in':
      case '||':
      case '&&':
        return false
      default:
        return true
    }
  }

  operate (op, right) {
    switch (op) {
      case 'is a':
        if (right.first.nodeName === 'string') {
          return nodes.Boolean(this.nodeName === right.val)
        } else {
          throw new Error('"is a" expects a string, got ' + right.toString())
        }
      case '==':
        return nodes.Boolean(this.hash === right.hash)
      case '!=':
        return nodes.Boolean(this.hash !== right.hash)
      case '>=':
        return nodes.Boolean(this.hash >= right.hash)
      case '<=':
        return nodes.Boolean(this.hash <= right.hash)
      case '>':
        return nodes.Boolean(this.hash > right.hash)
      case '<':
        return nodes.Boolean(this.hash < right.hash)
      case '||':
        return this.toBoolean().isTrue ? this : right
      case 'in':
        const vals = unwrap(right).nodes
        const hash = this.hash
        const len = vals.length
        if (!vals || !len) throw new Error('"in" given invalid right-hand operand, expecting an expression')
        // 'prop' in obj
        if (len === 1 && vals[0].nodeName === 'object') return nodes.Boolean(vals[0].has(this.hash))
        const hasHash = vals.find(val => val.hash === hash)
        return hasHash ? nodes.boolTrue : nodes.boolFalse
      case '&&':
        const boola = this.toBoolean()
        const boolb = right.toBoolean()
        return boola.isTrue && boolb.isTrue
          ? right
          : boola.isFalse
            ? this
            : right
      default:
        const firstMsg = 'cannot perform'
        const msg = op === '[]'
          ? `${firstMsg} ${this} [${right}]`
          : `${firstMsg} ${this} ${op} ${right}`
        throw new Error(msg)
    }
  }

  coerce (other) {
    if (other.nodeName === this.nodeName) return other
    throw new CoercionError(`cannot coerce ${other} to ${this.nodeName}`)
  }
}
