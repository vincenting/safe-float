## SafeFloat

> Safe operations for float numbers in JavaScript.

### Install

* `yarn add safe-float`

### Usage

* `SafeFloat.plus('1', '2')` => 3
* `SafeFloat.minus('1', '2')` => -1
* `SafeFloat.multiply('1', '2')` => 2
* With Number.prototype.toFixed => `(+SafeFloat.plus('1', '2')).toFixed(2)` => 3.00
