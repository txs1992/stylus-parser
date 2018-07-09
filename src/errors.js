export class ParseError extends Error {
  constructor (msg) {
    super()
    this.name = 'ParseError'
    this.message = msg
    Error.captureStackTrace(this, ParseError)
  }
}

export class SyntaxError extends Error {
  constructor (msg) {
    super()
    this.name = 'SyntaxError'
    this.message = msg
    Error.captureStackTrace(this, SyntaxError)
  }
}

export class CoercionError extends Error {
  constructor (msg) {
    super()
    this.name = 'CoercionError'
    this.message = msg
    Error.captureStackTrace(this, CoercionError)
  }
}
