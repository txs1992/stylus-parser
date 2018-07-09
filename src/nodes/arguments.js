import { get as _get } from 'noshjs'
import { Expression } from './index'

export function fromExpression (expr) {
  const args = new Arguments()
  args.lineno = expr.lineno
  args.column = expr.column
  args.isList = expr.isList
  expr.nodes.forEach(node => { args.push(node) })
  return args
}

export default class Arguments extends Expression {
  constructor () {
    super()
    Expression.call(this)
    this.map = {}
  }

  clone (parent) {
    const cloneMap = {}
    const { map, lineno, column, isList, filename } = this
    const arguments = Expression.prototype.clone.call(this, parent)
    Object.keys(map).forEach(key => {
      cloneMap[key] = _get(map, [key, 'clone'], it => it)(parent, arguments)
    })
    return Object.assign(arguments, { lineno, column, isList, filename, map: cloneMap })
  }

  toJSON () {
    const { map, nodes, lineno, column, isList, preserve, filename } = this
    return { map, nodes, lineno, column, isList, preserve, filename, __type: 'Arguments' }
  }
}
