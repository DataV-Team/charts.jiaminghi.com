export function filterNonNumber(array) {
  return array.filter(n => typeof n === 'number')
}

export function deepMerge(target, merged) {
  for (var key in merged) {
    target[key] = target[key] && target[key].toString() === "[object Object]" ?
      deepMerge(target[key], merged[key]) : target[key] = merged[key]
  }

  return target
}

export function mulAdd(nums) {
  nums = filterNonNumber(nums)

  return nums.reduce((all, num) => all + num, 0)
}

export function mergeSameStackData(item, series) {
  const stack = item.stack

  if (!stack) return [...item.data]

  const stacks = series.filter(({ stack: s }) => s === stack)

  const index = stacks.findIndex(({ data: d }) => d === item.data)

  const datas = stacks.splice(0, index + 1).map(({ data }) => data)

  const dataLength = datas[0].length

  return new Array(dataLength)
    .fill(0)
    .map((foo, i) => mulAdd(datas.map(d => d[i])))
}

export function getTwoPointDistance(pointOne, pointTwo) {
  const minusX = Math.abs(pointOne[0] - pointTwo[0])

  const minusY = Math.abs(pointOne[1] - pointTwo[1])

  return Math.sqrt(minusX * minusX + minusY * minusY)
}