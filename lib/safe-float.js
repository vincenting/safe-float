"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var trimEnd = require('lodash.trimend');

/**
 * Create a special string with len zeros chars.
 * @param {number} len
 */
function zeros(len) {
  return Array(Math.max(len, 0)).fill().map(function () {
    return '0';
  }).join('');
}

/**
 *
 * @param {number} integer
 * @param {number} decimals
 * @param {number} len
 */
function numberCombine(integer, decimals, len) {
  if (decimals === 0) return '' + integer;

  var isMinus = integer < 0;
  var _ref = [Math.abs(integer), isMinus ? -decimals : decimals],
      x = _ref[0],
      y = _ref[1];

  if (y > Math.pow(10, len)) {
    x += 1;
    y -= Math.pow(10, len);
  } else if (y < 0) {
    if (x > 0) {
      x -= 1;
      y += Math.pow(10, len);
    } else if (x == 0) {
      isMinus = true;
    }
  }
  var holders = Array(len - ('' + Math.abs(y)).length).fill().map(function () {
    return '0';
  }).join('');
  return trimEnd('' + (isMinus ? '-' : '') + Math.abs(x) + '.' + holders + Math.abs(y), '0');
}

/**
 *  plus is a function will return the sum of augend and addend.
 * @param {string} augend
 * @param {string} addend
 */
function plus(augend, addend) {
  if ([augend, addend].some(function (item) {
    return typeof item !== 'string';
  })) {
    throw new Error('Only allow string arguments for precision reasons.');
  }
  var maxLen = Math.max.apply(Math, _toConsumableArray([augend, addend].map(function (i) {
    return (('' + i).split('.')[1] || '').length;
  })));
  var inputs = [augend, addend].map(function (ipt) {
    var _ipt$replace$split$ma = ipt.replace('-', '').split('.').map(function (i) {
      return i || '0';
    }),
        _ipt$replace$split$ma2 = _slicedToArray(_ipt$replace$split$ma, 2),
        x = _ipt$replace$split$ma2[0],
        y = _ipt$replace$split$ma2[1];

    return [x, '' + y + zeros(maxLen - (y || '').length)].map(function (i) {
      return (ipt < 0 ? -1 : 1) * (i ? parseInt(i, 10) : 0);
    });
  });

  var _inputs$reduce = inputs.reduce(function (pre, _ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        i = _ref3[0],
        j = _ref3[1];

    return [pre[0] + i, pre[1] + (j || 0)];
  }, [0, 0]),
      _inputs$reduce2 = _slicedToArray(_inputs$reduce, 2),
      integer = _inputs$reduce2[0],
      decimals = _inputs$reduce2[1];

  return numberCombine(integer, decimals, maxLen);
}

/**
 * minus is a function will return the subtraction of minuend and subtrahend.
 * @param {string} minuend
 * @param {string} subtrahend
 */
function minus(minuend, subtrahend) {
  if (subtrahend[0] === '-') {
    return module.exports.plus(minuend, subtrahend.replace('-', ''));
  }
  return module.exports.plus(minuend, '-' + subtrahend);
}

/**
 * multiply is a function will return the product of multiplicand and multiplier.
 * @param {string} multiplicand
 * @param {string} multiplier
 */
function multiply(multiplicand, multiplier) {
  if ([multiplicand, multiplier].some(function (item) {
    return typeof item !== 'string';
  })) {
    throw new Error('Only allow string arguments for precision reasons.');
  }
  var transform = function transform(i) {
    return [i.replace('.', ''), i.indexOf('.') < 0 ? 0 : i.length - i.indexOf('.') - 1];
  };

  var _map$reduce = [multiplicand, multiplier].map(transform).reduce(function (pre, _ref4) {
    var _ref5 = _slicedToArray(_ref4, 2),
        r = _ref5[0],
        o = _ref5[1];

    return {
      result: pre.result * r,
      offset: pre.offset + o
    };
  }, { result: 1, offset: 0 }),
      result = _map$reduce.result,
      offset = _map$reduce.offset;

  var holder = ('' + result).length > offset ? '' + result : '' + zeros(offset - ('' + result).length + 1) + result;
  var sliceIndex = holder.length - offset;
  var product = trimEnd([holder.substr(0, sliceIndex), holder.substr(sliceIndex)].join('.'), '0');
  if (product[product.length - 1] === '.') {
    return product.replace('.', '');
  }
  return product;
}

module.exports = {
  plus: plus,
  minus: minus,
  multiply: multiply
};