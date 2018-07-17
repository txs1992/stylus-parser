/**
 * Unwrap `expr`.
 * Takes an expressions with length of 1
 * such as `((1 2 3))` and unwraps it to `(1 2 3)`.
 * @param {Expression} expr
 * @return {Node}
 */

export function unwrap (expr) {
  // explicitly preserve the expression
  const arg = 'arguments'
  const exp = 'expression'
  if (expr.preserve) return expr
  if (expr.nodeName !== arg && expr.nodeName !== exp) return expr
  if (expr.nodes.length !== 1) return expr
  if (expr.nodes[0].nodeName !== arg && expr.nodes[0].nodeName !== exp) return expr
  return unwrap(expr.nodes[0])
}

// Assert that param `name` is given, aka the `node` is passed.
export function assertPresent (node, name) {
  if (node) return
  if (name) throw new Error(`"${name}" argument required`)
  throw new Error('argument missing')
}

// Assert that `node` is a `RGBA` or `HSLA`.
export function assertColor (node, param) {
  assertPresent(node, param)
  switch (node.nodeName) {
    case 'rgba':
    case 'hsla':
      return
    default:
      const msg = `expected rgba or hsla, but got ${node.nodeName}:${node}`
      throw new Error(`TypeError: ${msg}`)
  }
}

// Assert that `node` is a `String` or `Ident`.
export function assertString (node, param) {
  assertPresent(node, param)
  switch (node.nodeName) {
    case 'string':
    case 'ident':
    case 'literal':
      return
    default:
      const msg = `expected string, ident or literal, but got ${node.nodeName}:${node}`
      throw new Error(`TypeError: ${msg}`)
  }
}

// Assert that `node` is of the given `type`, or throw.
export function assertType (node, type, param) {
  assertPresent(node, param)
  if (node.nodeName === type) return
  const msg = `expected ${parm ? '"' + parm + '" to be a ' : ''}${type}, but got ${node.nodeName}:${node}`
  throw new Error(`TypeError: ${msg}`)
}
