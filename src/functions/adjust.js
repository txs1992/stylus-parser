import { assertType, assertColor, assertString } from '../utils'

export default function adjust (color, prop, amount) {
  assertColor(color, 'color')
  assertString(prop, 'prop')
  assertType(amount, 'unit', 'amount')
  const hsla = color.hsla.clone()
  const hsl = { hue: 'h', saturation: 's', lightness: 'l' }
  const key = hsl[prop.string]
  
  if (!key) throw new Error('invalid adjustment property')
  let val = amount.val
  if (amount.type === '%') {
    val = key === 'l' && val > 0
      ? (100 - hsla[key]) * val / 100
      : hsla[key] * (val / 100)
  }
  hsla[key] += val
  return hsla.rgba
}
