"use strict"

const trimEnd = require('lodash.trimend')

/**
 *
 * @param {number} integer
 * @param {number} decimals
 * @param {number} len
 */
function numberFormat(integer, decimals, len) {
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
    return ([x, `${y}${Array(Math.max(maxLen - (y || '').length, 0)).fill().map(() => '0').join('')}`])
      .map(i => (ipt < 0 ? -1 : 1) * (i ? parseInt(i, 10) : 0))
  })
  const [integer, decimals] = inputs
    .reduce((pre, [i, j]) => [pre[0] + i, pre[1] + (j || 0)], [0, 0])
  return numberFormat(integer, decimals, maxLen)
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

module.exports = {
  plus: plus,
  minus: minus,
}
