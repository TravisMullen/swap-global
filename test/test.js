/* global WebAssembly */

const pkg = require('../package.json')
const assert = require('assert')
const swapGlobal = require('..')

const predefinedPropertyNames = [
  'isNaN',
  'WebAssembly',
  'somePredefinedFunction',
  'somePredefinedPrimative',
  'anotherPredefinedPrimative'
]

const swappedPropertyNames = [
  ...predefinedPropertyNames,
  'someCustomProperty',
  'anotherCustomProperty'
]

console.log(`
Starting tests...
`)

/** similute something set in global by another worker. */
const predefinedFunction = function () {
  return 'this is already being used for a function.'
}
global.somePredefinedFunction = predefinedFunction
assert.strictEqual(global.somePredefinedFunction, predefinedFunction, 'global.somePredefinedFunction should defined as predefinedFunction')

const predefinedPrimative = 'this is already being used for a string.'
global.somePredefinedPrimative = predefinedPrimative
assert.strictEqual(global.somePredefinedPrimative, predefinedPrimative, 'global.somePredefinedPrimative should defined as predefinedPrimative')

global.anotherPredefinedPrimative = predefinedPrimative
assert.strictEqual(global.anotherPredefinedPrimative, predefinedPrimative, 'global.anotherPredefinedPrimative should defined as predefinedPrimative')

/** check an already defined global property as a control test */
assert.strictEqual(typeof (isNaN), 'function', 'NaN should be a function')
assert.strictEqual(typeof (WebAssembly), 'object', 'WebAssembly should be an object')

/** define properties */
const customFunction = function () {
  return 'custom function.'
}
const customPrimative = 'custom string.'

swapGlobal.swap('isNaN', customFunction)
assert.strictEqual(isNaN, customFunction, 'isNaN should now be a custom function')
assert.strictEqual(isNaN(), 'custom function.', 'isNaN should now equal the value of the function when called')

swapGlobal.swap('WebAssembly', customFunction)
assert.strictEqual(WebAssembly, customFunction, 'WebAssembly should now be a custom function')
assert.strictEqual(WebAssembly(), 'custom function.', 'WebAssembly should now equal the value of the function when called')

swapGlobal.swap('somePredefinedFunction', customFunction)
assert.strictEqual(global.somePredefinedFunction, customFunction, 'somePredefinedFunction should be a custom function')
assert.strictEqual(global.somePredefinedFunction(), 'custom function.', 'somePredefinedFunction should equal the value of the function when called')

swapGlobal.swap('somePredefinedPrimative', customPrimative)
assert.strictEqual(global.somePredefinedPrimative, customPrimative, 'somePredefinedPrimative should be a custom primative')
assert.strictEqual(global.somePredefinedPrimative, 'custom string.', 'somePredefinedPrimative should equal the value of the primative')

swapGlobal.swap('somePredefinedFunction', customFunction)
assert.strictEqual(global.somePredefinedFunction, customFunction, 'somePredefinedFunction should be a custom function')
assert.strictEqual(global.somePredefinedFunction(), 'custom function.', 'somePredefinedFunction should equal the value of the function when called')

swapGlobal.swap('somePredefinedPrimative', customPrimative)
assert.strictEqual(global.somePredefinedPrimative, customPrimative, 'somePredefinedPrimative should be a custom primative')
assert.strictEqual(global.somePredefinedPrimative, 'custom string.', 'somePredefinedPrimative should equal the value of the primative')

/** shoud be able to call swapped again and maintain original legacy value */
const anotherCustomPrimative = 'another custom string.'
swapGlobal.swap('WebAssembly', anotherCustomPrimative)
assert.strictEqual(WebAssembly, anotherCustomPrimative, 'WebAssembly should now be a string')

/** check existing can be swapped with undefined */
swapGlobal.swap('anotherPredefinedPrimative', undefined)
assert.strictEqual(global.anotherPredefinedPrimative, undefined, 'anotherPredefinedPrimative should be typeof undefined')

/** check existing can be swapped with undefined */
assert.strictEqual(global.someCustomProperty, undefined, 'global.someCustomProperty should not yet be defined')
swapGlobal.swap('someCustomProperty', customFunction)
assert.strictEqual(global.someCustomProperty, customFunction, 'someCustomProperty should be a custom function')

assert.strictEqual(global.anotherCustomProperty, undefined, 'global.anotherCustomProperty should not yet be defined')
swapGlobal.swap('anotherCustomProperty', customPrimative)
assert.strictEqual(global.anotherCustomProperty, customPrimative, 'anotherCustomProperty should be a custom function')

/** check values and pointers being held */
assert.deepStrictEqual(swapGlobal.inMemory(), predefinedPropertyNames, 'should be holding predefined properties in memory')
assert.deepStrictEqual(swapGlobal.pending(), swappedPropertyNames, 'should be holding properties')

/** restore globals to original state */
const restored = swapGlobal.restore()
assert.deepStrictEqual(restored, swappedPropertyNames, 'should return an Array properties that have been restored')

assert.strictEqual(global.somePredefinedFunction, predefinedFunction, 'global.somePredefinedFunction should be restored to previous value')
assert.strictEqual(global.someCustomProperty, undefined, 'global.someCustomProperty should be restored to previous value')
assert.strictEqual(global.anotherCustomProperty, undefined, 'anotherCustomProperty should be restored to previous value')

/** check values are correct from restored */
assert.strictEqual(isNaN(1), false, 'isNaN(1) should be false because 1 is a number')
assert.strictEqual(isNaN('cheese'), true, 'isNaN(cheese) should be true because a string is not a number')

assert.strictNotEqual(WebAssembly, anotherCustomPrimative, 'WebAssembly should not be a string after restore')
assert.strictEqual(typeof (WebAssembly), 'object', 'WebAssembly should be an object because that was the previous type')

assert.strictEqual(global.somePredefinedFunction(), 'this is already being used for a function.', 'global.somePredefinedFunction should be restored as predefinedFunction')
assert.strictEqual(global.somePredefinedPrimative, 'this is already being used for a string.', 'global.somePredefinedPrimative should be restored as predefinedPrimative')

/** confirm held values and pointers have been cleared */
assert.deepStrictEqual(swapGlobal.pending(), [], 'pending should be cleared after restore() is called')
assert.deepStrictEqual(swapGlobal.inMemory(), [], 'inMemory should be cleared after restore() is called')

console.log(`
\u001B[32m✓\u001B[39m ${expected}` Successfully completed all tests
  for ${pkg.name}
`)
