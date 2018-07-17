import Node from './node'

export default class Function extends Node {
  constructor (name, params, body) {
    super()
    this.name = name
    this.block = body
    this.params = params
    if (typeof params === 'function') this.fn = params
  }

  get arity () {
    return this.params.length
  }

  get hash () {
    return 'function ' + this.name
  }

  clone (parent) {
    const { fn, name, block, params, lineno, column, filename } = this
    let functionInsta = null
    if (fn) {
      functionInsta = new Function(name, fn)
    } else {
      functionInsta = new Function(name)
      functionInsta.params = params.clone(parent, functionInsta)
      functionInsta.block = block.clone(parent, functionInsta)
    }
    return Object.assign(functionInsta, {
      lineno,
      column,
      filename
    })
  }

  toString () {
    const { fn, name, params } = this
    return fn
      ? `(${fn.toString().match(/^function *\w*\((.*?)\)/).slice(1).join(', ')})`
      : `${name}(${params.nodes.join(', ')})`
  }

  toJSON() {
    const { fn, name, block, lineno, column, params, filename } = this
    const json = { name, lineno, column, filename, __type: 'Function' }
    return fn ? { ...json, fn } : { ...json, block, params }
  }
}
