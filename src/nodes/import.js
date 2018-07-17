import Node from './node'

export default class Import extends Node {
  constructor (expr, once) {
    super()
    this.path = expr
    this.once = once || false
  }

  clone (parent) {
    const { path, once, mtime, lineno, column, filename } = this
    const importInsta = new Import()
    return Object.assign(importInsta, {
      path: path.nodeName ? path.clone(parent, importInsta) : path,
      once,
      mtime,
      lineno,
      column,
      filename
    })
  }

  toJSON () {
    const { path, once, mtime, lineno, column, filename } = this
    return {
      path,
      once,
      mtime,
      lineno,
      column,
      filename,
      __type: 'Import'
    }
  }
}
