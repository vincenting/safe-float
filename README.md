## SafeFloat

> Safe operations for float numbers in JavaScript.

![Error ScreenShot](https://raw.githubusercontent.com/vincenting/safe-float/master/screenshot.png)

### Install

* `yarn add safe-float`

### Usage

> Current `SafeFloat` support plus, minus, and multiply operations.

```javascript
const { minus, plus, multiply } = require('safe-float')

plus('0.1', '0.2') // Output: '0.3'
minus('0.1', '0.01') // Output: '0.09'
multiply('0.2', '0.1') // Output: '0.02'
```

### Build & Test

```bash
npm install
npm test
```
