const pendingKeys = []
const savedValues = {}

export const inMemory = () => Object.keys(savedValues)
export const pending = () => pendingKeys.slice(0)

/**
 * Add new value to `global` space.
 * Save old value, if one exists.
 * If swap `global` value has already been saved,
 * it will be overridden until `restore()` is called.
 *
 * @param {any} keyname to add to `global`
 * @param {any} value to save in keyname on `global`
 * @return {string} - Resolves to keyname if one was preexisting in 'globals`.
 * @todo set custom namespace, and fallback to window if global is not defined
 */
export const swap = (key, value) => {
  if (!pendingKeys.includes(key)) {
    if (global[key]) {
      savedValues[key] = global[key]
    }
    pendingKeys.push(key)
  }
  global[key] = value
  return savedValues[key]
}

/**
 * Restore saved globals back to previous state.
 *
 * @return {Array} - Resolves to Array of restored keynames
 */
export const restore = () => {
  const confirmRestored = []
  for (const item of pendingKeys) {
    if (typeof (item) === 'string') {
      // restore previous
      if (savedValues[item]) {
        global[item] = savedValues[item]
        // clean up
      } else {
        global[item] = undefined
      }
      confirmRestored.push(item)
    }
  }
  // remove from pending
  for (const item in confirmRestored) {
    pendingKeys.splice(pendingKeys.findIndex(pending => (
      pending === item
    )), 1)
    if (savedValues[confirmRestored[item]]) {
      delete savedValues[confirmRestored[item]]
    }
  }
  return confirmRestored
}
