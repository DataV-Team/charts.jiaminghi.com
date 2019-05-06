const { min, max } = Math

import { axisConfig } from '../config'

import { filterNonNumber } from '../util'

import { deepClone } from '@jiaminghi/c-render/lib/util'

const { xAxisConfig, yAxisConfig } = axisConfig

export function axis (chart, option = {}) {
  const { xAxis, yAxis, series } = option

  if (!xAxis || !yAxis || !series) return

  if (!chart.axis) chart.axis = { xAxis: [], yAxis: [] }

  const [minValue, maxValue] = getSeriesMinMaxValue(series)

  const { allXAxis, allYAxis } = getAllAxis(xAxis, yAxis)

  allXAxis.forEach((axis, i) => updateXAxis(chart, axis, i, maxValue, minValue))
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

function updateXAxis (chart, axis, i, maxValue, minValue) {
  const { axis: { xAxis }, render, grid } = chart

  if (i > 1) return

  if (!xAxis[i]) {
    addXAxis(chart, axis, i, maxValue, minValue)

    return
  }


}

function addXAxis (chart, axis, i, maxValue, minValue) {
  chart.axis.xAxis[i] = {}

  addXAxisLine(chart, axis, i, maxValue, minValue)
  addXAxisTick(chart, axis, i, maxValue, minValue)
}

function addXAxisLine (chart, axis, i, maxValue, minValue) {
  const { grid, render } = chart

  const { x, y, w, h } = grid.data

  let { position, offset, axisLine } = axis

  if (!position) position = xAxisConfig.position
  if (!offset) offset = xAxisConfig.offset
  if (axisLine) {
    Object.assign(deepClone(axisConfig.axisLine), axisLine)
  } else {
    axisLine = deepClone(xAxisConfig.axisLine)
  }

  let [startX, startY] = [x, y + h]
  
  startY += offset

  const axisLineGraph = render.add({
    name: 'polyline',
    visible: axisLine.show,
    shape: {
      points: [
        [startX, startY],
        [startX + w, startY]
      ]
    },
    style: axisLine.style
  })

  chart.axis.xAxis[i].axisLine = axisLineGraph
}

function addXAxisTick (chart, axis, i, maxValue, minValue) {
  let { data, min, max, precision, interval, minInterval, boundaryGap, splitNumber, axisTick } = axis

  if (min === undefined) min = xAxisConfig.min
  if (max === undefined) max = xAxisConfig.max
  if (precision === undefined) precision = xAxisConfig.precision
  if (interval === undefined) interval = xAxisConfig.interval
  if (minInterval === undefined) minInterval = xAxisConfig.minInterval
  if (boundaryGap === undefined) boundaryGap = xAxisConfig.boundaryGap
  if (splitNumber === undefined) splitNumber = xAxisConfig.splitNumber

  if (axisTick) {
    Object.assign(deepClone(axisConfig.axisTick), axisTick)
  } else {
    axisTick = deepClone(xAxisConfig.axisTick)
  }

  let label = data

  if (!data) {

  }
}