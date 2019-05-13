const { min, max, abs, pow, ceil, floor } = Math

import { axisConfig } from '../config'

import { filterNonNumber } from '../util'

import { deepClone } from '@jiaminghi/c-render/lib/util'
import { all } from 'any-promise';

const { xAxisConfig, yAxisConfig } = axisConfig

export function axis (chart, option = {}) {
  option = deepClone(option, true)

  const { xAxis, yAxis, series } = option

  if (!xAxis || !yAxis || !series) return

  if (!chart.axis) chart.axis = []

  let allAxis = getAllAxis(xAxis, yAxis)

  allAxis = calcAxisLabelData(allAxis, series)

  allAxis = setAxisPosition(allAxis)

  allAxis = calcAxisLinePosition(allAxis, chart)

  allAxis = calcAxisTickPosition(allAxis, chart)

  updateAxisLine(allAxis, chart)

  updateAxisTick(allAxis, chart)
}

function getAllAxis (xAxis, yAxis) {
  let [allXAxis, allYAxis] = [[], []]

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

  allXAxis.splice(2)
  allYAxis.splice(2)

  allXAxis = allXAxis.map((axis, i) => ({ ...axis, index: i, axis: 'x'}))
  allYAxis = allYAxis.map((axis, i) => ({ ...axis, index: i, axis: 'y'}))

  return [...allXAxis, ...allYAxis]
}

function calcAxisLabelData (allAxis, series) {
  let valueAxis = allAxis.filter(({ data }) => data === 'value')
  let labelAxis = allAxis.filter(({ data }) => data instanceof Array)

  valueAxis = calcValueAxisLabelData(valueAxis, series)
  labelAxis = labelAxis.map(axis => ({ ...axis, label: axis.data }))

  return [...valueAxis, ...labelAxis]
}

function calcValueAxisLabelData (valueAxis, series) {
  return valueAxis.map(axis => {
    const minMaxValue = getValueAxisMaxMinValue(axis, series)

    const [min, max] = getTrueMinMax(axis, minMaxValue)

    const interval = getValueInterval(min, max, axis)

    if (min < 0 && max > 0) {
      let [negative, positive] = [[], []]
      let [currentNegative, currentPositive] = [0, 0]

      do {
        negative.push(currentNegative -= interval)
      } while (currentNegative > min)

      do {
        positive.push(currentPositive += interval)
      } while (currentPositive < max)

      return {
        ...axis,
        label: [...negative, 0, ...positive]
      }
    }

    let [label, currentValue] = [[min], min]

    do {
      label.push(currentValue += interval)
    } while (currentValue < max)

    return {
      ...axis,
      label
    }
  })
}

function getValueAxisMaxMinValue (axis, series) {
  const { index, axis: axisType } = axis

  const axisName = axisType + 'Axis'

  let valueSeries = series.filter(s => s[axisName] === index)

  if (!valueSeries.length) valueSeries = series

  return getSeriesMinMaxValue(valueSeries)
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

function getTrueMinMax ({min, max, axis}, [minValue, maxValue]) {
  let [minType, maxType] = [typeof min, typeof max]

  if (!testMinMaxType(min)) {
    min = axisConfig[axis + 'AxisConfig'].min
    minType = 'string'
  }

  if (!testMinMaxType(max)) {
    max = axisConfig[axis + 'AxisConfig'].max
    maxType = 'string'
  }

  if (minType === 'number') min = minValue
  if (maxType === 'number') max = maxValue

  if (minType === 'string') {
    min = minValue - abs(parseInt(minValue * parseFloat(min) / 100))

    const lever = pow(10, abs(min).toString().length - 1)

    min = floor(min / lever) * lever
  }

  if (maxType === 'string') {
    max = maxValue + abs(maxValue * parseFloat(max) / 100)

    const lever = pow(10, max.toString().length - 1)

    max = ceil(max / lever) * lever    
  }

  return [min, max]
}

function testMinMaxType (val) {
  const valType = typeof val

  const isValidString = (valType === 'string' && /^\d+%$/.test(val))
  const isValidNumber = valType === 'number'

  return isValidString || isValidNumber
}

function getValueInterval (min, max, axis) {
  let { interval, minInterval, maxInterval, splitNumber, axis: axisType } = axis

  const config = axisConfig[axisType + 'AxisConfig']

  if (typeof interval !== 'number') interval = config.interval
  if (typeof minInterval !== 'number') minInterval = config.minInterval
  if (typeof maxInterval !== 'number') maxInterval = config.maxInterval
  if (typeof splitNumber !== 'number') splitNumber = config.splitNumber

  if (typeof interval === 'number') return interval

  const valueInterval = (max - min) / (splitNumber - 1)

  if (typeof minInterval === 'number' && valueInterval < minInterval) return minInterval

  if (typeof maxInterval === 'number' && valueInterval > maxInterval) return maxInterval

  return valueInterval
}

function setAxisPosition (allAxis) {
  const xAxis = allAxis.filter(({ axis }) => axis === 'x')
  const yAxis = allAxis.filter(({ axis }) => axis === 'y')

  if (xAxis[0] && !xAxis[0].position) xAxis[0].position = xAxisConfig.position
  if (xAxis[1] && !xAxis[1].position) {
    xAxis[1].position = xAxis[0].position === 'bottom' ? 'top' : 'bottom'
  }

  if (yAxis[0] && !yAxis[0].position) yAxis[0].position = yAxisConfig.position
  if (yAxis[1] && !yAxis[1].position) {
    yAxis[1].position = yAxis[0].position === 'left' ? 'right' : 'left'
  }

  return [...xAxis, ...yAxis]
}

function calcAxisLinePosition (allAxis, chart) {
  const { x, y, w, h } = chart.grid.area

  allAxis = allAxis.map(axis => {
    const { position } = axis

    let linePosition = []

    if (position === 'left') {
      linePosition = [[x, y], [x, y + h]]
    } else if (position === 'right') {
      linePosition = [[x + w, y], [x + w, y + h]]
    } else if (position === 'top') {
      linePosition = [[x, y], [x + w, y]]
    } else if (position === 'bottom') {
      linePosition = [[x, y + h], [x + w, y + h]]
    }

    return {
      ...axis,
      linePosition
    }
  })

  // let valueAxis = allAxis.filter(({ data }) => data === 'value')
  // let labelAxis = allAxis.filter(({ data }) => data !== 'value')
  // const hasZero = valueAxis.find(({label}) => label.find(v => v === 0) === 0)

  return allAxis
}

function calcAxisTickPosition (allAxis, chart) {
  const xBoundaryGap = xAxisConfig.boundaryGap
  const yBoundaryGap = yAxisConfig.boundaryGap

  return allAxis.map(axis => {
    let { axis: axisType, linePosition, label, boundaryGap } = axis

    if (typeof boundaryGap !== 'boolean') boundaryGap = axisConfig[axisType + 'AxisConfig'].boundaryGap

    const labelNum = label.length

    const [[startX, startY], [endX, endY]] = linePosition

    const gapLength = axisType === 'x' ? endX - startX : endY - startY

    const gap = gapLength / (boundaryGap ? labelNum : labelNum - 1)

    const tickPosition = new Array(labelNum)
      .fill(0)
      .map((foo, i) => startX + (gap * boundaryGap ? (i + 0.5) : i))

    return {
      ...axis,
      tickPosition,
      tickGap: gap
    }
  })
}

function updateAxisLine (allAxis, chart) {
  const { render, axis } = chart

  allAxis.forEach(axisItem => {
    const { axis: axisType, index } = axisItem

    const axisIndex = axisType + index

    let graph = axis.find(({ axis: tAxis, index: tIndex }) => axisIndex === `${tAxis}${tIndex}`)

    let { linePosition, axisLine } = axisItem

    const axisLineConfig = axisConfig[axisType + 'AxisConfig'].axisLine

    if (!axisLine) axisLine = {}

    let { show, style } = axisLine

    const { show: defaultShow, style: defaultStyle } = axisLineConfig

    if (graph) {
      graph.animation('shape', linePosition, true)

      if (typeof show === 'boolean') graph.visible = show

      if (typeof style === 'object') graph.animation('style', style)

      return
    }

    if (typeof show !== 'boolean') show = defaultShow
    if (typeof style === 'object') {
      Object.assign(deepClone(style, true), axisLine.style)
    } else {
      style = defaultStyle
    }

    axis.push(render.add({
      axisIndex,
      name: 'polyline',
      visible: show,
      shape: {
        points: linePosition
      },
      style
    }))
  })
}

