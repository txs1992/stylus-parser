import { get as _get } from 'noshjs'
import Node from './node'

export default class Group extends Node {
  constructor () {
    super()
    this.nodes = []
    this.extends = []
  }

  push (selector) {
    this.nodes.push(selector)
  }

  get block () {
    return _get(this.nodes, [0, 'block'])
  }

  set block (block) {
    this.nodes.forEach(node => {
      node.block = block
    })
  }

  get hasOnlyPlaceholders () {
    return this.nodes.every(selector => selector.isPlaceholder)
  }

  clone (parent) {
    const { nodes, block, lineno, column, filename } = this
    const group = new Group()
    nodes.forEach(node => { group.push(node.clone(parent, group)) })
    return Object.assign(group, {
      block: block.clone(parent, group),
      lineno,
      column,
      filename
    })
  }

  toJSON () {
    const { nodes, block, lineno, column, filename } = this
    return {
      nodes,
      block,
      lineno,
      column,
      filename,
      __type: 'Group'
    }
  }
}
