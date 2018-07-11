import Node from './node'

export default class Feature extends Node {
  constructor (segs) {
    super()
    this.expr = null
    this.segments = segs
  }

  clone (parent) {
    const { name, expr, lineno, column, segments, filename } = this
    const feature = new Feature()
    feature.segments = segments.map(node => node.clone(parent, feature))
    if (expr) feature.expr = expr.clone(parent, feature)
    if (name) feature.name = name
    return Object.assign(feature, {
      lineno,
      column,
      filename
    })
  }

  toString () {
    const { expr, segments } = this
    return expr
      ? `(${segments.join('')}: ${expr.toString()})`
      : segments.join('')
  }

  toJSON () {
    const { name, expr, lineno, column, segments, filename } = this
    return{
      name,
      expr,
      lineno,
      column,
      segments,
      filename,
      __type: 'Feature'
    }
  }
}
