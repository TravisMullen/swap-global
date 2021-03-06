# Swap Global Property Values

Set temporary variables in the `global` namespace and restore them once complete.

Don't worry about leaving a messy trail behind you.

## Usage

Assign new values to properties using `swap()`.

```js
import { swap } from 'swap-global'

swap('somePropertyName', 'someValue')
// will set value of `global.somePropertyName` to `someValue`
```
Can replace existing properties like `isNaN`

```js
swap('isNaN', 'someValue')
// will set value of `global.isNaN` and store default (or previously assigned) value in memory.
```
Can continuously update with new values and original (pre-swap) value will still be restored.

```js
swap('isNaN', 'someNewValue')
// will set new value of `global.isNaN` and keep original value in memory.
isNaN
// => 'someNewValue'
```

Check properties assigned using `pending()`.

```js
import { pending } from 'swap-global'

pending()
// returns all properties that have been swapped
// => ['somePropertyName', 'isNaN']
```

Check properties which had previous values using `inMemory()`.

```js
import { inMemory } from 'swap-global'

inMemory()
// returns all properties that are currently held in memory
// => ['isNaN']
```

Restore properties using `restore()`. Properties that did not have a value will be reverted to `undefined`.

```js
import { restore } from 'swap-global'

restore()
// all properties changed using `swap` will be reverted back to previous values.
// typeof('somePropertyName') === 'undefined'
// typeof('isNaN') === 'function'
```

## License

[MIT](LICENSE).


[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)


