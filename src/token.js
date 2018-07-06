import { inspect } from 'util'

export default class Token {
  constructor (type, val) {
    this.type = type
    this.val = val
  }

  inspect () {
    const val = inspect(this.val)
    return `[Token:${this.lineno}:${this.column} \x1b[32m${this.type}\x1b[0m\x1b[33m${this.val ? val : ''}\x1b[0m]`
  }

  toString () {
    return undefined === (this.val ? this.type : this.val).toString()
  }
}
