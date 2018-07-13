import { get as _get } from 'noshjs'
import { fromRGBA } from './hsla'
import { Node, Unit, String, instaTrue } from './index'
import adjust from '../functions/adjust'

//  Clamp `n` >= 0 and <= 255.
function clamp (n) {
  return Math.max(0, Math.min(n.toFixed(0), 255))
}

// Clamp alpha `n` >= 0 and <= 1.
function clampAlpha (n) {
  return Math.max(0, Math.min(n, 1))
}

// Return an `RGBA` without clamping values.
export function withoutClamping (r, g, b, a) {
  const rgba = new RGBA(0, 0, 0, 0)
  rgba.r = r
  rgba.g = g
  rgba.b = b
  rgba.a = a
  return rgba
}

// Return a `RGBA` from the given `hsla`.
export function fromHSLA ({h, s, l, a}) {
  const th = h / 360
  const ts = s / 100
  const tl = l / 100

  const m2 = tl <= 0.5 ? tl * (ts + 1) : tl + ts - tl * ts
  const m1 = tl * 2 - m2

  const r = hue(th + 1/3) * 0xff
  const g = hue(th) * 0xff
  const b = hue(th - 1 / 3) * 0xff

  return new RGBA(r, g, b, a)

  function hub (h) {
    if (h < 0) ++h
    if (h > 1) --h
    if (h * 6 < 1) return m1 + (m2 - m1) * h * 6
    if (h * 2 < 1) return m2
    if (h * 3 < 2) return m1 + (m2 - m1) * (2/3 - h) * 6
    return m1
  }
}

export default class RGBA extends Node {
  constructor (r, g, b, a) {
    super()
    this.r = clamp(r)
    this.g = clamp(g)
    this.b = clamp(b)
    this.a = clampAlpha(a)
    this.name = ''
    this.rgba = this
  }

  get hsla () {
    return fromRGBA(this)
  }

  get hash () {
    return this.toString()
  }

  add (tr, tg, tb, ta) {
    const { r, g, b, a } = this
    return new RGBA(r + tr, g + tg, b + tb, a + ta)
  }

  sub (tr, tg, tb, ta) {
    const { r, g, b, a } = this
    return new RGBA(r - tr, g - tg, b - tb, a === 1 ? a : a - ta)
  }

  multiply (n) {
    const { r, g, b, a } = this
    return new RGBA(r * n, g * n, b * n, a)
  }

  divide (n) {
    const { r, g, b, a } = this
    return new RGBA(r / n, g / n, b / n, a)
  }

  operate (op, right) {
    const { hsla } = this
    const { h, s, l } = hsla
    const first = op !== 'in' ? right : right.first
    const { r, g, b, a, val, type, string, nodeName } = first

    switch (op) {
      case 'is a':
        if (nodeName === 'string' && string === 'color') return instaTrue
        break
      case '+':
        switch (nodeName) {
          case 'unit':
            switch (type) {
              case '%':
                return adjust(this, new String('lightness'), first)
              case 'deg':
                return _get(hsla.adjustHue(val), 'rgba')
              default:
                return this.add(val, val, val, 0)
            }
          case 'rgba':
            return this.add(r, g, b, a)
          case 'hsla':
            return hsla.add(h, s, l)
        }
        break
      case '-':
        switch (nodeName) {
          case 'unit':
            switch (type) {
              case '%':
                return adjust(this, new String('lightness'), new Unit(-val, '%'))
              case 'deg':
                return _get(hsla.adjustHue(-val), 'rgba')
              default:
                return this.sub(val, val, val, 0)
            }
          case 'rgba':
            return this.sub(r, g, b, a)
          case 'hsla':
            return hsla.sub(h, s, l)
        }
        break
      case '*':
        if (nodeName === 'unit') return this.multiply(val)
        break
      case '/':
        if (nodeName === 'unit') return this.divide(val)
        break
    }
    return Node.prototype.operate.call(this, op, first)
  }

  clone () {
    const { r, g, b, a, raw, name, lineno, column, filename } = this
    const rgba = new RGBA(r, g, b, a)
    return Object.assign(rgba, {
      raw,
      name,
      lineno,
      column,
      filename
    })
  }

  toBoolean () {
    return instaTrue
  }

  toString () {
    const { r, g, b, a , name } = this
    if (name === 'transparent') return name

    if (a === 1) {
      const pr = pad(r)
      const pg = pad(g)
      const pb = pad(b)

      if (pr[0] === pr[1] && pg[0] === pg[1] && pb[0] === pb[1]) {
        return `#${pr[0] + pg[0] + pb[0]}`
      } else {
        return `#${pr + pg + pb}`
      }
    } else {
      return `rgba(${r},${g},${b},${a.toFixed(3)})`
    }

    function pad (num) {
      return num < 16 ? `0${num.toString(16)}` : num.toString(16)
    }
  }

  toJSON () {
    const { r, g, b, a, raw, name, lineno, column, filename } = this
    return {
      r,
      g,
      b,
      a,
      raw,
      name,
      lineno,
      column,
      filename,
      __type: 'RGBA'
    }
  }
}
