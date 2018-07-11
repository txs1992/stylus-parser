import { get as _get } from 'noshjs'
import Node from './node'
import { fromHSLA } from './rgba'

function clampDegrees (num) {
  const res = num % 360
  return res >= 0 ? res : 360 + res
}

function clampPercentage (num) {
  return Math.max(0, Math.min(num, 100))
}

function clampAlpha (num) {
  return Math.max(0, Math.min(num, 1))
}

export function fromRGBA ({ r, g, b, a }) {
  const tr = r / 255
  const tg = g / 255
  const tb = b / 255
  const min = Math.min(tr, tg, tb)
  const max = Math.max(tr, tg, tb)
  const l = (max + min) / 2
  const d = max - min
  
  let h = 0
  let s = 0

  switch (max) {
    case min:
      h = 0 
      break
    case tr:
      h = 60 * (tg - tb) / d
      break
    case tg:
      h = 60 * (tb - tr) / d + 120
      break
    case tb:
      h = 60 * (tr - tg) / d + 240
      break
  }

  if (max === min) {
    s = 0
  } else if (l < 0.5) {
    s = d / (2 * l)
  } else {
    s = d / (2 - 2 * l)
  }

  h %= 360
  s *= 100
  l *= 100

  return new HSLA(h, s, l, a)
}

export default class HSLA extends Node {
  constructor (h, s, l, a) {
    super()
    this.h = clampDegrees(h)
    this.s = clampPercentage(s)
    this.l = clampPercentage(l)
    this.a = clampAlpha(a)
    this.hsla = this
  }

  get rgba () {
    return fromHSLA(this)
  }

  get hash () {
    return this.rgba.toString()
  }

  add (th, ts, tl) {
    const {h, s, l, a} = this
    return new HSLA(h + th, s + ts, l + tl, a)
  }

  sub (h, s, l) {
    return this.add(-h, -s, -l)
  }

  operate (op, right) {
    const { rgba } = this
    switch (op) {
      case '==':
      case '!=':
      case '<=':
      case '>=':
      case '<':
      case '>':
      case 'is a':
      case '||':
      case '&&':
        return rgba.operate(op, right)
      default:
        return _get(rgba.operate(op, right), 'hsla')
    }
  }

  adjustLightness (percent) {
    const { l } = this
    this.l = clampPercentage(l + l * (percent / 100))
    return this
  }

  adjustHue (deg) {
    this.h = clampDegrees(this.h + deg)
    return this
  }

  clone () {
    const { h, s, l, a, lineno, column, filename } = this
    const hsla = new HSLA(h, s, l, a)
    return Object.assign(hsla, {
      lineno,
      column,
      filename
    })
  }

  toString () {
    const { h, s, l, a } = this
    return `hsla(${h},${s.toFixed(0)}%,${l.toFixed(0)}%,${a})`
  }

  toJSON () {
    const { h, s, l, a, lineno, column, filename } = this
    return {
      h,
      s,
      l,
      a,
      lineno,
      column,
      filename,
      __type: 'HSLA'
    }
  }
}
