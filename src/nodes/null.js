import Node from './node'
import { falseInsta } from './index'

export default class Null extends Node {
  constructor () {
    super()
  }

  get isNull () {
    return true
  }

  get hash () {
    return null
  }

  toString () {
    return 'null'
  }

  toBoolean () {
    return falseInsta
  }
  
  toJSON () {
    const { lineno, column, filename } = this
    return { lineno, column, filename, __type: 'Null' }
  }
}
