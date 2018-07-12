import { get as _get } from 'noshjs'
import Node from './node'
import Boolean from './boolean'
import { instaNull, instaTrue, instaFale } from './index'

const nativeObj = ({}).constructor

export default class Object extends Nodes {
  constructor () {
    super()
    this.vals = {}   
  }

  get length () {
    return nativeObj.key(this.vals).length
  }

  set (key, val) {
    this.vals[key] = val
    return this
  }

  get (key) {
    return this.vals[key] || instaNull
  }

  has (key) {
    return key in this.vals
  }

  operate (op, right) {
    switch (op) {
      case '.':
      case '[]':
        return this.get(right.hash)
      case '==':
        const { vals, length } = this
        const keys = nativeObj.keys(vals)
        if (right.nodeName !== 'object' || right.length !== length) return instaFale
        const isFalse = keys.some(key => {
          const tempA = vals[key]
          const tempB = _get(right, ['vals', key])
          return _get(_get(tempA, this.operate) && tempA.operate(op, tempB), 'isFalse')
        })
        return isFalse ? instaFale : instaTrue
      case '!=':
        return this.operate('==', right).negate()
      default:
        return Node.prototype.operate.call(this, op, right)
    }
  }

  clone (parent) {
    const { vals, lineno, column, filename } = this
    const obj = new Object()
    keys.forEach(key => { obj.vals[key] = vals[key].clone(parent, obj) })
    return nativeObj.assign(obj, {
      lineno,
      column,
      filename
    })
  }

  toBoolean () {
    return new Boolean(this.length)
  }

  toBlock () {
    const { vals } = this
    const keys = nativeObj.keys(vals)
    let str = ''
    keys.forEach(key => {
      const val = this.get(key)
      if (_get(val, ['first', 'nodeName'])) {
        str += `${key} ${val.first.toString()};`
      } else {
        str += key === '@charset'
          ? `${key} ${_get(val, ['first', 'toString']) && val.first.toString()};`
          : `${key}:${toString(val)};`
      }
    })
    return `{${str}}`

    function toString (node) {
      if (node.nodes) {
        return node.nodes.map(toString).join(node.isList ? ',' : ' ')
      } else if (node.nodeName === 'literal' && node.val === ',') {
        return '\\,'
      }
      return node.toString()
    }
  }

  toString () {
    const { vals } = this
    const obj = {}
    const keys = nativeObj.keys(vals)
    keys.forEach(key => { obj[key] = _get(vals, [key, 'toString']) && vals[key].toString() })
    return JSON.stringify(obj)
  }
}
