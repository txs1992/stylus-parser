import Node from './node'

export default class Call extends Node {
  constructor (name, args) {
    super()
    this.name = name
    this.args = args
  }

  clone (parent) {
    const { name, args, block, lineno, column, filename } = this
    const call = new Call(name)
    if (block) call.block = block.clone(parent, call)
    return Object.assign(call, {
      args: args.clone(parent, call),
      lineno,
      column,
      filename
    })
  }

  toString () {
    const args = this.args.nodes.map(node => {
      const str = node.toString()
      return str.slice(1, str.length - 1)
    }).join(', ')

    return `${this.name}(${args})`
  }

  toJSON () {
    const { name, args, block, lineno, column, filename } = this
    const json = { name, args, lineno, column, filename, __type: 'Call' }
    return block ? { ...json, block } : json
  }
}
