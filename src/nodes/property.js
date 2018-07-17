import Node from './node'

export default class Property extends Node {
  constructor (segs, expr) {
    super()
    this.segments = segs
    this.expr = expr
  }

  operate (op, right, val) {
    return this.expr.operate(op, right, val)
  }

  clone (parent) {
    const { expr,lineno, column, literal, segments, filename } = this
    const prop = new Property(segments)
    if (expr) prop.expr = expr.clone(parent, prop)
    if (literal) prop.literal = literal
    return Object.assign(prop, {
      lineno,
      column,
      filename,
      segments: segments.map(node => node.clone(parent, prop))
    })
  }

  toString () {
    const { expr, segments } = this
    return `property(${segments.join('')}, ${expr})`
  }

  toJSON () {
    const { expr,lineno, column, literal, segments, filename } = this
    return {
      expr,
      lineno,
      column,
      literal,
      segments,
      filename,
      __type: 'Property'
    }
  }
}
