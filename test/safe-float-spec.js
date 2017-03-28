const should = require('should')
const SafeFloat = require('../lib/safe-float')

describe('Plus', function () {
  it('should always return string', function () {
    SafeFloat.plus('0.111', '0.222').should.be.type('string')
  })

  it('should throw error unless pass string as params', function () {
    should.throws(function () {
      return SafeFloat.plus(1, 0)
    }, Error, 'Only allow string arguments for precision reasons.')
  })

  it('should always be accurate in calculations.', function () {
    SafeFloat.plus('0.111', '0.222').should.equal('0.333')
    SafeFloat.plus('1.111', '0.00000001').should.equal('1.11100001')
    SafeFloat.plus('0.000001', '.0').should.equal('0.000001')
    SafeFloat.plus('1.0000999', '0.0000001').should.equal('1.0001')
    SafeFloat.plus('1.0000999', '-0.0000001').should.equal('1.0000998')
    SafeFloat.plus('1.9', '.5').should.equal('2.4')
    SafeFloat.plus('1', '1.0').should.equal('2')
    SafeFloat.plus('12', '88').should.equal('100')
    SafeFloat.plus('12', '-88').should.equal('-76')
  })
})

describe('Minus', function () {
  it('should always be accurate in calculations.', function () {
    SafeFloat.minus('0.111', '0.222').should.equal('-0.111')
    SafeFloat.minus('0.111', '-0.222').should.equal('0.333')
    SafeFloat.minus('1', '2').should.equal('-1')
    SafeFloat.minus('-2.99', '0.99').should.equal('-3.98')
    SafeFloat.minus('-2', '0.222').should.equal('-2.222')
    SafeFloat.minus('-2', '-4.52').should.equal('2.52')
  })
})

describe('Multiply', function () {
  it('should always be accurate in calculations.', function () {
    SafeFloat.multiply('0.11', '0.22').should.equal('0.0242')
    SafeFloat.multiply('0.5', '0.22').should.equal('0.11')
    SafeFloat.multiply('5', '0.2').should.equal('1')
    SafeFloat.multiply('5', '-0.222').should.equal('-1.11')
  })
})
