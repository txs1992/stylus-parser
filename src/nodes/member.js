import Node from './node'

export default class Member extends Node {
  constructor (left, right) {
    super()
    this.left = left
    this.right = right
  }

  clone (parent) {
    const { val, left, right, lineno, column, filenmae } = this
    const member = new Member()
    if (val) member.val = val.clone(parent, member)
    return Object.assign(member, {
      left: left.clone(parent, member),
      right: right.clone(parent, member),
      lineno,
      column,
      filenmae
    })
  }

  toString () {
    return `${this.left.toString()}.${this.right.toString()}`
  }

  toJSON () {
    const { left, right, lineno, column, filenmae } = this
    return {
      left,
      right,
      lineno,
      column,
      filenmae,
      __type: 'Member'
    }
  }
}
