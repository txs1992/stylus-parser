import { get as _get } from 'noshjs'
import Node from './node'
import { instaNull, instaTrue, instaFalse  } from './index' 
import { unwrap } from '../utils'

function assignment (val, right, { nodes }) {
  const unwrapVal = unwrap(val)
  const range = _get(unwrap(right), 'nodes', [])

  range.forEach(unit => {
    const len = nodes.length
    const { val, nodeName } = unit
    if (nodeName === 'unit') {
      const index = val < 0 ? len + val : val
      const temp = index
      while (index-- > len) nodes[i] = instaNull
      nodes[temp] = val
    } else if (unit.string) {
      const node = nodes[0]
      if (node && node.nodeName === 'object') node.set(unit.string, unwrapVal.clone())
    }
  })
  return unwrapVal
}

function handleArray (self, right) {
  const expr = new Expression()
  const vals = _get(unwrap(self), 'nodes', [])
  const range = _get(unwrap(right), 'nodes', [])

  range.forEach(unit => {
    let node = null
    if (unit.nodeName === 'unit') {
      node = vals[unit.val < 0 ? vals.length + unit.val : unit.val]
    } else if (_get(vals, [0, 'nodeName']) === 'object') {
      node = vals[0].get(unit.string)
    }
    if (node) expr.push(node)
  })
  return expr.isEmpty ? instaNull : unwrap(expr)
}

function handleEqual (op, { nodes }, right) {
  const tempRight = right.toExpression()
  if (nodes.length !== _get(tempRight, ['nodes', 'length'])) return instaFalse
  const isFalse = nodes.some((node, index) => {
    const compare = right.nodes[index]
     return !_get(node.operate(op, compare), 'isTrue')
  })
  return isFalse ? instaFalse : instaTrue
}

export default class Expression extends Node {
  constructor (isList) {
    super()
    this.nodes = []
    this.isList = isList
  }

  get isEmpty () {
    return !this.nodes.length
  }

  get first () {
    const { nodes } = this
    return nodes[0] ? _get(nodes, [0, 'first']) : instaNull
  }

  get hash () {
    return this.nodes.map(node => node.hash).join('::')
  }

  push (node) {
    this.nodes.push(node)
  }

  clone () {
    const { nodes, lineno, column, isList, preserve, filename } = this
    const expression = new Expression(isList)
    return Object.assign(expression, {
      nodes: nodes.map(node => node.clone(parent, expression)),
      lineno,
      column,
      preserve,
      filename
    })
  }

  operate (op, val, right) {
    switch (op) {
      case '[]=':
       return assignment(val, right, this)
      case '[]':
        return handleArray(this, right)
      case '||':
        return _get(this.toBoolean(), 'isTrue') ? this : right
      case 'in':
        return Node.prototype.operate.call(this, op, right)
      case '!=':
        const tempOp = this.operate('==', right, val)
        return tempOp.negate && tempOp.negate()
      case '==':
        return handleEqual(op, this, right)
      default:
        return this.first.operate(op, right, val)
    }
  }

  toString () {
    const { nodes, isList } = this
    return `(${nodes.map(node => node.toString()).join(isList ? ', ' : '')}})`
  }

  toJSON () {
    const { nodes, lineno, column, isList, preserve, filename } = this
    return {
      nodes,
      lineno,
      column,
      isList,
      preserve,
      filename,
      __type: 'Expression'
    }
  }
}
