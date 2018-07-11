import Atrule from './atrule'

export default class Keyframes extends Atrule {
  constructor (segs, prefix) {
    super('keyframes')
    this.segments = segs
    this.prefix = prefix || 'official'
  }

  clone (parent) {
    const { block, lineno, column, prefix, segments, filename } = this
    const keyframes = new Keyframes()
    return Object.assign(keyframes, {
      block: block.clone(parent, keyframes),
      lineno,
      column,
      prefix,
      segments: segments.map(node => node.clone(parent, keyframes)),
      filename
    })
  }

  toString () {
    return `@keyframes${this.segments.join('')}`
  }

  toJSON () {
    const { block, lineno, column, prefix, segments, filename } = this
    return {
      block,
      lineno,
      column,
      prefix,
      segments,
      filename,
      __type: 'Keyframes'
    }
  }
}
