(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.StylusToAST = factory());
}(this, (function () { 'use strict';

  var index = {
    msg: 'hellow stylus to AST'
  };

  return index;

})));
