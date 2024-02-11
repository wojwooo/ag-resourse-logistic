const hasOwnProperty = Object.prototype.hasOwnProperty

export const hasOwn = <T extends object, U extends string | symbol>(
  obj: T,
  key: U
): obj is T & Record<U, unknown> => hasOwnProperty.call(obj, key)

export const formatNumber = (value?: number, precision = 0, thousandsSeparator = ' ') => {
  if (value === undefined || value === 0) return ''
  return value.toFixed(precision).replace(/./g, function (c, i, a) {
    return i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? thousandsSeparator + c : c
  })
}
