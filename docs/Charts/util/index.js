export function filterNonNumber (array) {
  return array.filter(n => typeof n === 'number')
}

export function deepMerge(target, merged) {
  for (var key in merged) {
    target[key] = target[key] && target[key].toString() === "[object Object]" ?
      deepMerge(target[key], merged[key]) : target[key] = merged[key]
  }

  return target
}