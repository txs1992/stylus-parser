import Node from './node'

export default class Query extends Node {
  constructor () {
    super()
    this.type = ''
    this.nodes = []
    this.predicate = ''
  }

  get resolvedType () {
    const { type } = this
    if (type) return type.nodeName ? type.string : type
  }

  get resolvedPredicate () {
    const { predicate } = this
    if (predicate) return predicate.nodeName ? predicate.string : predicate
  }

  push (feature) {
    this.nodes.push(feature)
  }

  clone (parent) {
    const { type, nodes, lineno, column, filename, predicate } = this
    const query = new Query()
    nodes.forEach(node => { query.push(node.clone(parent, query)) })
    return Object.assign(query, {
      type,
      lineno,
      column,
      filename,
      predicate
    })
  }

  merge (other) {
    const { nodes, resolvedType: rt, resolvedPredicate: rp } = this
    const { resolvedType: rt2, resolvedPredicate: rp2 } = other
    const query = new Query()
    let temp = rt || rt2
    let temp2 = rt2 || rt
    let type = null
    let pred = null

    // Stolen from Sass :D
    if (rp === 'not' ^ rp2 === 'not') {
      if (temp === temp2) return
      type = rp === 'not' ? temp2 : temp
      pred = rp === 'not' ? rp2 : rp
    } else if (rp === 'not' && rp2 === 'not') {
      if (temp !== temp2) return
      type = temp
      pred = 'not'
    } else if (temp !== temp2) {
      return
    } else {
      type = temp
      pred = rp || rp2
    }

    return Object.assign(query, {
      type,
      pred,
      nodes: nodes.concat(other.nodes)
    })
  }

  toString () {
    const { type = '', nodes, predicate } = this
    const pred = predicate ? predicate + ' ' : ''
    let str = pred + type
    if (nodes.length) str += `${type && ' and '} ${nodes.map(node => node.toString()).join(' and ')}`
    return str
  }

  toJSON () {
    const { type, nodes, lineno, column, filename, predicate } = this
    return {
      type,
      nodes,
      lineno,
      column,
      filename,
      predicate,
      __type: 'Query'
    }
  }
}
