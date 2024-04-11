export const extend = Object.assign

export function isObject(value) {
  return value !== null && typeof value === 'object'
}

export const hasChanged = (value, newVal) => {
  return !Object.is(value, newVal)
}
    
export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);    
