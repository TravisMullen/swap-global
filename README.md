# Swap Global Vars

Set variables in the `global` namespace and restore them once complete.

Don't worry about leaving a messy trail behind you.

## Usage

Define properties values using `swap()`.

```js
swap('somePropertyName', 'someValue')
// will set value of `global.somePropertyName`
```
Can replase existing properties like `isNaN`

```js
swap('isNaN', 'someValue')
// will set value of `global.isNaN` and store default (or previously assigned) value in memory.
```

Check properties assigned `pending()`.

```js
pending()
// returns all properties that have been swapped
// => ['somePropertyName', 'isNaN']
```

Check properties which had previous values using `inMemory()`.

```js
inMemory()
// returns all properties that are currently held in memory
// => ['isNaN']
```

Restore properties using `restore()`. Properties that did not have a value will be reverted to `undefined`.

```js
restore()
// all properties changed using `swap` will be reverted back to previous values.
// typeof('somePropertyName') === 'undefined'
// typeof('isNaN') === 'function'
```

## License

[MIT](LICENSE).
