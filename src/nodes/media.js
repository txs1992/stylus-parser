import Atrule from './atrule'

export default class Media extends Atrule {
  constructor (val) {
    super('media')
    this.val = val
  }

  clone (parent) {
    const { val, block, lineno, column, filename } = this
    const media = new Media()
    return Object.assign(media, {
      val: val.clone(parent, media),
      block: block.clone(parent, media),
      lineno,
      column,
      filename
    })
  }

  toString () {
    return `@media ${this.val}`
  }

  toJSON () {
    const { val, block, lineno, column, filename } = this
    return {
      val,
      block,
      lineno,
      column,
      filename,
      __type: 'Media'
    }
  }
}
