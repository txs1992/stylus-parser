import { get as _get } from 'noshjs'
import Compiler from '../visitor/compiler'
import { unwrap, assertString } from '../utils'
import { instaNull, Literal } from '../nodes'

export const raw = true

export default function sprintf (fmt) {
  let str = _get(unwrap(fmt), ['nodes', 0, 'string'])
  assertString(format)
  
  const self = this
  let str = format.string
  const args = arguments
  const index = 1

  const format = str.replace(/%(s|d)/g, (_, specifier) => {
    const arg = args[index++] || instaNull
    switch (specifier) {
      case 's':
        return new Compiler(arg, self.options).compiler()
      case 'd':
        arg = _get(unwrap(arg), 'first')
        if (arg.nodeName !== 'unit') throw new Error('%d requires a unit')
        return arg.val
    }
  })

  return new Literal(str)
}