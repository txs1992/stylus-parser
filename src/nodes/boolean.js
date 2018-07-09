import Node from './node'

export default class Boolean extends Node {
  constructor (val) {
    if (this.nodeName) {
      this.val = val ? true : false
    } else {
      return new Boolean(val)
    }
  }

  toBoolean () {
    return this
  }

  get isTrue () {
    return this.val
  }

  get isFalse () {
    return !this.val
  }

  negate () {
    return new Boolean(!this.val)
  }

  inspect () {
    return `[Boolean ${this.val}]`
  }

  toString () {
    return this.val ? 'true' : 'false'
  }

  toJSON () {
    return {
      val: this.val,
      __type: 'Boolean'
    }
  }
}
