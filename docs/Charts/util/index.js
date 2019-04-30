export function filterNonNumber (array) {
  return array.filter(n => typeof n === 'number')
}