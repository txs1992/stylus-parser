import Node from './node'

export default class If extends Node {
  constructor (cond, negate) {
    super()
    this.cond = cond
    this.elses = []
    if (negate && negate.nodeName) {
      this.block = negate
    } else {
      this.negate = negate
    }
  }

  clone (parent) {
    const { cond, block, elses, negate, lineno, column, postfix, filename } = this
    const ifInsta = new If()
    return Object.assign(ifInsta, {
      cond: cond.clone(parent, ifInsta),
      block: block.clone(parent, ifInsta),
      elses: elses.map(node => node.clone(parent, ifInsta)),
      negate,
      lineno,
      column,
      postfix,
      filename
    })
  }

  toJSON () {
    const { cond, block, elses, negate, lineno, column, postfix, filename } = this
    return {
      cond,
      block,
      elses,
      negate,
      lineno,
      column,
      postfix,
      filename,
      __type: 'If'
    }
  }
}
