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
