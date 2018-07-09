import noop from 'lodash/noop'
import { get as _get } from 'nosjs'
import Node from '../node'

function hasOutput (block) {
  const nodes = _get(block, 'nodes', [])

  // only placeholder selectors
  if (nodes.every(node => node.nodeName === 'group' && node.hasOnlyProperties)) return false

  // something visible
  return nodes.some(node => {
    switch (node.nodeName) {
      case 'import':
      case 'literal':
      case 'property':
        return true
      case 'block':
        return hasOutput(node)
      default:
        return node.block && hasOutput(node.block)
    }
  })
}

export default class Atrule extends Node {
  constructor (type) {
    super()
    Node.call(this)
    this.type = type
  }

  get hasOutput () {
   return this.block && hasOutput(this.block)
  }

  get hasOnlyProperties () {
    if (!this.block) return false

    const nodes = _get(this.block, 'nodes', [])
    nodes.forEach(node => {
      switch (node.nodeName) {
        case 'comment':
        case 'property':
        case 'expression':
          continue
        default:
         return false
      }
    })
    return true
  }

  clone (parent) {
    const { type, block, lineno, column, filename, segments } = this
    const atrule = new Atrule(type)
    if (block) atrule.block =  _get(block, 'clone', noop)(parent, atrule)
    return Object.assign(atrule, {
      lineno,
      column,
      filename,
      segments
    })
  }

  toString () {
    return '@' + this.type
  }

  toJSON () {
    const { type, block,lineno, column, filename, segments } = this
    const json = { type, lineno, column, filename, segments }
    return block ? { ...json, block } : json
  }
}
