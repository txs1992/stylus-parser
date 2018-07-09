'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Expression = function Expression() {
  classCallCheck(this, Expression);
};

var Boolean = function Boolean() {
  classCallCheck(this, Boolean);
};

var boolTrue = true;

var boolFalse = false;

var nodes = {
  Boolean: Boolean,
  boolTrue: boolTrue,
  boolFalse: boolFalse,
  Expression: Expression
};

/**
 * Unwrap `expr`.
 * Takes an expressions with length of 1
 * such as `((1 2 3))` and unwraps it to `(1 2 3)`.
 * @param {Expression} expr
 * @return {Node}
 */

function unwrap(expr) {
  // explicitly preserve the expression
  var arg = 'arguments';
  var exp = 'expression';
  if (expr.preserve) return expr;
  if (expr.nodeName !== arg && expr.nodeName !== exp) return expr;
  if (expr.nodes.length !== 1) return expr;
  if (expr.nodes[0].nodeName !== arg && expr.nodes[0].nodeName !== exp) return expr;
  return unwrap(expr.nodes[0]);
}

var ParseError = function (_Error) {
  inherits(ParseError, _Error);

  function ParseError(msg) {
    classCallCheck(this, ParseError);

    var _this = possibleConstructorReturn(this, (ParseError.__proto__ || Object.getPrototypeOf(ParseError)).call(this));

    _this.name = 'ParseError';
    _this.message = msg;
    Error.captureStackTrace(_this, ParseError);
    return _this;
  }

  return ParseError;
}(Error);

var SyntaxError = function (_Error2) {
  inherits(SyntaxError, _Error2);

  function SyntaxError(msg) {
    classCallCheck(this, SyntaxError);

    var _this2 = possibleConstructorReturn(this, (SyntaxError.__proto__ || Object.getPrototypeOf(SyntaxError)).call(this));

    _this2.name = 'SyntaxError';
    _this2.message = msg;
    Error.captureStackTrace(_this2, SyntaxError);
    return _this2;
  }

  return SyntaxError;
}(Error);

var CoercionError = function (_Error3) {
  inherits(CoercionError, _Error3);

  function CoercionError(msg) {
    classCallCheck(this, CoercionError);

    var _this3 = possibleConstructorReturn(this, (CoercionError.__proto__ || Object.getPrototypeOf(CoercionError)).call(this));

    _this3.name = 'CoercionError';
    _this3.message = msg;
    Error.captureStackTrace(_this3, CoercionError);
    return _this3;
  }

  return CoercionError;
}(Error);

var Evaluator = function Evaluator() {
  classCallCheck(this, Evaluator);
};

var Node = function () {
  function Node() {
    classCallCheck(this, Node);

    this.lineno = nodes.lineno || 1;
    this.column = nodes.column || 1;
    this.filename = nodes.filename;
  }

  createClass(Node, [{
    key: 'clone',
    value: function clone() {
      return this;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        lineno: this.lineno,
        column: this.column,
        filename: this.filename
      };
    }
  }, {
    key: 'eval',
    value: function _eval() {
      return new Evaluator(this).evaluate();
    }
  }, {
    key: 'toBoolean',
    value: function toBoolean() {
      return nodes.boolTrue;
    }
  }, {
    key: 'toExpression',
    value: function toExpression() {
      if (this.nodeName === 'expression') return this;
      var expr = new nodes.Expression();
      expr.push(this);
      return expr;
    }
  }, {
    key: 'shouldCoerce',
    value: function shouldCoerce(op) {
      switch (op) {
        case 'is a':
        case 'in':
        case '||':
        case '&&':
          return false;
        default:
          return true;
      }
    }
  }, {
    key: 'operate',
    value: function operate(op, right) {
      switch (op) {
        case 'is a':
          if (right.first.nodeName === 'string') {
            return nodes.Boolean(this.nodeName === right.val);
          } else {
            throw new Error('"is a" expects a string, got ' + right.toString());
          }
        case '==':
          return nodes.Boolean(this.hash === right.hash);
        case '!=':
          return nodes.Boolean(this.hash !== right.hash);
        case '>=':
          return nodes.Boolean(this.hash >= right.hash);
        case '<=':
          return nodes.Boolean(this.hash <= right.hash);
        case '>':
          return nodes.Boolean(this.hash > right.hash);
        case '<':
          return nodes.Boolean(this.hash < right.hash);
        case '||':
          return this.toBoolean().isTrue ? this : right;
        case 'in':
          var vals = unwrap(right).nodes;
          var hash = this.hash;
          var len = vals.length;
          if (!vals || !len) throw new Error('"in" given invalid right-hand operand, expecting an expression');
          // 'prop' in obj
          if (len === 1 && vals[0].nodeName === 'object') return nodes.Boolean(vals[0].has(this.hash));
          var hasHash = vals.find(function (val) {
            return val.hash === hash;
          });
          return hasHash ? nodes.boolTrue : nodes.boolFalse;
        case '&&':
          var boola = this.toBoolean();
          var boolb = right.toBoolean();
          return boola.isTrue && boolb.isTrue ? right : boola.isFalse ? this : right;
        default:
          var firstMsg = 'cannot perform';
          var msg = op === '[]' ? firstMsg + ' ' + this + ' [' + right + ']' : firstMsg + ' ' + this + ' ' + op + ' ' + right;
          throw new Error(msg);
      }
    }
  }, {
    key: 'coerce',
    value: function coerce(other) {
      if (other.nodeName === this.nodeName) return other;
      throw new CoercionError('cannot coerce ' + other + ' to ' + this.nodeName);
    }
  }, {
    key: 'first',
    get: function get$$1() {
      return this;
    }
  }, {
    key: 'hash',
    get: function get$$1() {
      return this.val;
    }
  }, {
    key: 'nodeName',
    get: function get$$1() {
      return this.constructor.name.toLowerCase();
    }
  }]);
  return Node;
}();

var index = {
  msg: 'hellow stylus to AST',
  Node: Node
};

module.exports = index;
