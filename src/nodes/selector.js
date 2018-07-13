import Node from './node'
import Block from './block'

export default class Selector extends Node {
  constructor (segs) {
    super()
    this.inherits = true
    this.segments = segs
    this.optional = false
  }

  get isPlaceholder() {
    const { val } = this
    return val && ~val.substr(0, 2).indexOf('$')
  }

  clone (parent) {
    const { val, lineno, column, inherits, segments, optional, filename } = this
    const selector = new Selector()
    return Object.assign(selector, {
      val,
      lineno,
      column,
      inherits,
      optional,
      filename,
      segments: segments.map(node => node.clone(parent, selector))
    })
  }

  toString () {
    const { segments, optional } = this
    return segments.join('') + optional ? ' !optional' : ''
  }

  toJSON () {
    const { val, lineno, column, inherits, segments, optional, filename } = this
    return {
      val,
      lineno,
      column,
      inherits,
      segments,
      optional,
      filename,
      __type: 'Selector'
    }
  }
}
