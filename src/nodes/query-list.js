import { get as _get } from 'noshjs'
import Node from './node'

export default class QueryList extends Node {
  constructor () {
    super()
    this.nodes = []
  }

  push (node) {
    this.nodes.push(node)
  }

  merge (other) {
    const { nodes } = this
    const queryList = new QueryList()
    nodes.forEach(node => {
      _get(other, 'nodes', []).forEach(ot => {
        const merged = node.merge(ot)
        if (merged) queryList.push(merged)
      })
    })
    return queryList
  }

  clone (parent) {
    const queryList = new QueryList()
    const { nodes, lineno, column, filename } = this
    nodes.forEach(node => { queryList.push(node.clone(parent, queryList)) })
    return Object.assign(queryList, {
      lineno,
      column,
      filename
    })
  }

  toString () {
    return `(${this.nodes.map(node => node.toString()).join(', ')})`
  }

  toJSON () {
    const { nodes, lineno, column, filename } = this
    return {
      nodes,
      lineno,
      column,
      filename,
      __type: 'QueryList'
    }
  }
}
