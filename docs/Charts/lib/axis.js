const { min, max, abs, pow, ceil, floor } = Math

import { axisConfig } from '../config'

import { filterNonNumber, deepMerge, mergeSameStackData } from '../util'

import { deepClone } from '@jiaminghi/c-render/lib/util'

const { xAxisConfig, yAxisConfig } = axisConfig

export function axis (chart, option = {}) {
  let { xAxis, yAxis, series } = option

  if (!xAxis || !yAxis || !series) {
    removeAxis(chart)

    return
  }

  xAxis = deepMerge(deepClone(xAxisConfig, true), xAxis)
  yAxis = deepMerge(deepClone(yAxisConfig, true), yAxis)

  if (!chart.axisLine) chart.axisLine = []
  if (!chart.axisTick) chart.axisTick = []
  if (!chart.axisLabel) chart.axisLabel = []
  if (!chart.axisName) chart.axisName = []
  if (!chart.splitLine) chart.splitLine = []

  let allAxis = getAllAxis(xAxis, yAxis)

  allAxis = calcAxisLabelData(allAxis, series)

  allAxis = setAxisPosition(allAxis)

  allAxis = calcAxisLinePosition(allAxis, chart)

  allAxis = calcAxisTickPosition(allAxis, chart)

  allAxis = calcAxisNamePosition(allAxis, chart)

  allAxis = calcSplitLinePosition(allAxis, chart)

  updateAxisLine(allAxis, chart)

  updateAxisTick(allAxis, chart)

  updateAxisLabel(allAxis, chart)

  updateAxisName(allAxis, chart)

  updateSplitLine(allAxis, chart)

  chart.axisData = allAxis
}

function removeAxis (chart) {
  const { axisLabel, axisLine, axisName, axisTick, splitLine, render } = chart

  if (axisLabel) {
    axisLabel.map(({ graphs }) => graphs.forEach(g => render.delGraph(g)))

    chart.axisLabel = []
  }

  if (axisLine) {
    axisLine.forEach(g => render.delGraph(g))

    chart.axisLine = []
  }

  if (axisName) {
    axisName.forEach(g => render.delGraph(g))

    chart.axisName = []
  }

  if (axisTick) {
    axisTick.map(({ graphs }) => graphs.forEach(g => render.delGraph(g)))

    chart.axisTick = []
  }

  if (splitLine) {
    axisTick.map(({ graphs }) => graphs.forEach(g => render.delGraph(g)))

    chart.splitLine = []
  }
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

  allXAxis = allXAxis.map((axis, i) => ({ ...axis, index: i, axis: 'x' }))
  allYAxis = allYAxis.map((axis, i) => ({ ...axis, index: i, axis: 'y' }))

  return [...allXAxis, ...allYAxis]
}

function calcAxisLabelData (allAxis, series) {
  let valueAxis = allAxis.filter(({ data }) => data === 'value')
  let labelAxis = allAxis.filter(({ data }) => data instanceof Array)

  valueAxis = calcValueAxisLabelData(valueAxis, series)
  labelAxis = calcLabelAxisLabelData(labelAxis)

  return [...valueAxis, ...labelAxis]
}

function calcValueAxisLabelData (valueAxis, series) {
  return valueAxis.map(axis => {
    const minMaxValue = getValueAxisMaxMinValue(axis, series)

    const [min, max] = getTrueMinMax(axis, minMaxValue)

    const interval = getValueInterval(min, max, axis)

    const { axisLabel: { formatter } } = axis

    if (min < 0 && max > 0) {
      let [negative, positive] = [[], []]
      let [currentNegative, currentPositive] = [0, 0]

      do {
        negative.push(currentNegative -= interval)
      } while (currentNegative > min)

      do {
        positive.push(currentPositive += interval)
      } while (currentPositive < max)

      let label = [...negative, 0, ...positive]

      return {
        ...axis,
        maxValue: label.slice(-1)[0],
        minValue: label[0],
        label: getAfterFormatterLabel(label, formatter)
      }
    }

    let [label, currentValue] = [[min], min]

    do {
      label.push(currentValue += interval)
    } while (currentValue < max)

    return {
      ...axis,
      maxValue: label.slice(-1)[0],
      minValue: label[0],
      label: getAfterFormatterLabel(label, formatter)
    }
  })
}

function getAfterFormatterLabel (label, formatter) {
  if (typeof formatter === 'string') label = label.map(l => formatter.replace('{value}', l))
  if (typeof formatter === 'function') label = label.map(l => formatter(l))

  return label
}

function calcLabelAxisLabelData (labelAxis) {
  return labelAxis.map(axis => {
    const { data, axisLabel: { formatter } } = axis

    return { ...axis, label: getAfterFormatterLabel(data, formatter) }
  })
}

function getValueAxisMaxMinValue (axis, series) {
  const { index, axis: axisType } = axis

  series = mergeStackData(series)

  const axisName = axisType + 'Axis'

  let valueSeries = series.filter(s => s[axisName] === index)

  if (!valueSeries.length) valueSeries = series

  return getSeriesMinMaxValue(valueSeries)
}

function mergeStackData (series) {
  series = deepClone(series, true)

  return series.map(item => {
    const data = mergeSameStackData(item, series)

    item.data = data

    return item
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

function getTrueMinMax ({ min, max, axis }, [minValue, maxValue]) {
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
    min = parseInt(minValue - abs(minValue * parseFloat(min) / 100))

    const lever = pow(10, abs(min).toString().length - 1)

    min = floor(min / lever) * lever
  }

  if (maxType === 'string') {
    max = parseInt(maxValue + abs(maxValue * parseFloat(max) / 100))

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
      linePosition = [[x, y], [x, y + h]].reverse()
    } else if (position === 'right') {
      linePosition = [[x + w, y], [x + w, y + h]].reverse()
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
  return allAxis.map(axisItem => {
    let { axis, linePosition, position, label, boundaryGap } = axisItem

    if (typeof boundaryGap !== 'boolean') boundaryGap = axisConfig[axis + 'AxisConfig'].boundaryGap

    const labelNum = label.length

    const [[startX, startY], [endX, endY]] = linePosition

    const gapLength = axis === 'x' ? endX - startX : endY - startY

    const gap = gapLength / (boundaryGap ? labelNum : labelNum - 1)

    const tickPosition = new Array(labelNum)
      .fill(0)
      .map((foo, i) => {
        if (axis === 'x') {
          return [startX + gap * (boundaryGap ? (i + 0.5) : i), startY]
        }

        return [startX, startY + gap * (boundaryGap ? (i + 0.5) : i)]
      })

    const tickLinePosition = getTickLinePosition(axis, boundaryGap, position, tickPosition, gap)

    return {
      ...axisItem,
      tickPosition,
      tickLinePosition,
      tickGap: gap
    }
  })
}

function getTickLinePosition (axisType, boundaryGap, position, tickPosition, gap) {
  let index = axisType === 'x' ? 1 : 0
  let plus = 5

  if (axisType === 'x' && position === 'top') plus = -5
  if (axisType === 'y' && position === 'left') plus = -5

  let tickLinePosition = tickPosition.map(lineStart => {
    const lineEnd = deepClone(lineStart)

    lineEnd[index] += plus

    return [deepClone(lineStart), lineEnd]
  })

  if (!boundaryGap) return tickLinePosition

  index = axisType === 'x' ? 0 : 1
  plus = gap / 2

  tickLinePosition.forEach(([lineStart, lineEnd]) => {
    lineStart[index] += plus
    lineEnd[index] += plus
  })

  return tickLinePosition
}

function calcAxisNamePosition (allAxis, chart) {
  return allAxis.map(axisItem => {
    let { nameGap, nameLocation, position, linePosition } = axisItem

    const [lineStart, lineEnd] = linePosition

    let namePosition = [...lineStart]

    if (nameLocation === 'end') namePosition = [...lineEnd]

    if (nameLocation === 'center') {
      namePosition[0] = (lineStart[0] + lineEnd[0]) / 2
      namePosition[1] = (lineStart[1] + lineEnd[1]) / 2
    }

    let index = 0

    if (position === 'top' && nameLocation === 'center') index = 1
    if (position === 'bottom' && nameLocation === 'center') index = 1
    if (position === 'left' && nameLocation !== 'center') index = 1
    if (position === 'right' && nameLocation !== 'center') index = 1

    let plus = nameGap

    if (position === 'top' && nameLocation !== 'end') plus *= -1
    if (position === 'left' && nameLocation !== 'start') plus *= -1
    if (position === 'bottom' && nameLocation === 'start') plus *= -1
    if (position === 'right' && nameLocation === 'end') plus *= -1

    namePosition[index] += plus

    return {
      ...axisItem,
      namePosition
    }
  })
}

function calcSplitLinePosition (allAxis, chart) {
  const { w, h } = chart.grid.area

  return allAxis.map(axisItem => {
    const { tickLinePosition, position, boundaryGap } = axisItem

    let [index, plus] = [0, w]

    if (position === 'top' || position === 'bottom') index = 1

    if (position === 'top' || position === 'bottom') plus = h

    if (position === 'right' || position === 'bottom') plus *= -1

    const splitLinePosition = tickLinePosition.map(([startPoint]) => {
      const endPoint = [...startPoint]
      endPoint[index] += plus

      return [[...startPoint], endPoint]
    })

    if (!boundaryGap) splitLinePosition.shift()

    return {
      ...axisItem,
      splitLinePosition
    }
  })
}

function updateAxisLine (allAxis, chart) {
  const { render, axisLine: axisLineCache } = chart

  allAxis.forEach(axisItem => {
    const { axis: axisType, index } = axisItem

    const axisIndex = axisType + index

    let graph = axisLineCache.find(({ axisIndex: ai }) => axisIndex === ai)

    let { linePosition, axisLine } = axisItem

    let { show, style } = axisLine

    if (graph) {
      graph.visible = show
      graph.animation('shape', { points: linePosition }, true)
      graph.animation('style', style, true)
      return
    }

    axisLineCache.push(render.add({
      axisIndex,
      name: 'polyline',
      animationCurve: 'easeOutCubic',
      visible: show,
      shape: {
        points: linePosition
      },
      style
    }))
  })
}

function updateAxisTick (allAxis, chart) {
  const { render, axisTick: axisTickCache } = chart

  allAxis.forEach(axisItem => {
    const { axis: axisType, index } = axisItem

    const axisIndex = axisType + index

    let ticks = axisTickCache.find(({ axisIndex: ai }) => axisIndex === ai)

    let { tickLinePosition, axisTick } = axisItem

    let { show, style } = axisTick

    if (ticks) {
      const { graphs } = ticks

      const graphsNum = graphs.length
      const ticksNum = tickLinePosition.length

      if (graphsNum > ticksNum) {
        graphs.splice(ticksNum).forEach(t => render.delGraph(t))
      } else if (graphsNum < ticksNum) {
        graphs.push(...new Array(ticksNum - graphsNum)
          .fill(0)
          .map(foo => render.add({
            name: 'polyline',
            animationCurve: 'easeOutCubic',
            visible: show,
            shape: {
              points: [[0, 0], [0, 0]]
            },
            style
          })))
      }

      graphs.forEach((tick, i) => {
        tick.visible = show
        tick.animation('shape', { points: tickLinePosition[i] }, true)
        tick.animation('style', style, true)
      })

      return
    }

    const graphs = tickLinePosition.map(points => render.add({
      name: 'polyline',
      visible: show,
      animationCurve: 'easeOutCubic',
      shape: {
        points
      },
      style
    }))

    axisTickCache.push({
      axisIndex,
      graphs
    })
  })
}

function updateAxisLabel (allAxis, chart) {
  const { render, axisLabel: axisLabelCache } = chart

  allAxis.forEach(axisItem => {
    const { axis: axisType, index, position } = axisItem

    const axisIndex = axisType + index

    let labels = axisLabelCache.find(({ axisIndex: ai }) => axisIndex === ai)

    let { tickPosition, label, axisLabel } = axisItem

    let { show, style } = axisLabel

    if (labels) {
      const { graphs } = labels

      const graphsNum = graphs.length
      const labelsNum = tickPosition.length

      if (graphsNum > labelsNum) {
        graphs.splice(labelsNum).forEach(l => render.delGraph(l))
      } else if (graphsNum < labelsNum) {
        graphs.push(...new Array(labelsNum - graphsNum)
          .fill(0)
          .map(foo => render.add({
            name: 'text',
            visible: show,
            animationCurve: 'easeOutCubic',
            shape: {
              content: '',
              position: [[0, 0], [0, 0]]
            },
            style: {
              ...style,
              ...getAxisLabelRealAlign(position)
            }
          })))
      }

      graphs.forEach((labelItem, i) => {
        labelItem.visible = show
        labelItem.shape.content = label[i].toString()
        labelItem.animation('shape', { position: getAxisLabelRealPosition(tickPosition[i], position) }, true)
        labelItem.animation('style', {
          ...style,
          ...getAxisLabelRealAlign(position)
        }, true)
      })

      return
    }

    const graphs = tickPosition.map((labelPosition, i) => render.add({
      name: 'text',
      visible: show,
      animationCurve: 'easeOutCubic',
      position,
      shape: {
        content: label[i].toString(),
        position: getAxisLabelRealPosition(labelPosition, position)
      },
      style: {
        ...style,
        ...getAxisLabelRealAlign(position)
      }
    }))

    axisLabelCache.push({
      axisIndex,
      graphs
    })
  })
}

function getAxisLabelRealPosition (points, position) {
  let [index, plus] = [0, 10]

  if (position === 'top' || position === 'bottom') index = 1
  if (position === 'top' || position === 'left') plus = -10

  points = deepClone(points)
  points[index] += plus

  return points
}

function getAxisLabelRealAlign (position) {
  if (position === 'left') return {
    textAlign: 'right',
    textBaseline: 'middle'
  }

  if (position === 'right') return {
    textAlign: 'left',
    textBaseline: 'middle'
  }

  if (position === 'top') return {
    textAlign: 'center',
    textBaseline: 'bottom'
  }

  if (position === 'left') return {
    textAlign: 'center',
    textBaseline: 'top'
  }
}

function updateAxisName (allAxis, chart) {
  const { render, axisName: axisNameCache } = chart

  allAxis.forEach(axisItem => {
    const { axis: axisType, index } = axisItem

    const axisIndex = axisType + index

    let graph = axisNameCache.find(({ axisIndex: ai }) => axisIndex === ai)

    let { position, name, namePosition, nameTextStyle, nameLocation } = axisItem

    if (graph) {
      graph.shape.content = name
      graph.animation('shape', { position: namePosition }, true)
      graph.animation('style', {
        ...nameTextStyle,
        ...getAxisNameRealAlign(position, nameLocation)
      }, true)
      return
    }

    axisNameCache.push(render.add({
      axisIndex,
      name: 'text',
      animationCurve: 'easeOutCubic',
      shape: {
        content: name,
        position: namePosition
      },
      style: {
        ...nameTextStyle,
        ...getAxisNameRealAlign(position, nameLocation)
      }
    }))
  })
}

function getAxisNameRealAlign (position, location) {
  if (
    (position === 'top' && location === 'start') ||
    (position === 'bottom' && location === 'start') ||
    (position === 'left' && location === 'center')
  ) return {
    textAlign: 'right',
    textBaseline: 'middle'
  }

  if (
    (position === 'top' && location === 'end') ||
    (position === 'bottom' && location === 'end') ||
    (position === 'right' && location === 'center')
  ) return {
    textAlign: 'left',
    textBaseline: 'middle'
  }

  if (
    (position === 'top' && location === 'center') ||
    (position === 'left' && location === 'end') ||
    (position === 'right' && location === 'end')
  ) return {
    textAlign: 'center',
    textBaseline: 'bottom'
  }

  if (
    (position === 'bottom' && location === 'center') ||
    (position === 'left' && location === 'start') ||
    (position === 'right' && location === 'start')
  ) return {
    textAlign: 'center',
    textBaseline: 'top'
  }
}

function updateSplitLine (allAxis, chart) {
  const { render, splitLine: splitLineCache } = chart

  allAxis.forEach(axisItem => {
    const { axis, index } = axisItem

    const axisIndex = axis + index

    let splitLines = splitLineCache.find(({ axisIndex: ai }) => axisIndex === ai)

    let { splitLinePosition, splitLine } = axisItem

    let { show, style } = splitLine

    if (splitLines) {
      const { graphs } = splitLines

      const graphsNum = graphs.length
      const splitLinesNum = splitLinePosition.length

      if (graphsNum > splitLinesNum) {
        graphs.splice(splitLinesNum).forEach(t => render.delGraph(t))
      } else if (graphsNum < splitLinesNum) {
        graphs.push(...new Array(splitLinesNum - graphsNum)
          .fill(0)
          .map(foo => render.add({
            name: 'polyline',
            animationCurve: 'easeOutCubic',
            visible: show,
            shape: {
              points: [[0, 0], [0, 0]]
            },
            style
          })))
      }

      graphs.forEach((tick, i) => {
        tick.visible = show
        tick.animation('shape', { points: splitLinePosition[i] }, true)
        tick.animation('style', style, true)
      })

      return
    }

    const graphs = splitLinePosition.map(points => render.add({
      name: 'polyline',
      visible: show,
      animationCurve: 'easeOutCubic',
      shape: {
        points
      },
      style
    }))

    splitLineCache.push({
      axisIndex,
      graphs
    })
  })
}
