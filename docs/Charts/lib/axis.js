const { min, max } = Math

import { axisConfig } from '../config'

import { filterNonNumber } from '../util'

export function axis (chart, option = {}) {
  const { grid, render } = chart
  const { xAxis, yAxis, series } = option

  if (!xAxis || !yAxis || !series) return

  const [minValue, maxValue] = getSeriesMinMaxValue(series)

  const { allXAxis, allYAxis } = getAllAxis(xAxis, yAxis)

  allXAxis.forEach((axis, i) => {
    if (i > 1) return

  })
}

function getSeriesMinMaxValue (series) {
  if (!series) return

  const minValue = min(
    ...series
    .map(({ data }) => min(...filterNonNumber(data)))
  )

  const maxValue = max(
    ...series
    .map(({ data }) => max(...filterNonNumber(data)))
  )

  return [minValue, maxValue]
}

function getAllAxis (xAxis, yAxis) {
  const [allXAxis, allYAxis] = [[], []]

  if (xAxis instanceof Array) {
    allXAxis.push(...xAxis)
  } else {
    allXAxis.push(xAxis)
  }

  if (yAxis instanceof Array) {
    allYAxis.push(...yAxis)
  } else {
    allYAxis.push(yAxis)
  }

  return { allXAxis, allYAxis }
}