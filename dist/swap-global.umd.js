(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global['swap-global'] = {})));
}(this, (function (exports) { 'use strict';

  const pendingKeys = [];
  const savedValues = {};

  const inMemory = () => Object.keys(savedValues);
  const pending = () => pendingKeys.slice(0);

  /**
   * Add new value to `global` space.
   * Save old value, if one exists.
   *
   * @param {any} keyname to add to `global`
   * @param {any} value to save in keyname on `global`
   * @return {string} - Resolves to keyname if one was preexisting in 'globals`.
   * @todo set custom namespace, and fallback to window if global is not defined
   */
  const swap = (key, value) => {
    if (global[key]) {
      savedValues[key] = global[key];
    }
    pendingKeys.push(key);
    global[key] = value;
    return savedValues[key]
  };

  /**
   * Restore saved globals back to previous state.
   *
   * @return {Array} - Resolves to Array of restored keynames
   */
  const restore = () => {
    const confirmRestored = [];
    for (const item of pendingKeys) {
      if (typeof (item) === 'string') {
        // restore previous
        if (savedValues[item]) {
          global[item] = savedValues[item];
          // clean up
        } else {
          global[item] = undefined;
        }
        confirmRestored.push(item);
      }
    }
    // remove from pending
    for (const item in confirmRestored) {
      pendingKeys.splice(pendingKeys.findIndex(pending => (
        pending === item
      )), 1);
      if (savedValues[confirmRestored[item]]) {
        delete savedValues[confirmRestored[item]];
      }
    }
    return confirmRestored
  };

  exports.inMemory = inMemory;
  exports.pending = pending;
  exports.swap = swap;
  exports.restore = restore;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
