"use strict"

const trimEnd = require('lodash.trimend')

/**
 * Create a special string with len zeros chars.
 * @param {number} len
 */
function zeros(len) {
  return Array(Math.max(len, 0)).fill().map(() => '0').join('')
}

/**
 *
 * @param {number} integer
 * @param {number} decimals
 * @param {number} len
 */
function numberCombine(integer, decimals, len) {
  if (decimals === 0) return `${integer}`

  let isMinus = integer < 0
  let [x, y] = [Math.abs(integer), isMinus ? -decimals : decimals]
  if (y > Math.pow(10, len)) {
    x += 1
    y -= Math.pow(10, len)
  } else if (y < 0) {
    if (x > 0) {
      x -= 1
      y += Math.pow(10, len)
    } else if (x == 0) {
      isMinus = true
    }
  }
  const holders = Array(len - `${Math.abs(y)}`.length).fill().map(() => '0').join('')
  return trimEnd(`${isMinus ? '-' : ''}${Math.abs(x)}.${holders}${Math.abs(y)}`, '0')
}

/**
 *  plus is a function will return the sum of augend and addend.
 * @param {string} augend
 * @param {string} addend
 */
function plus(augend, addend) {
  if (([augend, addend]).some(item => typeof (item) !== 'string')) {
    throw new Error('Only allow string arguments for precision reasons.')
  }
  const maxLen = Math.max(...([augend, addend]).map(i => (`${i}`.split('.')[1] || '').length))
  const inputs = ([augend, addend]).map((ipt) => {
    const [x, y] = ipt.replace('-', '').split('.').map(i => i || '0')
    return ([x, `${y}${zeros(maxLen - (y || '').length)}`])
      .map(i => (ipt < 0 ? -1 : 1) * (i ? parseInt(i, 10) : 0))
  })
  const [integer, decimals] = inputs
    .reduce((pre, [i, j]) => [pre[0] + i, pre[1] + (j || 0)], [0, 0])
  return numberCombine(integer, decimals, maxLen)
}

/**
 * minus is a function will return the subtraction of minuend and subtrahend.
 * @param {string} minuend
 * @param {string} subtrahend
 */
function minus(minuend, subtrahend) {
  if (subtrahend[0] === '-') {
    return module.exports.plus(minuend, subtrahend.replace('-', ''))
  }
  return module.exports.plus(minuend, `-${subtrahend}`)
}

/**
 * multiply is a function will return the product of multiplicand and multiplier.
 * @param {string} multiplicand
 * @param {string} multiplier
 */
function multiply(multiplicand, multiplier) {
  if (([multiplicand, multiplier]).some(item => typeof (item) !== 'string')) {
    throw new Error('Only allow string arguments for precision reasons.')
  }
  const transform = i => [i.replace('.', ''), i.indexOf('.') < 0 ? 0 : i.length - i.indexOf('.') - 1]
  const { result, offset } = ([multiplicand, multiplier]).map(transform)
    .reduce((pre, [r, o]) => ({
      result: pre.result * r,
      offset: pre.offset + o,
    }), { result: 1, offset: 0 })
  const holder = `${result}`.length > offset ? `${result}` : `${zeros(offset - `${result}`.length + 1)}${result}`
  const sliceIndex = holder.length - offset
  const product = trimEnd([holder.substr(0, sliceIndex), holder.substr(sliceIndex)].join('.'), '0')
  if (product[product.length - 1] === '.') {
    return product.replace('.', '')
  }
  return product
}

module.exports = {
  plus: plus,
  minus: minus,
  multiply: multiply,
}
